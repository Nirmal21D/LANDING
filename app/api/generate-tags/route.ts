import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { businessName, businessDescription, businessCategory } = await request.json()

    if (!businessName || !businessDescription) {
      return NextResponse.json(
        { error: 'Business name and description are required' },
        { status: 400 }
      )
    }

    // For now, we'll use a simple tag generation approach
    // You can replace this with actual Gemini API integration
    const generatedTags = generateTagsFromDescription(businessName, businessDescription, businessCategory)

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

function generateTagsFromDescription(name: string, description: string, category?: string): string[] {
  const tags: Set<string> = new Set()

  // Add category-based tags
  if (category) {
    const categoryTags = getCategoryTags(category.toLowerCase())
    categoryTags.forEach(tag => tags.add(tag))
  }

  // Extract keywords from business name
  const nameWords = name.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2)
  
  nameWords.forEach(word => {
    if (!commonWords.has(word)) {
      tags.add(word)
    }
  })

  // Extract keywords from description
  const descWords = description.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3)

  descWords.forEach(word => {
    if (!commonWords.has(word) && businessKeywords.has(word)) {
      tags.add(word)
    }
  })

  // Add service/feature tags based on common phrases
  const commonPhrases = [
    { phrase: /wifi|internet|wireless/i, tag: 'wifi' },
    { phrase: /parking|park/i, tag: 'parking' },
    { phrase: /takeout|take.out|delivery/i, tag: 'takeout' },
    { phrase: /outdoor|patio|terrace/i, tag: 'outdoor seating' },
    { phrase: /credit.card|card.payment|visa|mastercard/i, tag: 'credit cards' },
    { phrase: /cash.only/i, tag: 'cash only' },
    { phrase: /family.friendly|kids|children/i, tag: 'family friendly' },
    { phrase: /pet.friendly|dog.friendly|pets/i, tag: 'pet friendly' },
    { phrase: /24.hour|24\/7|always.open/i, tag: '24 hours' },
    { phrase: /organic|natural|healthy/i, tag: 'organic' },
    { phrase: /vegan|vegetarian/i, tag: 'vegan options' },
    { phrase: /gluten.free/i, tag: 'gluten free' },
    { phrase: /happy.hour|discounts/i, tag: 'happy hour' },
    { phrase: /live.music|entertainment/i, tag: 'live music' },
    { phrase: /catering|events/i, tag: 'catering' },
    { phrase: /reservation|booking/i, tag: 'reservations' }
  ]

  const fullText = `${name} ${description}`
  commonPhrases.forEach(({ phrase, tag }) => {
    if (phrase.test(fullText)) {
      tags.add(tag)
    }
  })

  return Array.from(tags).slice(0, 15) // Limit to 15 tags
}

function getCategoryTags(category: string): string[] {
  const categoryMap: Record<string, string[]> = {
    'cafe': ['coffee', 'espresso', 'latte', 'pastries', 'wifi', 'study'],
    'restaurant': ['dining', 'food', 'meals', 'cuisine', 'service'],
    'retail store': ['shopping', 'products', 'merchandise', 'sales'],
    'healthcare': ['medical', 'health', 'care', 'treatment', 'wellness'],
    'beauty & spa': ['beauty', 'spa', 'relaxation', 'treatments', 'wellness'],
    'automotive': ['cars', 'auto', 'repair', 'service', 'maintenance'],
    'education': ['learning', 'teaching', 'courses', 'training', 'education'],
    'real estate': ['property', 'homes', 'buying', 'selling', 'rental'],
    'technology': ['tech', 'digital', 'software', 'hardware', 'IT'],
    'entertainment': ['fun', 'entertainment', 'games', 'activities'],
    'fitness & sports': ['fitness', 'workout', 'gym', 'sports', 'exercise'],
    'professional services': ['professional', 'consulting', 'services', 'business'],
    'home services': ['home', 'repairs', 'maintenance', 'installation'],
    'travel & tourism': ['travel', 'tourism', 'vacation', 'trips', 'tours']
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
  'coffee', 'food', 'restaurant', 'cafe', 'shop', 'store', 'service', 'care',
  'health', 'beauty', 'auto', 'repair', 'education', 'learning', 'fitness',
  'gym', 'spa', 'salon', 'hotel', 'travel', 'tour', 'real', 'estate',
  'property', 'home', 'house', 'apartment', 'condo', 'office', 'business',
  'professional', 'consulting', 'legal', 'medical', 'dental', 'clinic',
  'hospital', 'pharmacy', 'retail', 'wholesale', 'market', 'grocery',
  'bakery', 'deli', 'pizza', 'burger', 'chinese', 'italian', 'mexican',
  'thai', 'indian', 'japanese', 'fast', 'casual', 'fine', 'dining',
  'breakfast', 'lunch', 'dinner', 'brunch', 'takeout', 'delivery',
  'catering', 'bar', 'pub', 'club', 'entertainment', 'music', 'dance',
  'theater', 'cinema', 'movie', 'games', 'arcade', 'bowling', 'pool',
  'sports', 'recreation', 'park', 'outdoor', 'indoor', 'swimming',
  'tennis', 'golf', 'yoga', 'pilates', 'massage', 'therapy', 'wellness',
  'organic', 'natural', 'healthy', 'vegan', 'vegetarian', 'gluten',
  'fresh', 'local', 'artisan', 'craft', 'handmade', 'custom', 'luxury',
  'premium', 'affordable', 'budget', 'discount', 'sale', 'special',
  'wifi', 'parking', 'accessible', 'family', 'kids', 'pet', 'friendly',
  'credit', 'cash', 'payment', 'reservation', 'booking', 'appointment'
])