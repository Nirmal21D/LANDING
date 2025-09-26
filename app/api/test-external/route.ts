export async function GET() {
  console.log('🧪 Testing external API connectivity...')
  
  try {
    const testRequest = {
      user_lat: 40.7128,
      user_lng: -74.0060,
      query: 'test',
      max_distance_km: 10000,
      limit: 1
    }
    
    console.log('📤 Test request:', testRequest)
    
    const response = await fetch('http://localhost:8001/search-businesses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest),
    })
    
    console.log('📥 Test response status:', response.status)
    const responseText = await response.text()
    console.log('📥 Test response:', responseText.slice(0, 200))
    
    return Response.json({
      external_api_status: response.status,
      external_api_ok: response.ok,
      response_preview: responseText.slice(0, 200),
      test_successful: response.ok
    })
    
  } catch (error) {
    console.error('🚨 Test failed:', error)
    return Response.json({
      error: 'External API test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}