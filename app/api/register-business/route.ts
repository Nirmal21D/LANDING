import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import connectDB from '@/lib/mongodb'
import { Business } from '@/lib/models/Business'
import { User } from '@/lib/models/User'

export async function POST(request: NextRequest) {
  console.log('🏢 === BUSINESS REGISTRATION API CALLED ===')
  
  try {
    const body = await request.json()
    console.log('📥 Received registration request:', JSON.stringify(body, null, 2))
    
    // Get authenticated user (optional for this endpoint as it's used during registration)
    let userId = null
    try {
      const authData = await auth()
      userId = authData.userId
    } catch (error) {
      console.log('No authenticated user found (this is normal during registration)')
    }
    
    // Extract and validate fields from the request
    const { 
      businessOwnerName, 
      businessName, 
      businessDescription,
      latitude, 
      longitude, 
      businessCategory, 
      businessTags,
      email,
      phone,
      address,
      businessType,
      clerkUserId  // This will be provided by the registration form
    } = body
    
    // Use clerkUserId from body if not authenticated, or use authenticated userId
    const finalUserId = userId || clerkUserId
    
    console.log('📋 Parsed parameters:', {
      businessOwnerName,
      businessName,
      businessDescription: businessDescription?.slice(0, 50) + '...',
      latitude,
      longitude,
      businessCategory,
      businessTags,
      email,
      phone,
      address,
      businessType
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

    // Connect to MongoDB and create business record
    await connectDB()
    
    // Create business record in MongoDB
    const newBusiness = new Business({
      businessOwnerName,
      businessName,
      businessDescription: businessDescription || '',
      email,
      phone: phone || '',
      address: address || '',
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      },
      businessCategory,
      businessType: businessType || businessCategory,
      businessTags: businessTags ? businessTags.split(',').map((tag: string) => tag.trim()) : [],
      ownerId: finalUserId,
      status: 'pending'
    })

    const savedBusiness = await newBusiness.save()
    console.log('✅ Business created in MongoDB:', savedBusiness._id)

    // Update user's businessId reference if user exists
    if (finalUserId) {
      try {
        await User.findOneAndUpdate(
          { clerkUserId: finalUserId },
          { businessId: savedBusiness._id },
          { upsert: false }
        )
        console.log('✅ User business reference updated')
      } catch (error) {
        console.log('⚠️ Could not update user business reference:', error)
      }
    }

    // Transform the request to match the first API's expected format
    const firstApiRequest = {
      name: businessOwnerName,
      business_name: businessName,
      lat_long: `${latitude},${longitude}`,
      business_category: businessCategory,
      business_tags: businessTags || ''
    }

    // Transform the request to match the second API's expected format
    const secondApiRequest = {
      businessName: businessName,
      email: email || '',
      phone: phone || '',
      address: address || '',
      businessType: businessType || businessCategory
    }

    console.log('🚀 Making requests to both external APIs...')
    console.log('📤 First API (append-csv) payload:', JSON.stringify(firstApiRequest, null, 2))
    console.log('📤 Second API (business-registered) payload:', JSON.stringify(secondApiRequest, null, 2))

    // Call both APIs in parallel
    const [firstResponse, secondResponse] = await Promise.allSettled([
      fetch('http://localhost:8001/append-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(firstApiRequest),
      }),
      fetch('http://localhost:8004/business-registered', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(secondApiRequest),
      })
    ])

    console.log('📥 First API response status:', firstResponse.status === 'fulfilled' ? firstResponse.value.status : 'FAILED')
    console.log('📥 Second API response status:', secondResponse.status === 'fulfilled' ? secondResponse.value.status : 'FAILED')

    // Handle first API response
    let firstApiData = null
    let firstApiError = null

    if (firstResponse.status === 'fulfilled' && firstResponse.value.ok) {
      const firstResponseText = await firstResponse.value.text()
      console.log('📥 First API response body:', firstResponseText)
      
      try {
        firstApiData = JSON.parse(firstResponseText)
        console.log('✅ First API (append-csv) successful')
      } catch (parseError) {
        console.error('❌ Failed to parse first API response:', parseError)
        firstApiError = 'Invalid response format from append-csv API'
      }
    } else {
      if (firstResponse.status === 'fulfilled') {
        const errorText = await firstResponse.value.text()
        console.error('❌ First API error:', firstResponse.value.status, errorText)
        firstApiError = `Append-csv API error: ${firstResponse.value.status} - ${errorText}`
      } else {
        console.error('❌ First API failed:', firstResponse.reason)
        firstApiError = `Append-csv API failed: ${firstResponse.reason}`
      }
    }

    // Handle second API response
    let secondApiData = null
    let secondApiError = null

    if (secondResponse.status === 'fulfilled' && secondResponse.value.ok) {
      const secondResponseText = await secondResponse.value.text()
      console.log('📥 Second API response body:', secondResponseText)
      
      try {
        secondApiData = JSON.parse(secondResponseText)
        console.log('✅ Second API (business-registered) successful')
      } catch (parseError) {
        console.error('❌ Failed to parse second API response:', parseError)
        secondApiError = 'Invalid response format from business-registered API'
      }
    } else {
      if (secondResponse.status === 'fulfilled') {
        const errorText = await secondResponse.value.text()
        console.error('❌ Second API error:', secondResponse.value.status, errorText)
        secondApiError = `Business-registered API error: ${secondResponse.value.status} - ${errorText}`
      } else {
        console.error('❌ Second API failed:', secondResponse.reason)
        secondApiError = `Business-registered API failed: ${secondResponse.reason}`
      }
    }

    // Determine overall success status
    const hasFirstApiSuccess = firstApiData && !firstApiError
    const hasSecondApiSuccess = secondApiData && !secondApiError

    if (!hasFirstApiSuccess && !hasSecondApiSuccess) {
      console.error('❌ Both APIs failed')
      return NextResponse.json(
        { 
          ok: false,
          error: 'Both business registration APIs failed',
          details: {
            appendCsvError: firstApiError,
            businessRegisteredError: secondApiError
          }
        },
        { status: 502 }
      )
    }

    // Return combined response
    const combinedResponse = {
      ok: true,
      business: savedBusiness,
      businessId: savedBusiness._id,
      message: 'Business registered successfully',
      appendCsvResult: hasFirstApiSuccess ? {
        success: true,
        data: firstApiData
      } : {
        success: false,
        error: firstApiError
      },
      businessRegisteredResult: hasSecondApiSuccess ? {
        success: true,
        data: secondApiData
      } : {
        success: false,
        error: secondApiError
      },
      // For backward compatibility, include first API data in root level
      ...(hasFirstApiSuccess ? firstApiData : {}),
      // Add business ID from second API if available
      externalBusinessId: secondApiData?.businessId || null
    }

    console.log('✅ Returning combined registration response')
    return NextResponse.json(combinedResponse, {
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