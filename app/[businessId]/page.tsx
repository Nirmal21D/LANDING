"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Globe, Clock, Facebook, Instagram, Twitter, Linkedin, Star, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BusinessMap from "@/components/ui/business-map";

interface BusinessHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

interface BusinessData {
  _id: string;
  businessOwnerName: string;
  businessName: string;
  businessDescription: string;
  email: string;
  phone: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  businessCategory: string;
  businessType: string;
  businessTags: string[];
  businessHours: BusinessHours;
  website: string;
  socialHandles: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
  status: string;
  verificationDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BusinessProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const businessId = params.businessId as string;

  useEffect(() => {
    if (businessId) {
      fetchBusiness();
    }
  }, [businessId]);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/business/${businessId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError("Business not found or not available");
        } else if (response.status === 400) {
          setError("Invalid business ID");
        } else {
          setError("Failed to load business details");
        }
        return;
      }
      // Defensive: check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Unexpected server response:", text);
        setError("Unexpected server response. Please try again later.");
        return;
      }
      const data = await response.json();
      setBusiness(data);
    } catch (err) {
      setError("Failed to load business details");
      console.error("Error fetching business:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: business?.businessName,
          text: business?.businessDescription,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "Business profile link copied to clipboard",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const getCurrentDayHours = () => {
    if (!business?.businessHours) return null;
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const today = days[new Date().getDay()] as keyof BusinessHours;
    return business.businessHours[today];
  };

  const formatBusinessHours = (hours: BusinessHours) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    return days.map((day, index) => {
      const dayKey = dayKeys[index] as keyof BusinessHours;
      const dayHours = hours[dayKey];
      if (dayHours.closed) {
        return `${day}: Closed`;
      }
      return `${day}: ${dayHours.open} - ${dayHours.close}`;
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Oops!</h1>
          <p className="text-gray-600 mb-6">{error || "Business not found"}</p>
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const currentHours = getCurrentDayHours();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#101014]">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white dark:bg-[#18181c] rounded-lg shadow-sm p-6 mb-6 border border-border/50">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{business.businessName}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{business.businessDescription}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="text-sm">{business.businessCategory}</Badge>
                {business.businessTags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-sm">{tag}</Badge>
                ))}
              </div>
            </div>
            <Button onClick={handleShare} variant="outline" size="sm" className="dark:bg-[#23232a] dark:text-white dark:border-gray-700">
              <Share2 className="w-4 h-4 mr-2" />Share
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card className="bg-white dark:bg-[#18181c] border border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Phone className="w-5 h-5" />Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                <span className="text-sm text-gray-800 dark:text-gray-200">{business.address}</span>
              </div>
              {business.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                  <a href={`tel:${business.phone}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">{business.phone}</a>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                <a href={`mailto:${business.email}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">{business.email}</a>
              </div>
              {business.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                  <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Visit Website</a>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Business Hours */}
          {business.businessHours && (
            <Card className="bg-white dark:bg-[#18181c] border border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Clock className="w-5 h-5" />Business Hours
                  {currentHours && !currentHours.closed && (
                    <Badge variant="default" className="ml-2 text-xs">Open Now</Badge>
                  )}
                  {currentHours && currentHours.closed && (
                    <Badge variant="secondary" className="ml-2 text-xs">Closed Today</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
                  {formatBusinessHours(business.businessHours).map((schedule, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{schedule}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {/* Social Media Links */}
          {(business.socialHandles?.facebook || business.socialHandles?.instagram || business.socialHandles?.twitter || business.socialHandles?.linkedin) && (
            <Card className="bg-white dark:bg-[#18181c] border border-border/50">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Social Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {business.socialHandles?.facebook && (
                    <a href={business.socialHandles.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"><Facebook className="w-6 h-6" /></a>
                  )}
                  {business.socialHandles?.instagram && (
                    <a href={business.socialHandles.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-300"><Instagram className="w-6 h-6" /></a>
                  )}
                  {business.socialHandles?.twitter && (
                    <a href={business.socialHandles.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-200"><Twitter className="w-6 h-6" /></a>
                  )}
                  {business.socialHandles?.linkedin && (
                    <a href={business.socialHandles.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"><Linkedin className="w-6 h-6" /></a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          {/* Map Section */}
          <Card className="bg-white dark:bg-[#18181c] border border-border/50">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full flex flex-col items-center">
                <div className="w-full max-w-2xl">
                  <div className="bg-card dark:bg-[#23232a] border border-border rounded-xl shadow-sm p-4">
                    <BusinessMap 
                      businessInfo={{
                        name: business.businessName,
                        latitude: business.location.latitude,
                        longitude: business.location.longitude,
                        rating: 0, // No rating in schema, set to 0 or fetch if available
                        category: business.businessCategory
                      }}
                      competitors={[]}
                      className="rounded-lg"
                    />
                    <div className="mt-4 flex justify-center">
                      <a 
                        href={`https://www.google.com/maps?q=${business.location.latitude},${business.location.longitude}`}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary dark:text-blue-400 hover:underline text-sm font-medium transition-colors"
                      >
                        View on Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Business Info */}
          <Card className="bg-white dark:bg-[#18181c] border border-border/50">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-800 dark:text-gray-200">
              <div><span className="font-semibold text-sm">Owner:</span><span className="ml-2 text-sm">{business.businessOwnerName}</span></div>
              <div><span className="font-semibold text-sm">Category:</span><span className="ml-2 text-sm">{business.businessCategory}</span></div>
              {business.businessType && (<div><span className="font-semibold text-sm">Type:</span><span className="ml-2 text-sm">{business.businessType}</span></div>)}
              <div><span className="font-semibold text-sm">Established:</span><span className="ml-2 text-sm">{new Date(business.createdAt).toLocaleDateString()}</span></div>
            </CardContent>
          </Card>
          {/* Reviews Section - Placeholder */}
          <Card className="lg:col-span-2 bg-white dark:bg-[#18181c] border border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white"><Star className="w-5 h-5" />Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Star className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                <p className="text-sm">Be the first to leave a review for {business.businessName}</p>
                <Button className="mt-4" variant="outline">Write a Review</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 dark:text-gray-400 text-sm">
          <p>Business profile • Last updated {new Date(business.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
