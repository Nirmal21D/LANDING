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
    console.log('Request body:', body)
    const { businessHours, website, socialHandles } = body
    
    await connectDB()
    console.log('Connected to DB')

    // Validate businessHours structure if provided
    if (businessHours) {
      const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      const isValidBusinessHours = validDays.every(day => {
        if (!businessHours[day]) return false
        const dayHours = businessHours[day]
        return typeof dayHours.closed === 'boolean' && 
               (dayHours.closed || (typeof dayHours.open === 'string' && typeof dayHours.close === 'string'))
      })
      
      if (!isValidBusinessHours) {
        console.error('Invalid business hours format:', businessHours)
        return NextResponse.json(
          { error: 'Invalid business hours format' },
          { status: 400 }
        )
      }
    }

    // Validate social handles if provided
    if (socialHandles) {
      const validPlatforms = ['facebook', 'instagram', 'twitter', 'linkedin']
      const invalidPlatforms = Object.keys(socialHandles).filter(platform => 
        !validPlatforms.includes(platform)
      )
      
      if (invalidPlatforms.length > 0) {
        console.error('Invalid social platforms:', invalidPlatforms)
        return NextResponse.json(
          { error: `Invalid social platforms: ${invalidPlatforms.join(', ')}` },
          { status: 400 }
        )
      }
    }

    // Update user's business with additional completion data
    const updateData: any = {
      updatedAt: new Date()
    }

    if (businessHours) {
      updateData.businessHours = businessHours
    }

    if (website) {
      updateData.website = website
    }

    if (socialHandles) {
      updateData.socialHandles = socialHandles
    }

    // Auto-approve when additional details are provided
    updateData.status = 'approved'
    updateData.verificationDate = new Date()
    
    console.log('Update data:', updateData)

    const updatedBusiness = await Business.findOneAndUpdate(
      { ownerId: userId },
      updateData,
      { new: true }
    )
    
    console.log('Updated business:', updatedBusiness ? 'Found' : 'Not found')
    
    if (!updatedBusiness) {
      console.error('Business not found for user:', userId)
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      )
    }

    console.log('Business updated successfully')
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