import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Business } from '@/lib/models/Business';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
    await connectDB();

    const { businessId } = await params;
    console.log("Fetching business with ID:", businessId);
    // Validate if businessId is a valid MongoDB ObjectId
    if (!ObjectId.isValid(businessId)) {
      return NextResponse.json(
        { error: 'Invalid business ID format' },
        { status: 400 }
      );
    }

    // Find the business by ID and only include approved and active businesses
    const business = await Business.findOne({
      _id: new ObjectId(businessId),
      status: { $in: ['approved', 'pending'] },
      isActive: true
    }).select('-__v -ownerId'); // Exclude sensitive fields

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found or not available' },
        { status: 404 }
      );
    }

    return NextResponse.json(business, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching business:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}