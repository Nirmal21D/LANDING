"use client"

import { useState, useEffect } from 'react'
import { useUser, SignUp } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { User, Building2, MapPin, Tag, Mail, Phone, ArrowRight, Navigation } from "lucide-react"
import Link from "next/link"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"

export default function BusinessRegisterPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<'account' | 'business'>('account')
  const [isLoading, setIsLoading] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [error, setError] = useState('')

  // Check if user is authenticated and should see business form
  useEffect(() => {
    if (isLoaded) {
      const stepParam = searchParams.get('step')
      if (isSignedIn && (stepParam === 'business' || user)) {
        setStep('business')
      } else if (!isSignedIn) {
        setStep('account')
      }
    }
  }, [isLoaded, isSignedIn, searchParams, user])

  // Business information data
  const [businessData, setBusinessData] = useState({
    businessName: '',
    businessDescription: '',
    latitude: '',
    longitude: '',
    businessCategory: '',
    businessTags: '',
    phone: '',
    address: '',
    businessType: '',
  })

  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBusinessData({
      ...businessData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setBusinessData({
      ...businessData,
      [name]: value
    })
  }

  const getCurrentLocation = () => {
    setIsGettingLocation(true)
    setError('')

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      setIsGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setBusinessData({
          ...businessData,
          latitude: latitude.toString(),
          longitude: longitude.toString()
        })
        setIsGettingLocation(false)
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location.'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
        }
        setError(errorMessage)
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Create business record with the current user's data
      const businessPayload = {
        businessOwnerName: user ? `${user.firstName} ${user.lastName}` : 'Business Owner',
        businessName: businessData.businessName,
        businessDescription: businessData.businessDescription,
        latitude: businessData.latitude,
        longitude: businessData.longitude,
        businessCategory: businessData.businessCategory,
        businessTags: businessData.businessTags,
        email: user?.primaryEmailAddress?.emailAddress || '',
        phone: businessData.phone,
        address: businessData.address,
        businessType: businessData.businessType,
        clerkUserId: user?.id // Pass Clerk user ID
      }

      const response = await fetch('/api/register-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessPayload),
      })

      if (response.ok) {
        // Redirect to business dashboard after successful registration
        router.push('/business-dashboard')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to register business')
      }
    } catch (err: any) {
      setError('An error occurred while registering your business')
    } finally {
      setIsLoading(false)
    }
  }

  const businessCategories = [
    'Food & Beverage',
    'Retail',
    'Healthcare',
    'Professional Services',
    'Technology',
    'Automotive',
    'Beauty & Wellness',
    'Education',
    'Entertainment',
    'Real Estate',
    'Construction',
    'Manufacturing',
    'Other'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <AnimatedThemeToggler />
      </div>

      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Register Your Business</h1>
          <p className="text-muted-foreground mt-2">
            {step === 'account' && 'Create your account to get started'}
            {step === 'business' && 'Tell us about your business'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step === 'account' ? 'bg-primary text-primary-foreground' : 'bg-primary text-primary-foreground'
            }`}>
              <User className="w-4 h-4" />
            </div>
            <div className={`h-0.5 w-12 ${
              step === 'business' ? 'bg-primary' : 'bg-muted'
            }`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step === 'business' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              <Building2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Account Creation Step */}
        {step === 'account' && (
          <div className="space-y-6">
            <Card className="border-border/50 shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-semibold text-center">Create Account</CardTitle>
                <CardDescription className="text-center">
                  Create your business account to get started
                </CardDescription>
              </CardHeader>
            </Card>
            
            {/* Clerk SignUp Component */}
            <div className="flex justify-center">
              <SignUp 
                appearance={{
                  elements: {
                    formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
                    card: 'border-border/50 shadow-lg',
                    headerTitle: 'text-foreground',
                    headerSubtitle: 'text-muted-foreground',
                    socialButtonsBlockButton: 'border-border hover:bg-muted/50',
                    formFieldInput: 'bg-background border-border focus:ring-primary',
                    footerActionLink: 'text-primary hover:text-primary/90',
                    identityPreviewEditButton: 'text-primary hover:text-primary/90'
                  }
                }}
                routing="path"
                path="/business-register"
                afterSignUpUrl="/business-register?step=business"
                redirectUrl="/business-register?step=business"
                signInUrl="/login"
              />
            </div>
          </div>
        )}

        {/* Business Information Step */}
        {step === 'business' && (
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold text-center">Business Information</CardTitle>
              <CardDescription className="text-center">
                Tell us about your business to complete registration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBusinessSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="businessName"
                      name="businessName"
                      type="text"
                      placeholder="Your business name"
                      value={businessData.businessName}
                      onChange={handleBusinessChange}
                      className="pl-10 bg-background border-border"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Business Description</Label>
                  <Textarea
                    id="businessDescription"
                    name="businessDescription"
                    placeholder="Describe your business..."
                    value={businessData.businessDescription}
                    onChange={handleBusinessChange}
                    className="bg-background border-border min-h-[100px]"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessCategory">Business Category *</Label>
                    <Select onValueChange={(value) => handleSelectChange('businessCategory', value)}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select category" />
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

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={businessData.phone}
                        onChange={handleBusinessChange}
                        className="pl-10 bg-background border-border"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessTags">Business Tags</Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="businessTags"
                      name="businessTags"
                      type="text"
                      placeholder="coffee, wifi, breakfast, organic"
                      value={businessData.businessTags}
                      onChange={handleBusinessChange}
                      className="pl-10 bg-background border-border"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Separate tags with commas (e.g., coffee, wifi, breakfast)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Business Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="address"
                      type="text"
                      placeholder="123 Main Street, City, State, ZIP"
                      value={businessData.address}
                      onChange={handleBusinessChange}
                      className="pl-10 bg-background border-border"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Location Coordinates *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className="text-sm"
                    >
                      {isGettingLocation ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-2"></div>
                          Getting Location...
                        </>
                      ) : (
                        <>
                          <Navigation className="w-3 h-3 mr-2" />
                          Get My Location
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude *</Label>
                      <Input
                        id="latitude"
                        name="latitude"
                        type="number"
                        step="any"
                        placeholder="40.7128"
                        value={businessData.latitude}
                        onChange={handleBusinessChange}
                        className="bg-background border-border"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude *</Label>
                      <Input
                        id="longitude"
                        name="longitude"
                        type="number"
                        step="any"
                        placeholder="-74.0060"
                        value={businessData.longitude}
                        onChange={handleBusinessChange}
                        className="bg-background border-border"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading || !businessData.businessName || !businessData.businessCategory || !businessData.latitude}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Registering Business...
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="text-primary hover:underline font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}