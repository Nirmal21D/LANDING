import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import connectDB from '@/lib/mongodb'
import { Business } from '@/lib/models/Business'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()
    
    const business = await Business.findOne({ ownerId: userId })
    
    return NextResponse.json({
      success: true,
      userId,
      businessFound: !!business,
      business: business
    })

  } catch (error) {
    console.error('Test business error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}