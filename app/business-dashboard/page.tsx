"use client"

import React, { useState, useEffect } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Building2, 
  Eye, 
  TrendingUp, 
  MapPin, 
  Star, 
  Calendar, 
  Users, 
  Phone,
  Mail,
  Clock,
  Settings,
  LogOut,
  Edit,
  Share2,
  BarChart3,
  MessageSquare,
  FileText,
  Search,
  Target,
  AlertTriangle,
  Info,
  Activity,
  PieChart,
  LineChart,
  Coffee,
  Wrench,
  ShoppingBag,
  Utensils,
  Zap,
  MessageCircle,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Plus
} from "lucide-react"
import Link from "next/link"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import LocationMap from "@/components/ui/location-map"
import BusinessMap from "@/components/ui/business-map"

export default function BusinessDashboard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [businessData, setBusinessData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [showPendingForm, setShowPendingForm] = useState(false)
  const [isBusinessCompleted, setIsBusinessCompleted] = useState(false)
  const [pendingFormData, setPendingFormData] = useState({
    businessHours: {
      monday: { open: '', close: '', closed: false },
      tuesday: { open: '', close: '', closed: false },
      wednesday: { open: '', close: '', closed: false },
      thursday: { open: '', close: '', closed: false },
      friday: { open: '', close: '', closed: false },
      saturday: { open: '', close: '', closed: false },
      sunday: { open: '', close: '', closed: false }
    },
    website: '',
    socialHandles: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: ''
    }
  })
  const [isSubmittingPending, setIsSubmittingPending] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login')
    }
  }, [isLoaded, isSignedIn, router])

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch business data when user is loaded
  useEffect(() => {
    if (isLoaded && isSignedIn && user && mounted) {
      fetchBusinessData()
    }
  }, [isLoaded, isSignedIn, user, mounted])

  // Pre-populate form data with existing business data
  useEffect(() => {
    if (businessData && businessData.businessHours) {
      setPendingFormData(prev => ({
        ...prev,
        businessHours: businessData.businessHours || prev.businessHours,
        website: businessData.website || '',
        socialHandles: businessData.socialHandles || {
          facebook: '',
          instagram: '',
          twitter: '',
          linkedin: ''
        }
      }))
    }
  }, [businessData])

  const fetchBusinessData = async () => {
    try {
      // Fetch business data from your API
      const response = await fetch(`/api/business/${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.business) {
          // Map business data to expected format
          const business = data.business
          
          // Check if business has completed ALL additional information
          const hasBusinessHours = business.businessHours && Object.values(business.businessHours).some((day: any) => 
            day.closed || (day.open && day.close)
          )
          const hasWebsite = business.website && business.website.trim() !== ''
          const hasSocialHandles = business.socialHandles && Object.values(business.socialHandles).some((handle: any) => 
            handle && typeof handle === 'string' && handle.trim() !== ''
          )
          
          // Require business hours AND (website OR social media) for pending businesses
          const hasAllRequiredInfo = hasBusinessHours && (hasWebsite || hasSocialHandles)
          
          setIsBusinessCompleted(hasAllRequiredInfo || business.status === 'approved')
          
          // If business is pending and hasn't completed ALL additional info, force show pending form
          if (business.status === 'pending' && !hasAllRequiredInfo) {
            setShowPendingForm(true)
          }
          
          setBusinessData({
            name: business.businessName,
            ownerName: business.businessOwnerName,
            category: business.businessCategory,
            description: business.businessDescription || "No description provided",
            address: business.address,
            phone: business.phone || "Not provided",
            email: business.email,
            tags: business.businessTags || [],
            location: business.location,
            status: business.status,
            businessType: business.businessType || "Not specified",
            isActive: business.isActive,
            createdAt: business.createdAt,
            updatedAt: business.updatedAt,
            businessHours: business.businessHours || null,
            website: business.website || null,
            socialHandles: business.socialHandles || {},
            businessImages: business.businessImages || [],
            // Default values for metrics (these would come from analytics API later)
            rating: null,
            totalReviews: null,
            monthlyViews: null,
            profileCompletion: null,
            lastUpdated: business.updatedAt
          })
        } else {
          throw new Error('No business found')
        }
      } else {
        // Use mock data if no business found
        setBusinessData({
          name: `${user?.firstName}'s Business`,
          category: "Business",
          address: "Please complete your business registration",
          phone: "Add your phone number",
          email: user?.primaryEmailAddress?.emailAddress || "",
          description: "Complete your business profile to get started!",
          status: "pending",
          rating: 0,
          totalReviews: 0,
          monthlyViews: 0,
          profileCompletion: 25,
          lastUpdated: new Date().toISOString(),
          isRegistered: false
        })
      }
    } catch (error) {
      console.error('Error fetching business data:', error)
      // Use fallback data
      setBusinessData({
        name: `${user?.firstName}'s Business`,
        category: "Business",
        address: "Please complete your business registration",
        phone: "Add your phone number",
        email: user?.primaryEmailAddress?.emailAddress || "",
        description: "Complete your business profile to get started!",
        status: "pending",
        rating: 0,
        totalReviews: 0,
        monthlyViews: 0,
        profileCompletion: 25,
        lastUpdated: new Date().toISOString(),
        isRegistered: false
      })
    } finally {
      setLoading(false)
    }
  }

  const handleHoursChange = (day: string, field: string, value: string) => {
    setPendingFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day as keyof typeof prev.businessHours],
          [field]: value
        }
      }
    }))
  }

  const toggleDayClosed = (day: string) => {
    setPendingFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day as keyof typeof prev.businessHours],
          closed: !prev.businessHours[day as keyof typeof prev.businessHours].closed,
          open: '',
          close: ''
        }
      }
    }))
  }

  const handleSocialChange = (platform: string, value: string) => {
    setPendingFormData(prev => ({
      ...prev,
      socialHandles: {
        ...prev.socialHandles,
        [platform]: value
      }
    }))
  }

  const submitPendingData = async () => {
    setIsSubmittingPending(true)
    try {
      // Client-side validation
      const hasBusinessHours = Object.values(pendingFormData.businessHours).some((day: any) => 
        day.closed || (day.open && day.close)
      )
      const hasWebsite = pendingFormData.website && pendingFormData.website.trim() !== ''
      const hasSocialHandles = Object.values(pendingFormData.socialHandles).some((handle: any) => 
        handle && handle.trim() !== ''
      )
      
      if (!hasBusinessHours) {
        alert('Please set your business hours for at least one day')
        return
      }
      
      if (!hasWebsite && !hasSocialHandles) {
        alert('Please provide either a website URL or at least one social media profile')
        return
      }
      
      console.log('Submitting data:', pendingFormData)
      console.log('Validation passed:', { hasBusinessHours, hasWebsite, hasSocialHandles })
      
      const response = await fetch(`/api/business/${user?.id}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pendingFormData),
      })

      console.log('Response status:', response.status)
      const responseData = await response.json()
      console.log('Response data:', responseData)

      if (response.ok) {
        console.log('Business updated successfully')
        // Refresh business data
        await fetchBusinessData()
        setShowPendingForm(false)
        setIsBusinessCompleted(true)
        
        // Show success message
        alert('Business information updated successfully!')
      } else {
        console.error('Update failed:', responseData)
        alert(`Failed to update business information: ${responseData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating business:', error)
      alert('An error occurred while updating business information')
    } finally {
      setIsSubmittingPending(false)
    }
  }

  // Show loading state
  if (!mounted || !isLoaded || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Show sign-in prompt if not authenticated
  if (!isSignedIn) {
    return null // Will redirect in useEffect
  }

  // Show business registration prompt if no business found
  if (!loading && businessData && businessData.isRegistered === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-border/50 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Building2 className="w-12 h-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Complete Your Business Registration</CardTitle>
            <CardDescription className="text-base mt-2">
              To access your business dashboard, you need to complete your business registration first.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="p-6 bg-muted/30 rounded-lg border border-border/30">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Add your business information
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Set your location and contact details
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Start managing your business presence
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Link href="/business-register?step=business">
                <Button className="gap-2">
                  <Building2 className="w-4 h-4" />
                  Register My Business
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show business completion form if pending and not completed
  if (!loading && businessData && businessData.status === 'pending' && !isBusinessCompleted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="w-full flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">Complete Your Business Profile</h1>
                  <p className="text-sm text-muted-foreground">{businessData.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AnimatedThemeToggler />
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                    userButtonPopoverCard: 'border-border bg-card',
                    userButtonPopoverActions: 'text-foreground'
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full px-6 py-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Mandatory Business Completion Form */}
            <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-800">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                    <Clock className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-orange-800 dark:text-orange-200">
                  Complete Your Business Profile
                </CardTitle>
                <CardDescription className="text-orange-700 dark:text-orange-300 text-base mt-2">
                  Please provide your business hours and at least one way for customers to find you online (website or social media) to access the full dashboard.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-8">
                  
                  {/* Business Hours Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Business Hours *</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Please set your business operating hours. This helps customers know when you're open.
                    </p>
                    <div className="space-y-3">
                      {Object.entries(pendingFormData.businessHours).map(([day, hours]) => (
                        <div key={day} className="flex items-center gap-4 p-3 bg-background rounded-lg border border-border/50">
                          <div className="w-24">
                            <p className="font-medium capitalize text-sm">{day}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`${day}-closed`}
                              checked={hours.closed}
                              onChange={() => toggleDayClosed(day)}
                              className="rounded"
                            />
                            <Label htmlFor={`${day}-closed`} className="text-sm">Closed</Label>
                          </div>
                          {!hours.closed && (
                            <div className="flex items-center gap-2">
                              <Input
                                type="time"
                                value={hours.open}
                                onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                                className="w-32"
                              />
                              <span className="text-muted-foreground">to</span>
                              <Input
                                type="time"
                                value={hours.close}
                                onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                                className="w-32"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Website Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Website *</h3>
                      <span className="text-sm text-muted-foreground">(Website OR Social Media required)</span>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website URL</Label>
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://www.yourwebsite.com"
                        value={pendingFormData.website}
                        onChange={(e) => setPendingFormData(prev => ({ ...prev, website: e.target.value }))}
                        className="max-w-md"
                      />
                    </div>
                  </div>

                  {/* Social Media Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Social Media *</h3>
                      <span className="text-sm text-muted-foreground">(Website OR Social Media required)</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add at least one social media profile to help customers find and connect with your business.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="facebook" className="flex items-center gap-2">
                          <Facebook className="w-4 h-4 text-blue-600" />
                          Facebook
                        </Label>
                        <Input
                          id="facebook"
                          type="url"
                          placeholder="https://facebook.com/yourpage"
                          value={pendingFormData.socialHandles.facebook}
                          onChange={(e) => handleSocialChange('facebook', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="instagram" className="flex items-center gap-2">
                          <Instagram className="w-4 h-4 text-pink-600" />
                          Instagram
                        </Label>
                        <Input
                          id="instagram"
                          type="url"
                          placeholder="https://instagram.com/yourpage"
                          value={pendingFormData.socialHandles.instagram}
                          onChange={(e) => handleSocialChange('instagram', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="twitter" className="flex items-center gap-2">
                          <Twitter className="w-4 h-4 text-blue-400" />
                          Twitter
                        </Label>
                        <Input
                          id="twitter"
                          type="url"
                          placeholder="https://twitter.com/yourpage"
                          value={pendingFormData.socialHandles.twitter}
                          onChange={(e) => handleSocialChange('twitter', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="linkedin" className="flex items-center gap-2">
                          <Linkedin className="w-4 h-4 text-blue-700" />
                          LinkedIn
                        </Label>
                        <Input
                          id="linkedin"
                          type="url"
                          placeholder="https://linkedin.com/company/yourpage"
                          value={pendingFormData.socialHandles.linkedin}
                          onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col gap-4 pt-4 border-t border-border">
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <Info className="w-4 h-4 inline mr-2" />
                        At minimum, please set your business hours to continue. Website and social media links are optional but recommended.
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={async () => {
                          try {
                            const response = await fetch('/api/test-business')
                            const data = await response.json()
                            console.log('Test API response:', data)
                            alert(`Test API: ${JSON.stringify(data, null, 2)}`)
                          } catch (error) {
                            console.error('Test API error:', error)
                            alert('Test API failed')
                          }
                        }}
                        variant="outline"
                        className="gap-2"
                      >
                        Test API
                      </Button>
                      <Button
                        onClick={submitPendingData}
                        disabled={isSubmittingPending}
                        className="gap-2 px-8"
                      >
                        {isSubmittingPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Building2 className="w-4 h-4" />
                            Complete Profile & Access Dashboard
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const businessInfo = businessData || {}

  const stats = [
    {
      title: "Total Views",
      value: "2,847",
      change: "+12.5%",
      icon: Eye,
      color: "text-blue-600"
    },
    {
      title: "This Month",
      value: "1,234",
      change: "+8.2%",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Profile Rating",
      value: "4.6",
      change: "+0.3",
      icon: Star,
      color: "text-yellow-600"
    },
    {
      title: "Search Ranking",
      value: "#3",
      change: "+2",
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ]

  const searchMetrics = {
    totalSearches: 1847,
    weeklySearches: [23, 45, 67, 34, 56, 78, 45],
    topSearchTerms: [
      { term: "coffee near me", count: 234, trend: "+15%" },
      { term: "starbucks manhattan", count: 189, trend: "+8%" },
      { term: "best coffee shop", count: 156, trend: "+22%" },
      { term: "coffee delivery", count: 98, trend: "+5%" }
    ]
  }

  const competitorInsights = [
    {
      title: "New Competitor Alert",
      description: "Blue Bottle Coffee opened 0.3 miles away",
      impact: "high",
      action: "Consider adjusting your marketing strategy",
      icon: AlertTriangle,
      color: "text-red-600"
    },
    {
      title: "Market Trend",
      description: "Cold brew searches increased by 35% this month",
      impact: "medium",
      action: "Promote your cold brew offerings",
      icon: TrendingUp,
      color: "text-orange-600"
    },
    {
      title: "Peak Hours Shift",
      description: "More customers searching during 2-4 PM",
      impact: "low",
      action: "Consider afternoon promotions",
      icon: Clock,
      color: "text-blue-600"
    }
  ]

  const performanceData = {
    visibilityScore: 85,
    searchRanking: 3,
    categoryRanking: 7,
    competitorComparison: {
      yourRating: 4.6,
      avgRating: 4.2,
      yourViews: 1234,
      avgViews: 890
    }
  }

  const recentActivity = [
    {
      id: 1,
      type: "search",
      message: "45 people searched for your business",
      time: "2 hours ago",
      icon: Search
    },
    {
      id: 2,
      type: "review",
      message: "New 5-star review received",
      time: "5 hours ago",
      icon: Star
    },
    {
      id: 3,
      type: "update",
      message: "Business information updated",
      time: "1 day ago",
      icon: Edit
    },
    {
      id: 4,
      type: "contact",
      message: "3 contact requests received",
      time: "2 days ago",
      icon: MessageSquare
    }
  ]

  const nearbyCompetitors = [
    {
      id: 1,
      name: "Blue Bottle Coffee",
      latitude: 40.7614,
      longitude: -73.9776,
      rating: 4.3,
      category: "Coffee Shop",
      distance: "0.3 miles",
      status: "Open",
      hours: "6:00 AM - 8:00 PM"
    },
    {
      id: 2,
      name: "Joe Coffee",
      latitude: 40.7505,
      longitude: -73.9934,
      rating: 4.2,
      category: "Coffee Shop",
      distance: "0.5 miles",
      status: "Open",
      hours: "7:00 AM - 7:00 PM"
    },
    {
      id: 3,
      name: "Irving Farm Coffee",
      latitude: 40.7648,
      longitude: -73.9808,
      rating: 4.4,
      category: "Coffee Shop",
      distance: "0.4 miles",
      status: "Open",
      hours: "6:30 AM - 8:30 PM"
    },
    {
      id: 4,
      name: "McDonald's",
      latitude: 40.7580,
      longitude: -73.9855,
      rating: 3.8,
      category: "Fast Food",
      distance: "0.2 miles",
      status: "Open",
      hours: "24 hours"
    },
    {
      id: 5,
      name: "Dunkin'",
      latitude: 40.7610,
      longitude: -73.9897,
      rating: 4.0,
      category: "Coffee & Donuts",
      distance: "0.3 miles",
      status: "Open",
      hours: "5:00 AM - 10:00 PM"
    }
  ]

  const quickActions = [
    {
      title: "Update Business Info",
      description: "Edit your business details",
      icon: Edit,
      href: "/business-update"
    },
    {
      title: "View Analytics",
      description: "Detailed performance metrics",
      icon: BarChart3,
      href: "/analytics"
    },
    {
      title: "Manage Reviews",
      description: "Respond to customer reviews",
      icon: MessageSquare,
      href: "/reviews"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="w-full flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Business Dashboard</h1>
                <p className="text-sm text-muted-foreground">{businessInfo.name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AnimatedThemeToggler />
            
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8',
                  userButtonPopoverCard: 'border-border bg-card',
                  userButtonPopoverActions: 'text-foreground'
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-8">
        <div className="space-y-8">
          
          {/* Optional Additional Info Form for Approved Businesses */}
          {businessInfo.status === 'pending' && isBusinessCompleted && (
            <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Edit className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-blue-800 dark:text-blue-200">Update Business Information</CardTitle>
                      <CardDescription className="text-blue-700 dark:text-blue-300">
                        Make changes to your business hours, website, or social media links
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowPendingForm(!showPendingForm)}
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300"
                  >
                    {showPendingForm ? 'Hide Form' : 'Update Info'}
                  </Button>
                </div>
              </CardHeader>
              
              {showPendingForm && (
                <CardContent className="pt-0">
                  <div className="space-y-8">
                    
                    {/* Business Hours Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold">Business Hours</h3>
                      </div>
                      <div className="space-y-3">
                        {Object.entries(pendingFormData.businessHours).map(([day, hours]) => (
                          <div key={day} className="flex items-center gap-4 p-3 bg-background rounded-lg border border-border/50">
                            <div className="w-24">
                              <p className="font-medium capitalize text-sm">{day}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`${day}-closed`}
                                checked={hours.closed}
                                onChange={() => toggleDayClosed(day)}
                                className="rounded"
                              />
                              <Label htmlFor={`${day}-closed`} className="text-sm">Closed</Label>
                            </div>
                            {!hours.closed && (
                              <div className="flex items-center gap-2">
                                <Input
                                  type="time"
                                  value={hours.open}
                                  onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                                  className="w-32"
                                />
                                <span className="text-muted-foreground">to</span>
                                <Input
                                  type="time"
                                  value={hours.close}
                                  onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                                  className="w-32"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Website Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold">Website (Optional)</h3>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website URL</Label>
                        <Input
                          id="website"
                          type="url"
                          placeholder="https://www.yourwebsite.com"
                          value={pendingFormData.website}
                          onChange={(e) => setPendingFormData(prev => ({ ...prev, website: e.target.value }))}
                          className="max-w-md"
                        />
                      </div>
                    </div>

                    {/* Social Media Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold">Social Media (Optional)</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="facebook" className="flex items-center gap-2">
                            <Facebook className="w-4 h-4 text-blue-600" />
                            Facebook
                          </Label>
                          <Input
                            id="facebook"
                            type="url"
                            placeholder="https://facebook.com/yourpage"
                            value={pendingFormData.socialHandles.facebook}
                            onChange={(e) => handleSocialChange('facebook', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="instagram" className="flex items-center gap-2">
                            <Instagram className="w-4 h-4 text-pink-600" />
                            Instagram
                          </Label>
                          <Input
                            id="instagram"
                            type="url"
                            placeholder="https://instagram.com/yourpage"
                            value={pendingFormData.socialHandles.instagram}
                            onChange={(e) => handleSocialChange('instagram', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="twitter" className="flex items-center gap-2">
                            <Twitter className="w-4 h-4 text-blue-400" />
                            Twitter
                          </Label>
                          <Input
                            id="twitter"
                            type="url"
                            placeholder="https://twitter.com/yourpage"
                            value={pendingFormData.socialHandles.twitter}
                            onChange={(e) => handleSocialChange('twitter', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="linkedin" className="flex items-center gap-2">
                            <Linkedin className="w-4 h-4 text-blue-700" />
                            LinkedIn
                          </Label>
                          <Input
                            id="linkedin"
                            type="url"
                            placeholder="https://linkedin.com/company/yourpage"
                            value={pendingFormData.socialHandles.linkedin}
                            onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4 border-t border-border gap-2">
                      <Button
                        onClick={async () => {
                          try {
                            const response = await fetch('/api/test-business')
                            const data = await response.json()
                            console.log('Test API response:', data)
                            alert(`Test API: ${JSON.stringify(data, null, 2)}`)
                          } catch (error) {
                            console.error('Test API error:', error)
                            alert('Test API failed')
                          }
                        }}
                        variant="outline"
                        className="gap-2"
                      >
                        Test API
                      </Button>
                      <Button
                        onClick={submitPendingData}
                        disabled={isSubmittingPending}
                        className="gap-2"
                      >
                        {isSubmittingPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Building2 className="w-4 h-4" />
                            Complete Profile
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )}
          
          {/* Welcome Section & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Business Overview Card */}
            <div className="lg:col-span-5">
              <Card className="h-full border-border/50 bg-gradient-to-br from-card to-card/50">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <Building2 className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{businessInfo.name}</CardTitle>
                        <CardDescription className="text-base mt-1 flex items-center gap-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {businessInfo.category}
                          </Badge>
                          • {getStatusBadge(businessInfo.status)}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Address</p>
                            <p className="text-sm font-medium leading-relaxed">{businessInfo.address}</p>
                            {businessInfo.location && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {businessInfo.location.latitude?.toFixed(4)}, {businessInfo.location.longitude?.toFixed(4)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="text-sm font-medium">{businessInfo.phone}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="text-sm font-medium">{businessInfo.email}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Rating</p>
                            <p className="text-lg font-bold text-yellow-600">{businessInfo.rating}/5.0</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4 border-t border-border/50">
                      <Link href="/business-update" className="flex-1">
                        <Button className="w-full gap-2">
                          <Edit className="w-4 h-4" />
                          Edit Business
                        </Button>
                      </Link>
                      <Button variant="outline" className="gap-2">
                        <Share2 className="w-4 h-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Metrics */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-full">
                {stats.map((stat, index) => (
                  <Card key={index} className="border-border/50 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-lg ${
                          stat.color === 'text-blue-600' ? 'bg-blue-50 dark:bg-blue-950/20' :
                          stat.color === 'text-green-600' ? 'bg-green-50 dark:bg-green-950/20' :
                          stat.color === 'text-yellow-600' ? 'bg-yellow-50 dark:bg-yellow-950/20' :
                          'bg-purple-50 dark:bg-purple-950/20'
                        }`}>
                          <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-green-600 font-medium">{stat.change} from last month</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Business Information */}
          {businessInfo.status === 'approved' && (businessInfo.businessHours || businessInfo.website || Object.values(businessInfo.socialHandles || {}).some(handle => handle)) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Business Hours */}
              {businessInfo.businessHours && (
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Business Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(businessInfo.businessHours).map(([day, hours]: [string, any]) => (
                        <div key={day} className="flex items-center justify-between text-sm">
                          <span className="capitalize font-medium">{day}</span>
                          <span className="text-muted-foreground">
                            {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Website & Social Media */}
              {(businessInfo.website || Object.values(businessInfo.socialHandles || {}).some(handle => handle)) && (
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" />
                      Online Presence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {businessInfo.website && (
                        <div>
                          <p className="text-sm font-medium mb-1">Website</p>
                          <a 
                            href={businessInfo.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            {businessInfo.website}
                          </a>
                        </div>
                      )}
                      
                      {Object.entries(businessInfo.socialHandles || {}).some(([_, url]) => url) && (
                        <div>
                          <p className="text-sm font-medium mb-2">Social Media</p>
                          <div className="flex flex-wrap gap-2">
                            {businessInfo.socialHandles?.facebook && (
                              <a href={businessInfo.socialHandles.facebook} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="gap-1">
                                  <Facebook className="w-3 h-3" />
                                  Facebook
                                </Button>
                              </a>
                            )}
                            {businessInfo.socialHandles?.instagram && (
                              <a href={businessInfo.socialHandles.instagram} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="gap-1">
                                  <Instagram className="w-3 h-3" />
                                  Instagram
                                </Button>
                              </a>
                            )}
                            {businessInfo.socialHandles?.twitter && (
                              <a href={businessInfo.socialHandles.twitter} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="gap-1">
                                  <Twitter className="w-3 h-3" />
                                  Twitter
                                </Button>
                              </a>
                            )}
                            {businessInfo.socialHandles?.linkedin && (
                              <a href={businessInfo.socialHandles.linkedin} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="gap-1">
                                  <Linkedin className="w-3 h-3" />
                                  LinkedIn
                                </Button>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Manage your business efficiently with these quick shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <div className="group p-4 rounded-lg border border-border/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 group-hover:bg-primary/20 rounded-lg transition-colors">
                          <action.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{action.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Analytics & Insights Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Search Analytics */}
            <div className="xl:col-span-2 space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-primary" />
                    Search Analytics
                  </CardTitle>
                  <CardDescription>
                    Understand how customers discover your business
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Search className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">Total Searches</span>
                      </div>
                      <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{searchMetrics.totalSearches.toLocaleString()}</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">This month</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-semibold text-green-800 dark:text-green-200">Weekly Average</span>
                      </div>
                      <p className="text-3xl font-bold text-green-700 dark:text-green-300">{Math.round(searchMetrics.weeklySearches.reduce((a, b) => a + b) / searchMetrics.weeklySearches.length)}</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12% vs last week</p>
                    </div>
                  </div>

                  {/* Weekly Trend Chart */}
                  <div>
                    <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                      <LineChart className="w-4 h-4" />
                      Weekly Search Trend
                    </h4>
                    <div className="flex items-end justify-between gap-2 h-32 bg-muted/20 rounded-lg p-4">
                      {searchMetrics.weeklySearches.map((searches, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                          <div className="relative w-full bg-muted rounded-sm overflow-hidden" style={{ height: '80px' }}>
                            <div 
                              className="absolute bottom-0 w-full bg-gradient-to-t from-primary to-primary/70 rounded-sm transition-all duration-500"
                              style={{ height: `${(searches / Math.max(...searchMetrics.weeklySearches)) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Search Terms */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Top Search Terms</h4>
                    <div className="space-y-3">
                      {searchMetrics.topSearchTerms.map((term, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/30 hover:bg-muted/30 transition-colors">
                          <div className="flex-1">
                            <p className="font-medium text-sm">"{term.term}"</p>
                            <p className="text-xs text-muted-foreground">{term.count} searches</p>
                          </div>
                          <Badge variant="secondary" className="text-green-600 bg-green-50 dark:bg-green-950/20 font-semibold">
                            {term.trend}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interactive Map */}
              <Card className="border-border/50">
                <CardContent className="p-0">
                  <div className="rounded-lg overflow-hidden">
                    <BusinessMap 
                      businessInfo={{
                        name: businessInfo.name,
                        latitude: 40.7589,
                        longitude: -73.9851,
                        rating: businessInfo.rating,
                        category: businessInfo.category
                      }}
                      competitors={nearbyCompetitors}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar - Insights & Performance */}
            <div className="xl:col-span-1">
              <div className="space-y-6 sticky top-24">
                
                {/* Performance Summary */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Visibility Score</span>
                        <span className="font-bold text-green-600 text-lg">{performanceData.visibilityScore}%</span>
                      </div>
                      <Progress value={performanceData.visibilityScore} className="h-3" />
                      <p className="text-xs text-green-600 font-medium">Above category average</p>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Search Ranking</span>
                          <span className="font-bold text-blue-600 text-lg">#{performanceData.searchRanking}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">In "coffee shops near me"</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Category Ranking</span>
                          <span className="font-bold text-purple-600 text-lg">#{performanceData.categoryRanking}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">In "Restaurants" category</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Market Insights */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Market Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {competitorInsights.map((insight, index) => (
                        <div key={index} className={`p-3 rounded-lg border-l-4 bg-muted/10 ${
                          insight.impact === 'high' ? 'border-l-red-500 bg-red-50/50 dark:bg-red-950/10' : 
                          insight.impact === 'medium' ? 'border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/10' : 
                          'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/10'
                        }`}>
                          <div className="flex items-start gap-2">
                            <insight.icon className={`w-4 h-4 ${insight.color} mt-1 flex-shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <h4 className="font-semibold text-sm leading-tight">{insight.title}</h4>
                                <Badge 
                                  variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'secondary' : 'outline'}
                                  className="text-xs ml-2 flex-shrink-0"
                                >
                                  {insight.impact.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{insight.description}</p>
                              <p className="text-xs text-primary font-medium">💡 {insight.action}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/10 rounded-lg hover:bg-muted/20 transition-colors">
                          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                            <activity.icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm leading-tight">{activity.message}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}