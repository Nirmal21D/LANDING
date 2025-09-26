import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import connectDB from '@/lib/mongodb'
import { Business } from '@/lib/models/Business'
import { User } from '@/lib/models/User'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await auth()
    const { userId: paramUserId } = await params
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Ensure user can only access their own data
    if (userId !== paramUserId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    await connectDB()

    // Find user's business
    const business = await Business.findOne({ ownerId: userId })
    
    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      business
    })

  } catch (error) {
    console.error('Error fetching business data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await auth()
    const { userId: paramUserId } = await params
    
    console.log('Auth userId:', userId)
    console.log('Param userId:', paramUserId)
    
    if (!userId) {
      console.error('No authenticated user')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Ensure user can only update their own data
    if (userId !== paramUserId) {
      console.error('User ID mismatch:', userId, 'vs', paramUserId)
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    console.log('Update request body:', body)
    
    await connectDB()
    console.log('Connected to DB')

    // Validate required fields
    const requiredFields = ['businessOwnerName', 'businessName', 'businessCategory', 'email', 'address']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields)
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Update user's business
    const updatedBusiness = await Business.findOneAndUpdate(
      { ownerId: userId },
      { 
        ...body,
        updatedAt: new Date()
      },
      { new: true }
    )
    
    console.log('Updated business:', updatedBusiness ? 'Success' : 'Not found')
    
    if (!updatedBusiness) {
      console.error('Business not found for user:', userId)
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      )
    }

    console.log('Business update completed successfully')
    return NextResponse.json({
      success: true,
      message: 'Business updated successfully',
      business: updatedBusiness
    })

  } catch (error) {
    console.error('Error updating business data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}