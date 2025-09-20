"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { User, Building2, MapPin, Tag, Navigation, Sparkles, ArrowRight, HelpCircle, Triangle, Wand2 } from "lucide-react"
import Link from "next/link"
import { 
  Navbar, 
  NavBody, 
  NavItems, 
  MobileNav, 
  MobileNavHeader, 
  MobileNavMenu, 
  MobileNavToggle,
  NavbarButton 
} from "@/components/ui/resizable-navbar"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { Footer } from "@/components/ui/footer"

export default function BusinessRegisterPage() {
  const [formData, setFormData] = useState({
    businessOwnerName: '',
    businessName: '',
    businessDescription: '',
    latitude: '',
    longitude: '',
    businessCategory: '',
    businessTags: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingTags, setIsGeneratingTags] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      console.log('🏢 Submitting business registration:', formData)
      
      // Prepare the request data
      const registrationData = {
        businessOwnerName: formData.businessOwnerName,
        businessName: formData.businessName,
        businessDescription: formData.businessDescription,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        businessCategory: formData.businessCategory,
        businessTags: formData.businessTags
      }
      
      console.log('📤 Sending registration request:', registrationData)
      
      // Call the registration API
      const response = await fetch('/api/register-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      })
      
      console.log('📥 Registration response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Registration failed:', errorData)
        throw new Error(errorData.error || `Registration failed: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('✅ Registration successful:', result)
      
      if (result.ok) {
        alert(`🎉 Business registered successfully!\n\n` +
              `✅ Business: ${formData.businessName}\n` +
              `✅ Owner: ${formData.businessOwnerName}\n` +
              `✅ Category: ${formData.businessCategory}\n` +
              `✅ Location: ${formData.latitude}, ${formData.longitude}\n` +
              `✅ Records added: ${result.appended}\n\n` +
              `Your business is now discoverable through AI-powered search!`)
        
        // Reset form
        setFormData({
          businessOwnerName: '',
          businessName: '',
          businessDescription: '',
          latitude: '',
          longitude: '',
          businessCategory: '',
          businessTags: ''
        })
      } else {
        throw new Error(result.error || 'Registration failed')
      }
      
    } catch (error) {
      console.error('🚨 Registration error:', error)
      alert(`❌ Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease check your information and try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  const businessCategories = [
    "Cafe",
    "Restaurant", 
    "Retail Store",
    "Healthcare",
    "Beauty & Spa",
    "Automotive",
    "Education",
    "Real Estate",
    "Technology",
    "Entertainment",
    "Fitness & Sports",
    "Professional Services",
    "Home Services",
    "Travel & Tourism",
    "Other"
  ]

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          alert("Unable to get your location. Please enter manually.")
        }
      )
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }

  const generateTags = async () => {
    if (!formData.businessName || !formData.businessDescription) {
      alert("Please fill in business name and description first")
      return
    }

    setIsGeneratingTags(true)
    try {
      const response = await fetch('/api/generate-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName: formData.businessName,
          businessDescription: formData.businessDescription,
          businessCategory: formData.businessCategory
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate tags')
      }

      const data = await response.json()
      
      if (data.success && data.tags) {
        setFormData({
          ...formData,
          businessTags: data.tags.join(', ')
        })
        
        // Show success message
        const tagCount = data.tags.length
        alert(`✨ Successfully generated ${tagCount} AI-powered tags for your business!`)
      } else {
        throw new Error(data.error || 'No tags generated')
      }
    } catch (error) {
      console.error('Error generating tags:', error)
      alert('⚠️ Failed to generate AI tags. Please try again or add tags manually.')
    } finally {
      setIsGeneratingTags(false)
    }
  }

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Resizable Navbar */}
      <Navbar className="fixed top-0 left-0 right-0 z-50">
        {/* Desktop Navbar */}
        <NavBody>
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Triangle className="w-6 h-6 text-primary fill-primary" />
            <span className="text-xl font-bold text-foreground">Thikana AI</span>
          </div>

          {/* Navigation Items */}
          <NavItems items={[
            { name: "Home", link: "/" },
            { name: "Chat", link: "/chat" },
            { name: "Search", link: "/search" }
          ]} />

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <AnimatedThemeToggler />
            <NavbarButton href="/search" variant="primary">
              Search
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navbar */}
        <MobileNav>
          <MobileNavHeader>
            <div className="flex items-center space-x-2">
              <Triangle className="w-6 h-6 text-primary fill-primary" />
              <span className="text-xl font-bold text-foreground">Thikana AI</span>
            </div>
            <div className="flex items-center space-x-2">
              <AnimatedThemeToggler />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            <div className="flex flex-col space-y-4 p-4">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/chat" className="text-sm font-medium hover:text-primary transition-colors">
                Chat
              </Link>
              <Link href="/search" className="text-sm font-medium hover:text-primary transition-colors">
                Search
              </Link>
              <div className="border-t border-border my-4"></div>
              <NavbarButton href="/search" variant="primary">
                Search
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      
      <div className="pt-20 pb-8 px-4 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4 border border-primary/30">
            <Building2 className="w-4 h-4 mr-2" />
            Business Registration
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-glow">
            Register New <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Business</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join Thikana AI and make your business discoverable to local customers through our AI-powered platform
          </p>
        </div>

        {/* Registration Form */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Business Owner Name */}
            <div className="space-y-2">
              <Label htmlFor="businessOwnerName" className="text-sm font-medium flex items-center">
                <User className="w-4 h-4 mr-2 text-primary" />
                Business Owner Name *
              </Label>
              <Input
                id="businessOwnerName"
                name="businessOwnerName"
                type="text"
                placeholder="e.g., John Smith"
                value={formData.businessOwnerName}
                onChange={handleInputChange}
                className="bg-background border-border focus:ring-primary"
                required
              />
            </div>

            {/* Business Name */}
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-sm font-medium flex items-center">
                <Building2 className="w-4 h-4 mr-2 text-primary" />
                Business Name *
              </Label>
              <Input
                id="businessName"
                name="businessName"
                type="text"
                placeholder="e.g., Smith's Coffee House"
                value={formData.businessName}
                onChange={handleInputChange}
                className="bg-background border-border focus:ring-primary"
                required
              />
            </div>

            {/* Business Description */}
            <div className="space-y-2">
              <Label htmlFor="businessDescription" className="text-sm font-medium flex items-center">
                <Building2 className="w-4 h-4 mr-2 text-accent" />
                Business Description *
              </Label>
              <Textarea
                id="businessDescription"
                name="businessDescription"
                placeholder="Describe your business, services, atmosphere, and what makes it unique... 

Example: 'A cozy neighborhood cafe serving artisan coffee, fresh pastries, and light meals. We pride ourselves on locally sourced ingredients, friendly service, and providing a comfortable workspace for remote professionals and students.'"
                value={formData.businessDescription}
                onChange={handleInputChange}
                className="bg-background border-border focus:ring-primary min-h-[100px]"
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">
                Provide a detailed description to help generate relevant tags automatically
              </p>
            </div>

            {/* Location Details Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold">Location Details</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Latitude */}
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-sm font-medium flex items-center">
                    Latitude *
                    <HelpCircle className="w-3 h-3 ml-1 text-muted-foreground" />
                  </Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    placeholder="e.g., 40.7128"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className="bg-background border-border focus:ring-primary"
                    required
                  />
                </div>

                {/* Longitude */}
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-sm font-medium flex items-center">
                    Longitude *
                    <HelpCircle className="w-3 h-3 ml-1 text-muted-foreground" />
                  </Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    placeholder="e.g., -74.0060"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className="bg-background border-border focus:ring-primary"
                    required
                  />
                </div>
              </div>

              {/* Get Current Location Button */}
              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                className="w-full bg-background border-border hover:bg-muted"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Use Current Location
              </Button>
            </div>

            {/* Business Category */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center">
                <Tag className="w-4 h-4 mr-2 text-accent" />
                Business Category *
              </Label>
              <Select onValueChange={(value: string) => handleSelectChange('businessCategory', value)}>
                <SelectTrigger className="bg-background border-border focus:ring-primary">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {businessCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Business Tags */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="businessTags" className="text-sm font-medium flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-accent" />
                  Business Tags
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateTags}
                  disabled={isGeneratingTags || !formData.businessName || !formData.businessDescription}
                  className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30 hover:from-accent/20 hover:to-primary/20"
                >
                  {isGeneratingTags ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-accent mr-2"></div>
                      AI Generating...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Wand2 className="w-3 h-3 mr-2" />
                      Generate AI Tags
                    </div>
                  )}
                </Button>
              </div>
              <Textarea
                id="businessTags"
                name="businessTags"
                placeholder="e.g., coffee,wifi,outdoor seating,takeout"
                value={formData.businessTags}
                onChange={handleInputChange}
                className="bg-background border-border focus:ring-primary min-h-[80px]"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Add relevant tags separated by commas to help customers find your business, or use the generate button to auto-create tags from your description
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !formData.businessOwnerName || !formData.businessName || !formData.businessDescription || !formData.latitude || !formData.longitude || !formData.businessCategory}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white py-4 text-lg font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Registering Business...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Register Business
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              )}
            </Button>
          </form>

          {/* Search Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Want to find businesses?{' '}
              <Link href="/search" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Search here
              </Link>
            </p>
          </div>
        </Card>

        {/* Benefits Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Card className="p-4 bg-card/30 border-border/50 text-center">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-sm mb-1">AI Discovery</h3>
            <p className="text-xs text-muted-foreground">Get found by customers through intelligent search</p>
          </Card>

          <Card className="p-4 bg-card/30 border-border/50 text-center">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Local Visibility</h3>
            <p className="text-xs text-muted-foreground">Appear in location-based searches automatically</p>
          </Card>

          <Card className="p-4 bg-card/30 border-border/50 text-center">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Easy Management</h3>
            <p className="text-xs text-muted-foreground">Simple dashboard to manage your business profile</p>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
