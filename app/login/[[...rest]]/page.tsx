"use client"

import { SignIn } from '@clerk/nextjs'
import { Building2 } from "lucide-react"
import Link from "next/link"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { useState, useEffect } from 'react'

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted on client side to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        {/* Theme Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <AnimatedThemeToggler />
        </div>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Business Login</h1>
            <p className="text-muted-foreground mt-2">Sign in to access your business dashboard</p>
          </div>

          {/* Loading placeholder */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm p-8 border border-border/50 rounded-lg shadow-lg bg-card">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <AnimatedThemeToggler />
      </div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Business Login</h1>
          <p className="text-muted-foreground mt-2">Sign in to access your business dashboard</p>
        </div>

        {/* Clerk Sign In Component */}
        <div className="flex justify-center">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
                card: 'border-border/50 shadow-lg',
                headerTitle: 'text-foreground',
                headerSubtitle: 'text-muted-foreground',
                socialButtonsBlockButton: 'border-border hover:bg-muted/50',
                formFieldInput: 'bg-background border-border focus:ring-primary',
                footerActionLink: 'text-primary hover:text-primary/90'
              }
            }}
            routing="path"
            path="/login"
            redirectUrl="/business-dashboard"
          />
        </div>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link 
              href="/business-register" 
              className="text-primary hover:underline font-medium"
            >
              Register your business
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