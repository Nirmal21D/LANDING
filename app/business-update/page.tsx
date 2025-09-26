"use client"

import { useState, useEffect } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Building2, 
  MapPin, 
  Tag, 
  Navigation, 
  ArrowRight, 
  ArrowLeft,
  Save,
  Clock,
  Phone,
  Mail,
  Globe,
  Star,
  Eye,
  Settings,
  LogOut,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Share2
} from "lucide-react"
import Link from "next/link"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import LocationMap from "@/components/ui/location-map"

export default function BusinessUpdatePage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [businessData, setBusinessData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    businessOwnerName: '',
    businessName: '',
    businessDescription: '',
    latitude: '',
    longitude: '',
    businessCategory: '',
    businessTags: '',
    email: '',
    phone: '',
    address: '',
    businessType: '',
    website: '',
    businessHours: {
      monday: { open: '', close: '', closed: false },
      tuesday: { open: '', close: '', closed: false },
      wednesday: { open: '', close: '', closed: false },
      thursday: { open: '', close: '', closed: false },
      friday: { open: '', close: '', closed: false },
      saturday: { open: '', close: '', closed: false },
      sunday: { open: '', close: '', closed: false }
    },
    socialHandles: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: ''
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

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

  const fetchBusinessData = async () => {
    try {
      setLoading(true)
      console.log('Fetching business data for user:', user?.id)
      
      const response = await fetch(`/api/business/${user?.id}`)
      console.log('API response status:', response.status)
      console.log('API response headers:', response.headers)
      
      const data = await response.json()
      console.log('API response data:', data)
      
      if (response.ok) {
        if (data.success && data.business) {
          const business = data.business
          console.log('Business data received:', business)
          setBusinessData(business)
          
          // Populate form with existing data
          setFormData({
            businessOwnerName: business.businessOwnerName || '',
            businessName: business.businessName || '',
            businessDescription: business.businessDescription || '',
            latitude: business.location?.latitude?.toString() || '',
            longitude: business.location?.longitude?.toString() || '',
            businessCategory: business.businessCategory || '',
            businessTags: Array.isArray(business.businessTags) ? business.businessTags.join(', ') : '',
            email: business.email || '',
            phone: business.phone || '',
            address: business.address || '',
            businessType: business.businessType || '',
            website: business.website || '',
            businessHours: business.businessHours || {
              monday: { open: '', close: '', closed: false },
              tuesday: { open: '', close: '', closed: false },
              wednesday: { open: '', close: '', closed: false },
              thursday: { open: '', close: '', closed: false },
              friday: { open: '', close: '', closed: false },
              saturday: { open: '', close: '', closed: false },
              sunday: { open: '', close: '', closed: false }
            },
            socialHandles: business.socialHandles || {
              facebook: '',
              instagram: '',
              twitter: '',
              linkedin: ''
            }
          })
          console.log('Form data populated successfully')
        } else {
          console.error('API returned success but no business data:', data)
          throw new Error(data.error || 'No business data found')
        }
      } else {
        console.error('API request failed:', response.status, data)
        throw new Error(data.error || `HTTP ${response.status}: Failed to fetch business data`)
      }
    } catch (error) {
      console.error('Error fetching business data:', error)
      
      // Show detailed error information
      if (error instanceof TypeError && error.message.includes('fetch')) {
        alert('Network error: Unable to connect to the server. Please check if the server is running.')
      } else {
        alert(`Failed to load business data: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
      
      // Try to navigate back to dashboard
      setTimeout(() => {
        router.push('/business-dashboard')
      }, 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleHoursChange = (day: string, field: string, value: string | boolean) => {
    setFormData({
      ...formData,
      businessHours: {
        ...formData.businessHours,
        [day]: {
          ...formData.businessHours[day as keyof typeof formData.businessHours],
          [field]: value
        }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Prepare data for API
      const updateData = {
        businessOwnerName: formData.businessOwnerName,
        businessName: formData.businessName,
        businessDescription: formData.businessDescription,
        businessCategory: formData.businessCategory,
        businessType: formData.businessType,
        businessTags: formData.businessTags.split(',').map(tag => tag.trim()).filter(tag => tag),
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        location: {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude)
        },
        website: formData.website,
        businessHours: formData.businessHours,
        socialHandles: formData.socialHandles
      }

      console.log('Submitting update data:', updateData)

      const response = await fetch(`/api/business/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const responseData = await response.json()
      console.log('Update response:', responseData)

      if (response.ok) {
        alert('Business information updated successfully!')
        router.push('/business-dashboard')
      } else {
        throw new Error(responseData.error || 'Failed to update business information')
      }
      
    } catch (error) {
      console.error('Update error:', error)
      alert(`Failed to update business information: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Building2 },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'hours', label: 'Hours', icon: Clock },
    { id: 'location', label: 'Location', icon: MapPin }
  ]

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  // Show loading state
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading business information...</p>
          <div className="mt-4 text-xs text-muted-foreground space-y-1">
            <p>Clerk loaded: {isLoaded ? '✓' : '✗'}</p>
            <p>User signed in: {isSignedIn ? '✓' : '✗'}</p>
            <p>User ID: {user?.id || 'None'}</p>
            <p>Loading data: {loading ? '✓' : '✗'}</p>
          </div>
        </div>
      </div>
    )
  }

  // Show sign-in prompt if not authenticated
  if (!isSignedIn) {
    return null // Will redirect in useEffect
  }

  // Show error if no business data
  if (!businessData && !loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-2xl border-border/50 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-orange-100 dark:bg-orange-900 rounded-full">
                <Building2 className="w-12 h-12 text-orange-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">No Business Found</CardTitle>
            <CardDescription className="text-base mt-2">
              You need to register a business before you can update business information.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="p-6 bg-muted/30 rounded-lg border border-border/30">
              <p className="text-sm text-muted-foreground mb-4">
                It looks like you haven't registered a business yet. Please complete your business registration first.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Register your business details
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Set your location and contact information
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Then return here to make updates
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Link href="/business-register">
                <Button className="gap-2">
                  <Building2 className="w-4 h-4" />
                  Register Business
                </Button>
              </Link>
              <Link href="/business-dashboard">
                <Button variant="outline">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-semibold">Update Business Information</h1>
                <p className="text-sm text-muted-foreground">{formData.businessName}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <AnimatedThemeToggler />
            <Link href="/business-dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
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

      <div className="p-6 max-w-4xl mx-auto">
        {/* Status Badge */}
        <div className="mb-6 flex items-center gap-4">
          <Badge variant="default" className="bg-green-100 text-green-800">
            <Eye className="w-3 h-3 mr-1" />
            Active Listing
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Star className="w-3 h-3 mr-1" />
            4.5 Rating
          </Badge>
          <Badge variant="outline">
            Last updated: 2 days ago
          </Badge>
        </div>

        {/* Navigation Tabs */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center space-x-4 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </CardHeader>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Update your core business details and description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Business Owner Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center">
                      <User className="w-4 h-4 mr-2 text-accent" />
                      Business Owner Name *
                    </Label>
                    <Input
                      name="businessOwnerName"
                      placeholder="Enter owner name"
                      value={formData.businessOwnerName}
                      onChange={handleInputChange}
                      className="bg-background border-border focus:ring-primary"
                      required
                    />
                  </div>

                  {/* Business Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center">
                      <Building2 className="w-4 h-4 mr-2 text-accent" />
                      Business Name *
                    </Label>
                    <Input
                      name="businessName"
                      placeholder="Enter business name"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="bg-background border-border focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                {/* Business Description */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Business Description *
                  </Label>
                  <Textarea
                    name="businessDescription"
                    placeholder="Describe your business, services, and what makes you unique..."
                    value={formData.businessDescription}
                    onChange={handleInputChange}
                    className="bg-background border-border focus:ring-primary min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Business Category */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center">
                      <Tag className="w-4 h-4 mr-2 text-accent" />
                      Business Category *
                    </Label>
                    <Select onValueChange={(value: string) => handleSelectChange('businessCategory', value)}>
                      <SelectTrigger className="bg-background border-border focus:ring-primary">
                        <SelectValue placeholder={formData.businessCategory || "Select a category"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Restaurant">Restaurant</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Professional Services">Professional Services</SelectItem>
                        <SelectItem value="Automotive">Automotive</SelectItem>
                        <SelectItem value="Beauty & Wellness">Beauty & Wellness</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Real Estate">Real Estate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Business Type */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Business Type
                    </Label>
                    <Input
                      name="businessType"
                      placeholder="e.g. Coffee Shop, Restaurant, Clinic"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className="bg-background border-border focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Business Tags */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Business Tags
                  </Label>
                  <Input
                    name="businessTags"
                    placeholder="Enter tags separated by commas (e.g. coffee, wifi, study, breakfast)"
                    value={formData.businessTags}
                    onChange={handleInputChange}
                    className="bg-background border-border focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground">
                    Tags help customers find your business more easily
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Information Tab */}
          {activeTab === 'contact' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Update your business contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-accent" />
                      Email Address *
                    </Label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Enter business email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-background border-border focus:ring-primary"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-accent" />
                      Phone Number *
                    </Label>
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-background border-border focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-accent" />
                    Website (Optional)
                  </Label>
                  <Input
                    name="website"
                    type="url"
                    placeholder="https://your-business-website.com"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="bg-background border-border focus:ring-primary"
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-accent" />
                    Business Address *
                  </Label>
                  <Textarea
                    name="address"
                    placeholder="Enter complete business address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="bg-background border-border focus:ring-primary"
                    required
                  />
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
                        value={formData.socialHandles.facebook}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          socialHandles: {
                            ...prev.socialHandles,
                            facebook: e.target.value
                          }
                        }))}
                        className="bg-background border-border focus:ring-primary"
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
                        value={formData.socialHandles.instagram}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          socialHandles: {
                            ...prev.socialHandles,
                            instagram: e.target.value
                          }
                        }))}
                        className="bg-background border-border focus:ring-primary"
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
                        value={formData.socialHandles.twitter}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          socialHandles: {
                            ...prev.socialHandles,
                            twitter: e.target.value
                          }
                        }))}
                        className="bg-background border-border focus:ring-primary"
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
                        value={formData.socialHandles.linkedin}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          socialHandles: {
                            ...prev.socialHandles,
                            linkedin: e.target.value
                          }
                        }))}
                        className="bg-background border-border focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Operating Hours Tab */}
          {activeTab === 'hours' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Operating Hours
                </CardTitle>
                <CardDescription>
                  Set your business hours for each day of the week
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {days.map((day, index) => (
                  <div key={day} className="flex items-center gap-4 p-4 border border-border/30 rounded-lg">
                    <div className="w-24">
                      <Label className="text-sm font-medium">{dayLabels[index]}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.businessHours[day as keyof typeof formData.businessHours].closed !== true}
                        onChange={(e) => handleHoursChange(day, 'closed', !e.target.checked)}
                        className="rounded border-border focus:ring-primary"
                      />
                      <span className="text-sm text-muted-foreground">Open</span>
                    </div>
                    {formData.businessHours[day as keyof typeof formData.businessHours].closed !== true && (
                      <>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">From:</Label>
                          <Input
                            type="time"
                            value={formData.businessHours[day as keyof typeof formData.businessHours].open}
                            onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                            className="w-24 text-xs"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">To:</Label>
                          <Input
                            type="time"
                            value={formData.businessHours[day as keyof typeof formData.businessHours].close}
                            onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                            className="w-24 text-xs"
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Location Tab */}
          {activeTab === 'location' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Business Location
                </CardTitle>
                <CardDescription>
                  Update your precise business location coordinates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Latitude */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Latitude *
                    </Label>
                    <Input
                      name="latitude"
                      type="number"
                      step="any"
                      placeholder="e.g. 40.7589"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      className="bg-background border-border focus:ring-primary"
                      required
                    />
                  </div>

                  {/* Longitude */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Longitude *
                    </Label>
                    <Input
                      name="longitude"
                      type="number"
                      step="any"
                      placeholder="e.g. -73.9851"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      className="bg-background border-border focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                {/* Location Map */}
                <div className="mt-4">
                  <LocationMap 
                    latitude={formData.latitude ? parseFloat(formData.latitude) : null}
                    longitude={formData.longitude ? parseFloat(formData.longitude) : null}
                    address={formData.address}
                    onLocationChange={(lat, lng) => {
                      setFormData({
                        ...formData,
                        latitude: lat.toString(),
                        longitude: lng.toString()
                      })
                    }}
                    onAddressChange={(address) => {
                      setFormData({
                        ...formData,
                        address: address
                      })
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6">
            <div className="flex gap-2">
              <Link href="/business-dashboard">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Cancel
                </Button>
              </Link>
              <Button
                type="button"
                onClick={async () => {
                  try {
                    console.log('Testing API connectivity...')
                    console.log('Current user:', user?.id)
                    
                    // Test basic API connectivity
                    const testResponse = await fetch('/api/test-business')
                    console.log('Test API status:', testResponse.status)
                    const testData = await testResponse.json()
                    console.log('Test API data:', testData)
                    
                    // Test specific business API
                    const businessResponse = await fetch(`/api/business/${user?.id}`)
                    console.log('Business API status:', businessResponse.status)
                    const businessData = await businessResponse.json()
                    console.log('Business API data:', businessData)
                    
                    alert(`API Test Results:\n\nTest API: ${testResponse.status}\nBusiness API: ${businessResponse.status}\n\nCheck console for details`)
                  } catch (error) {
                    console.error('Test API error:', error)
                    alert(`API Test Failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
                  }
                }}
                variant="outline"
                className="gap-2"
              >
                Test API
              </Button>
            </div>
            
            <Button 
              type="submit" 
              className="gap-2 bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Business Information
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}