import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import { Business } from '@/lib/models/Business';
import { ObjectId } from 'mongodb';
import BusinessProfileErrorBoundary from '@/components/BusinessProfileErrorBoundary';


interface Props {
  params: { userId: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: { userId: string } }): Promise<Metadata> {
  try {
    await connectDB();
    const { userId } = params;
    // Validate if userId is a valid MongoDB ObjectId
    if (!ObjectId.isValid(userId)) {
      return {
        title: 'Business Not Found',
        description: 'The requested business could not be found.',
      };
    }
    // Find the business by ID
    const business = await Business.findOne({
      _id: userId,
      status: 'approved',
      isActive: true
    }).select('businessName businessDescription businessCategory address');
    if (!business) {
      return {
        title: 'Business Not Found',
        description: 'The requested business could not be found.',
      };
    }
    const title = `${business.businessName} - ${business.businessCategory}`;
    const description = business.businessDescription || `Find ${business.businessName} at ${business.address}`;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        locale: 'en_US',
        siteName: 'Business Directory',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      keywords: [
        business.businessName,
        business.businessCategory,
        'business',
        'directory',
        'local business'
      ].join(', '),
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Business Profile',
      description: 'View business details and information',
    };
  }
}

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return (
    <BusinessProfileErrorBoundary>
      {children}
    </BusinessProfileErrorBoundary>
  );
}