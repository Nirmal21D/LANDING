import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
    try {
        const { businessName, businessDescription, businessCategory } = await request.json()

        if (!businessName || !businessDescription) {
            return NextResponse.json(
                { error: 'Business name and description are required' },
                { status: 400 }
            )
        }

        const generatedTags = await generateTagsWithGemini(businessName, businessDescription, businessCategory)

        return NextResponse.json({
            tags: generatedTags,
            success: true
        })

    } catch (error) {
        console.error('Error generating tags:', error)
        return NextResponse.json(
            { error: 'Failed to generate tags' },
            { status: 500 }
        )
    }
}

async function generateTagsWithGemini(name: string, description: string, category?: string): Promise<string[]> {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return generateTagsFromDescription(name, description, category)
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

        const prompt = `
You are a business tagging expert. Generate highly relevant, specific, and concise tags for the following business:

Business Name: ${name}
Business Description: ${description}
${category ? `Business Category: ${category}` : ''}

Instructions:
- Generate 10-15 unique, discoverable tags customers would use to search for this business.
- Include service/feature tags (e.g., "wifi", "parking", "takeout", "outdoor seating").
- Include atmosphere/style tags (e.g., "cozy", "family-friendly", "upscale").
- Include practical tags (e.g., "cash only", "credit cards", "reservations").
- Use lowercase, simple phrases.
- Separate tags with commas.
- Focus on what makes this business discoverable and unique.
- Avoid generic terms like "business" or "service".
- Do not repeat tags.

Example for a coffee shop: coffee, espresso, wifi, outdoor seating, study spot, pastries, laptop friendly, organic, fair trade

Generate tags only (comma-separated list):
`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        const tags = text
            .split(',')
            .map(tag => tag.trim().toLowerCase())
            .filter((tag, i, arr) => tag.length > 0 && tag.length <= 30 && arr.indexOf(tag) === i)
            .slice(0, 15)

        return tags.length > 0 ? tags : generateTagsFromDescription(name, description, category)

    } catch (error) {
        return generateTagsFromDescription(name, description, category)
    }
}

function generateTagsFromDescription(name: string, description: string, category?: string): string[] {
    const tags: Set<string> = new Set()

    if (category) {
        getCategoryTags(category.toLowerCase()).forEach(tag => tags.add(tag))
    }

    extractKeywords(name, 2).forEach(word => {
        if (!commonWords.has(word)) tags.add(word)
    })

    extractKeywords(description, 3).forEach(word => {
        if (!commonWords.has(word) && businessKeywords.has(word)) tags.add(word)
    })

    // Phrase-based tags
    const phraseMap: Array<{ regex: RegExp, tag: string }> = [
        { regex: /\bwifi\b|\binternet\b|\bwireless\b/i, tag: 'wifi' },
        { regex: /\bparking\b|\bpark\b/i, tag: 'parking' },
        { regex: /\btakeout\b|\btake\.out\b|\bdelivery\b/i, tag: 'takeout' },
        { regex: /\boutdoor\b|\bpatio\b|\bterrace\b/i, tag: 'outdoor seating' },
        { regex: /\bcredit\s?card\b|\bcard\s?payment\b|\bvisa\b|\bmastercard\b/i, tag: 'credit cards' },
        { regex: /\bcash\s?only\b/i, tag: 'cash only' },
        { regex: /\bfamily[-\s]?friendly\b|\bkids\b|\bchildren\b/i, tag: 'family friendly' },
        { regex: /\bpet[-\s]?friendly\b|\bdog[-\s]?friendly\b|\bpets\b/i, tag: 'pet friendly' },
        { regex: /\b24\s?hour\b|\b24\/7\b|\balways\s?open\b/i, tag: '24 hours' },
        { regex: /\borganic\b|\bnatural\b|\bhealthy\b/i, tag: 'organic' },
        { regex: /\bvegan\b|\bvegetarian\b/i, tag: 'vegan options' },
        { regex: /\bgluten\s?free\b/i, tag: 'gluten free' },
        { regex: /\bhappy\s?hour\b|\bdiscounts\b/i, tag: 'happy hour' },
        { regex: /\blive\s?music\b|\bentertainment\b/i, tag: 'live music' },
        { regex: /\bcatering\b|\bevents\b/i, tag: 'catering' },
        { regex: /\breservation\b|\bbooking\b/i, tag: 'reservations' },
        { regex: /\blaptop\b|\bstudy\b|\bworkspace\b/i, tag: 'laptop friendly' },
        { regex: /\bcozy\b|\bupscale\b|\bcasual\b|\bromantic\b/i, tag: 'atmosphere' },
        { regex: /\baccessible\b|\bwheelchair\b/i, tag: 'accessible' }
    ]

    const fullText = `${name} ${description}`
    phraseMap.forEach(({ regex, tag }) => {
        if (regex.test(fullText)) tags.add(tag)
    })

    // Remove duplicates, limit to 15, sort by relevance (length, then alphabetically)
    return Array.from(tags)
        .filter(tag => tag.length > 1)
        .sort((a, b) => a.length - b.length || a.localeCompare(b))
        .slice(0, 15)
}

function extractKeywords(text: string, minLength: number): string[] {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > minLength)
}

function getCategoryTags(category: string): string[] {
    const categoryMap: Record<string, string[]> = {
        'cafe': ['coffee', 'espresso', 'latte', 'pastries', 'wifi', 'study spot', 'organic'],
        'restaurant': ['dining', 'food', 'cuisine', 'reservations', 'family friendly', 'parking'],
        'retail store': ['shopping', 'products', 'merchandise', 'sales', 'cash only'],
        'healthcare': ['medical', 'health', 'wellness', 'clinic', 'appointments'],
        'beauty & spa': ['beauty', 'spa', 'relaxation', 'treatments', 'organic', 'appointments'],
        'automotive': ['cars', 'auto', 'repair', 'service', 'maintenance', 'parking'],
        'education': ['learning', 'courses', 'training', 'education', 'study spot'],
        'real estate': ['property', 'homes', 'buying', 'selling', 'rental', 'appointments'],
        'technology': ['tech', 'digital', 'software', 'hardware', 'it', 'wifi'],
        'entertainment': ['fun', 'entertainment', 'games', 'activities', 'live music'],
        'fitness & sports': ['fitness', 'workout', 'gym', 'sports', 'exercise', 'wellness'],
        'professional services': ['professional', 'consulting', 'services', 'appointments'],
        'home services': ['home', 'repairs', 'maintenance', 'installation', 'appointments'],
        'travel & tourism': ['travel', 'tourism', 'vacation', 'trips', 'tours', 'reservations']
    }
    return categoryMap[category] || []
}

const commonWords = new Set([
    'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had',
    'will', 'would', 'could', 'should', 'can', 'may', 'might', 'must',
    'this', 'that', 'these', 'those', 'a', 'an', 'we', 'our', 'you', 'your'
])

const businessKeywords = new Set([
    'coffee', 'espresso', 'latte', 'pastries', 'wifi', 'study', 'organic',
    'dining', 'food', 'cuisine', 'reservations', 'family', 'friendly', 'parking',
    'shopping', 'products', 'merchandise', 'sales', 'cash', 'medical', 'health',
    'wellness', 'clinic', 'appointments', 'beauty', 'spa', 'relaxation', 'treatments',
    'cars', 'auto', 'repair', 'service', 'maintenance', 'learning', 'courses',
    'training', 'education', 'property', 'homes', 'buying', 'selling', 'rental',
    'tech', 'digital', 'software', 'hardware', 'it', 'fun', 'entertainment',
    'games', 'activities', 'live', 'music', 'fitness', 'workout', 'gym', 'sports',
    'exercise', 'professional', 'consulting', 'home', 'repairs', 'installation',
    'travel', 'tourism', 'vacation', 'trips', 'tours', 'restaurant', 'cafe',
    'shop', 'store', 'service', 'care', 'beauty', 'auto', 'repair', 'education',
    'learning', 'fitness', 'gym', 'spa', 'salon', 'hotel', 'travel', 'tour',
    'real', 'estate', 'property', 'home', 'house', 'apartment', 'condo', 'office',
    'business', 'professional', 'consulting', 'legal', 'medical', 'dental',
    'clinic', 'hospital', 'pharmacy', 'retail', 'wholesale', 'market', 'grocery',
    'bakery', 'deli', 'pizza', 'burger', 'chinese', 'italian', 'mexican', 'thai',
    'indian', 'japanese', 'fast', 'casual', 'fine', 'dining', 'breakfast',
    'lunch', 'dinner', 'brunch', 'takeout', 'delivery', 'catering', 'bar', 'pub',
    'club', 'entertainment', 'music', 'dance', 'theater', 'cinema', 'movie',
    'games', 'arcade', 'bowling', 'pool', 'sports', 'recreation', 'park',
    'outdoor', 'indoor', 'swimming', 'tennis', 'golf', 'yoga', 'pilates',
    'massage', 'therapy', 'wellness', 'organic', 'natural', 'healthy', 'vegan',
    'vegetarian', 'gluten', 'fresh', 'local', 'artisan', 'craft', 'handmade',
    'custom', 'luxury', 'premium', 'affordable', 'budget', 'discount', 'sale',
    'special', 'wifi', 'parking', 'accessible', 'family', 'kids', 'pet',
    'friendly', 'credit', 'cash', 'payment', 'reservation', 'booking',
    'appointment', 'workspace', 'cozy', 'upscale', 'casual', 'romantic'
])
