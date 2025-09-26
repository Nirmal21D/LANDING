import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import connectDB from '@/lib/mongodb'
import { Business } from '@/lib/models/Business'

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Ensure user can only update their own data
    if (userId !== params.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { businessHours, website, socialHandles, images } = body
    
    await connectDB()

    // Update user's business with additional completion data
    const updatedBusiness = await Business.findOneAndUpdate(
      { ownerId: userId },
      { 
        businessHours,
        website: website || null,
        socialHandles,
        businessImages: images || [],
        status: 'approved', // Auto-approve when additional details are provided
        verificationDate: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    )
    
    if (!updatedBusiness) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Business profile completed successfully',
      business: updatedBusiness
    })

  } catch (error) {
    console.error('Error completing business profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}