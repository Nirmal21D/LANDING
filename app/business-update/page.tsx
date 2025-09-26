"use client"

import { useState } from 'react'
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
  LogOut
} from "lucide-react"
import Link from "next/link"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import LocationMap from "@/components/ui/location-map"

export default function BusinessUpdatePage() {
  const [formData, setFormData] = useState({
    businessOwnerName: 'John Smith',
    businessName: 'Starbucks Coffee',
    businessDescription: 'Premium coffee shop serving freshly brewed coffee, espresso drinks, and light snacks in a comfortable environment perfect for work or relaxation.',
    latitude: '40.7589',
    longitude: '-73.9851',
    businessCategory: 'Restaurant',
    businessTags: 'coffee, cafe, wifi, study, breakfast, lunch, meetings',
    email: 'contact@starbucks-ny.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, New York, NY 10001',
    businessType: 'Coffee Shop',
    website: 'https://starbucks-ny.com',
    operatingHours: {
      monday: { open: '06:00', close: '22:00', isOpen: true },
      tuesday: { open: '06:00', close: '22:00', isOpen: true },
      wednesday: { open: '06:00', close: '22:00', isOpen: true },
      thursday: { open: '06:00', close: '22:00', isOpen: true },
      friday: { open: '06:00', close: '23:00', isOpen: true },
      saturday: { open: '07:00', close: '23:00', isOpen: true },
      sunday: { open: '07:00', close: '21:00', isOpen: true }
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

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
      operatingHours: {
        ...formData.operatingHours,
        [day]: {
          ...formData.operatingHours[day as keyof typeof formData.operatingHours],
          [field]: value
        }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call to update business information
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('Business information updated successfully!')
      
    } catch (error) {
      console.error('Update error:', error)
      alert('Failed to update business information. Please try again.')
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
            <Link href="/login">
              <Button variant="ghost" size="sm" className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </Link>
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
                        checked={formData.operatingHours[day as keyof typeof formData.operatingHours].isOpen}
                        onChange={(e) => handleHoursChange(day, 'isOpen', e.target.checked)}
                        className="rounded border-border focus:ring-primary"
                      />
                      <span className="text-sm text-muted-foreground">Open</span>
                    </div>
                    {formData.operatingHours[day as keyof typeof formData.operatingHours].isOpen && (
                      <>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">From:</Label>
                          <Input
                            type="time"
                            value={formData.operatingHours[day as keyof typeof formData.operatingHours].open}
                            onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                            className="w-24 text-xs"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">To:</Label>
                          <Input
                            type="time"
                            value={formData.operatingHours[day as keyof typeof formData.operatingHours].close}
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
            <Link href="/business-dashboard">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Cancel
              </Button>
            </Link>
            
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