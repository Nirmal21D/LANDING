import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

interface SearchFilters {
  category_filter?: string
  tag_filters: string[]
  enhanced_query: string
  search_type?: 'specific' | 'broad' | 'comprehensive'
  max_distance_km?: number
  limit?: number
}

// Fallback function for when Gemini is unavailable
function generateFiltersLocally(query: string): SearchFilters {
  const queryLower = query.toLowerCase()
  
  // Detect comprehensive searches
  const isComprehensive = /\b(all|find all|list all|every|show all)\b/.test(queryLower)
  const isBroad = /\b(coffee|restaurant|cafe|medical|store|shop|service)\b/.test(queryLower) && !isComprehensive
  
  // Category mapping
  const categoryMatches = {
    'restaurant': 'Restaurant',
    'cafe': 'Cafe',
    'coffee': 'Cafe',
    'medical': 'Medical',
    'clinic': 'Medical',
    'doctor': 'Medical',
    'hospital': 'Medical',
    'repair': 'Service',
    'service': 'Service',
    'fix': 'Service',
    'store': 'Store',
    'shop': 'Store',
    'grocery': 'Store',
    'market': 'Store'
  }
  
  // Tag mapping
  const tagMatches = {
    'coffee': ['coffee', 'espresso', 'cafe'],
    'wifi': ['wifi', 'internet'],
    'veg': ['pure-veg', 'vegetarian'],
    'vegetarian': ['pure-veg', 'vegetarian'],
    'laptop': ['laptop-repair', 'computer'],
    'mobile': ['mobile-repair', 'phone'],
    'organic': ['organic', 'natural'],
    'family': ['family-doctor', 'pediatric'],
    'emergency': ['emergency', '24-hour'],
    'delivery': ['delivery', 'takeout'],
    'parking': ['parking', 'valet'],
    'outdoor': ['outdoor', 'patio', 'garden']
  }
  
  let category_filter: string | undefined
  const tag_filters: string[] = []
  
  // Extract category
  for (const [keyword, category] of Object.entries(categoryMatches)) {
    if (queryLower.includes(keyword)) {
      category_filter = category
      break
    }
  }
  
  // Extract tags
  for (const [keyword, tags] of Object.entries(tagMatches)) {
    if (queryLower.includes(keyword)) {
      tag_filters.push(...tags)
    }
  }
  
  // Remove duplicates
  const uniqueTags = [...new Set(tag_filters)]
  
  // Determine search parameters based on query type
  let search_type: 'specific' | 'broad' | 'comprehensive' = 'specific'
  let max_distance_km = 10
  let limit = 5
  let enhanced_query = query
  
  if (isComprehensive) {
    search_type = 'comprehensive'
    max_distance_km = 50
    limit = 20
    // Enhance query with synonyms for comprehensive search
    if (queryLower.includes('coffee')) {
      enhanced_query = 'coffee cafe espresso coffee shop coffee house'
    } else if (queryLower.includes('restaurant')) {
      enhanced_query = 'restaurant dining food establishment eatery'
    }
  } else if (isBroad) {
    search_type = 'broad'
    max_distance_km = 20
    limit = 10
  }
  
  return {
    category_filter,
    tag_filters: uniqueTags,
    enhanced_query,
    search_type,
    max_distance_km,
    limit
  }
}

async function generateFiltersWithGemini(query: string): Promise<SearchFilters> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const prompt = `
Analyze this business search query and extract structured filters for local business search. Pay special attention to comprehensive queries that ask for "all" or "find all" businesses.

Query: "${query}"

Available Categories:
- Restaurant (food establishments, dining)
- Cafe (coffee shops, cafes, bakeries)
- Medical (hospitals, clinics, doctors, pharmacies)
- Service (repair shops, freelancers, technical services)
- Store (retail, grocery, shopping)

Generate relevant tags that might apply (be specific and practical):
Examples: coffee, espresso, wifi, organic, vegetarian, delivery, parking, 24-hour, emergency, laptop-repair, mobile-repair, family-doctor, etc.

Return ONLY a JSON object in this exact format:
{
  "category_filter": "Category name or null",
  "tag_filters": ["tag1", "tag2"],
  "enhanced_query": "improved search query with better keywords",
  "search_type": "specific or broad or comprehensive",
  "max_distance_km": 5-50,
  "limit": 5-20
}

Rules:
1. category_filter should be one of the 5 categories above or null
2. tag_filters should be an array of 2-5 relevant tags (lowercase, hyphenated)
3. enhanced_query should include synonyms and related terms for comprehensive searches
4. search_type: "comprehensive" for "all/find all" queries, "broad" for general searches, "specific" for targeted needs
5. max_distance_km: 50 for comprehensive, 20 for broad, 5-10 for specific
6. limit: 20 for comprehensive, 10 for broad, 5 for specific
7. For comprehensive searches, enhance query with multiple related keywords
8. Return valid JSON only, no explanations
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()
    
    console.log('Gemini response for filters:', text)
    
    // Try to parse the JSON response
    try {
      const parsed = JSON.parse(text)
      
      // Validate the response structure
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          category_filter: parsed.category_filter || undefined,
          tag_filters: Array.isArray(parsed.tag_filters) ? parsed.tag_filters : [],
          enhanced_query: parsed.enhanced_query || query,
          search_type: parsed.search_type || 'specific',
          max_distance_km: parsed.max_distance_km || 10,
          limit: parsed.limit || 5
        }
      } else {
        throw new Error('Invalid response structure')
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON response:', parseError)
      console.log('Raw response:', text)
      
      // Fallback to local generation
      return generateFiltersLocally(query)
    }
    
  } catch (error) {
    console.error('Gemini API error:', error)
    return generateFiltersLocally(query)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }
    
    console.log('Generating search filters for query:', query)
    
    // Generate filters using Gemini AI
    const filters = await generateFiltersWithGemini(query)
    
    console.log('Generated filters:', filters)
    
    return NextResponse.json({
      success: true,
      filters,
      original_query: query
    })
    
  } catch (error) {
    console.error('Search filter generation error:', error)
    
    // Return fallback response
    const query = 'fallback'
    const fallbackFilters = generateFiltersLocally(query)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate filters',
      filters: fallbackFilters,
      fallback: true
    }, { status: 500 })
  }
}