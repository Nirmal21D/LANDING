import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('🔍 === SEARCH BUSINESSES API CALLED ===')
  
  try {
    const body = await request.json()
    console.log('📥 Received request body:', JSON.stringify(body, null, 2))
    
    // Extract and validate fields from the request
    const { 
      user_location, 
      query, 
      max_distance_km = 10000, 
      category_filter, 
      tag_filters = [], 
      limit = 20 
    } = body
    
    console.log('📋 Parsed parameters:', {
      user_location,
      query,
      max_distance_km,
      category_filter,
      tag_filters,
      limit
    })
    
    // Validate user location
    if (!user_location || typeof user_location.lat !== 'number' || typeof user_location.lng !== 'number') {
      console.log('❌ Invalid user location:', user_location)
      return NextResponse.json(
        { error: 'Invalid user location. Expected format: {lat: number, lng: number}' },
        { status: 400 }
      )
    }

    if (!query || typeof query !== 'string') {
      console.log('❌ Invalid query:', query)
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }

    console.log('✅ Validation passed')

    // Transform the request to match the API's expected format
    const apiRequest = {
      user_lat: user_location.lat,
      user_lng: user_location.lng,
      query,
      max_distance_km,
      category_filter: category_filter || undefined,
      tag_filters: Array.isArray(tag_filters) ? tag_filters : [],
      limit
    }

    console.log('🚀 Making request to search API:', 'http://128.199.11.96:8001/search-businesses')
    console.log('📤 Request payload:', JSON.stringify(apiRequest, null, 2))

    // Forward the request to the actual API
    const response = await fetch('http://128.199.11.96:8001/search-businesses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequest),
    })

    console.log('📥 Search API response status:', response.status)
    console.log('📥 Search API response headers:', Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log('📥 Search API response body (first 500 chars):', responseText.slice(0, 500))

    if (!response.ok) {
      console.error(`❌ Search API error: ${response.status} ${response.statusText}`)
      console.error('❌ Response body:', responseText)
      return NextResponse.json(
        { 
          ok: false,
          error: 'External API error',
          details: `API responded with status: ${response.status} - ${responseText}`,
          external_api_status: response.status
        },
        { status: 502 }
      )
    }

    let data
    try {
      data = JSON.parse(responseText)
      console.log('✅ Successfully parsed JSON response')
      console.log('📊 Response data summary:', {
        ok: data.ok,
        results_count: data.results?.length || 0,
        total_found: data.total_found
      })
    } catch (parseError) {
      console.error('❌ Failed to parse search API response as JSON:', parseError)
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

    // Call the search logs endpoint in parallel (non-blocking)
    const searchLogsData = {
      searchQuery: query,
      resultsCount: data.results?.length || 0
    }

    console.log('🔄 Making search logs request to:', 'http://localhost:8005/search-logs')
    console.log('📤 Search logs payload:', JSON.stringify(searchLogsData, null, 2))

    // Make the search logs call but don't wait for it or let it block the main response
    fetch('http://localhost:8005/search-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchLogsData),
    })
    .then(logResponse => {
      if (logResponse.ok) {
        console.log('✅ Search logs API call successful:', logResponse.status)
      } else {
        console.warn('⚠️ Search logs API call failed:', logResponse.status)
      }
    })
    .catch(logError => {
      console.warn('⚠️ Search logs API call error (non-blocking):', logError.message)
    })
    
    // Return the response with proper CORS headers
    console.log('✅ Returning successful response')
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
    
  } catch (error) {
    console.error('🚨 === PROXY API ERROR ===')
    console.error('🚨 Error type:', typeof error)
    console.error('🚨 Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('🚨 Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('🚨 Full error object:', error)
    
    return NextResponse.json(
      { 
        ok: false,
        error: 'Search service temporarily unavailable',
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