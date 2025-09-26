"use client"

import { useEffect } from 'react'
import { useUser, SignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, User } from "lucide-react"
import Link from "next/link"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"

export default function BusinessRegisterPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()

  // Check if user is authenticated and redirect to dashboard for onboarding
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // After account creation, redirect directly to dashboard for complete onboarding
      router.push('/business-dashboard')
    }
  }, [isLoaded, isSignedIn, user, router])

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
          <h1 className="text-3xl font-bold text-foreground">Start Your Business Journey</h1>
          <p className="text-muted-foreground mt-2">
            Create your account and get started with our comprehensive onboarding
          </p>
        </div>

        {/* Progress Indicator - Account Creation Only */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
              <User className="w-4 h-4" />
            </div>
            <div className="h-0.5 w-12 bg-muted" />
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Account Creation */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold text-center">Create Account</CardTitle>
              <CardDescription className="text-center">
                Create your business account to get started with onboarding
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
              afterSignUpUrl="/business-dashboard"
              redirectUrl="/business-dashboard"
              signInUrl="/login"
            />
          </div>
        </div>

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