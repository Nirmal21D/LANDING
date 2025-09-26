export async function GET() {
  console.log('🧪 Testing business registration API connectivity...')
  
  try {
    const testRequest = {
      name: "Test User",
      business_name: "Test Cafe",
      lat_long: "40.7128,-74.0060",
      business_category: "Cafe",
      business_tags: "test, demo, coffee"
    }
    
    console.log('📤 Test registration request:', testRequest)
    
    const response = await fetch('http://localhost:8001/append-csv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest),
    })
    
    console.log('📥 Test response status:', response.status)
    const responseText = await response.text()
    console.log('📥 Test response:', responseText)
    
    return Response.json({
      external_api_status: response.status,
      external_api_ok: response.ok,
      response_preview: responseText,
      test_successful: response.ok
    })
    
  } catch (error) {
    console.error('🚨 Business registration test failed:', error)
    return Response.json({
      error: 'External business registration API test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}