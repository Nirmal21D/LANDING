import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('🏢 === BUSINESS REGISTRATION API CALLED ===')
  
  try {
    const body = await request.json()
    console.log('📥 Received registration request:', JSON.stringify(body, null, 2))
    
    // Extract and validate fields from the request
    const { 
      businessOwnerName, 
      businessName, 
      businessDescription,
      latitude, 
      longitude, 
      businessCategory, 
      businessTags 
    } = body
    
    console.log('📋 Parsed parameters:', {
      businessOwnerName,
      businessName,
      businessDescription: businessDescription?.slice(0, 50) + '...',
      latitude,
      longitude,
      businessCategory,
      businessTags
    })

    // Validate required fields
    if (!businessOwnerName || typeof businessOwnerName !== 'string') {
      console.log('❌ Invalid business owner name:', businessOwnerName)
      return NextResponse.json(
        { ok: false, error: 'Business owner name is required and must be a string' },
        { status: 400 }
      )
    }

    if (!businessName || typeof businessName !== 'string') {
      console.log('❌ Invalid business name:', businessName)
      return NextResponse.json(
        { ok: false, error: 'Business name is required and must be a string' },
        { status: 400 }
      )
    }

    if (!latitude || !longitude) {
      console.log('❌ Invalid coordinates:', { latitude, longitude })
      return NextResponse.json(
        { ok: false, error: 'Both latitude and longitude are required' },
        { status: 400 }
      )
    }

    if (!businessCategory || typeof businessCategory !== 'string') {
      console.log('❌ Invalid business category:', businessCategory)
      return NextResponse.json(
        { ok: false, error: 'Business category is required and must be a string' },
        { status: 400 }
      )
    }

    console.log('✅ Validation passed')

    // Transform the request to match the API's expected format
    const apiRequest = {
      name: businessOwnerName,
      business_name: businessName,
      lat_long: `${latitude},${longitude}`,
      business_category: businessCategory,
      business_tags: businessTags || ''
    }

    console.log('🚀 Making request to external API:', 'http://128.199.11.96:8001/append-csv')
    console.log('📤 Request payload:', JSON.stringify(apiRequest, null, 2))

    // Forward the request to the actual API
    const response = await fetch('http://128.199.11.96:8001/append-csv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequest),
    })

    console.log('📥 External API response status:', response.status)
    console.log('📥 External API response headers:', Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log('📥 External API response body:', responseText)

    if (!response.ok) {
      console.error(`❌ External API error: ${response.status} ${response.statusText}`)
      console.error('❌ Response body:', responseText)
      return NextResponse.json(
        { 
          ok: false,
          error: 'Business registration failed',
          details: `External API responded with status: ${response.status} - ${responseText}`,
          external_api_status: response.status
        },
        { status: 502 }
      )
    }

    let data
    try {
      data = JSON.parse(responseText)
      console.log('✅ Successfully parsed JSON response')
      console.log('📊 Registration response:', {
        ok: data.ok,
        appended: data.appended,
        csv_path: data.csv_path,
        coordinates: data.coordinates
      })
    } catch (parseError) {
      console.error('❌ Failed to parse API response as JSON:', parseError)
      console.error('❌ Raw response text:', responseText)
      return NextResponse.json(
        { 
          ok: false,
          error: 'Invalid response format',
          details: 'External API returned invalid JSON',
          raw_response: responseText.slice(0, 200)
        },
        { status: 502 }
      )
    }
    
    // Return the response with proper CORS headers
    console.log('✅ Returning successful registration response')
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
    
  } catch (error) {
    console.error('🚨 === BUSINESS REGISTRATION ERROR ===')
    console.error('🚨 Error type:', typeof error)
    console.error('🚨 Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('🚨 Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('🚨 Full error object:', error)
    
    return NextResponse.json(
      { 
        ok: false,
        error: 'Business registration service temporarily unavailable',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Handle preflight OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}