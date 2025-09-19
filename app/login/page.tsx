"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, Triangle } from "lucide-react"
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

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log('Login attempt:', formData)
      setIsLoading(false)
      // Add your login logic here
    }, 1500)
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
            { name: "Chat", link: "/chat" }
          ]} />

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <AnimatedThemeToggler />
            <NavbarButton href="/business-register" variant="primary">
              Register Business
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

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            <a
              href="/"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="/chat"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Chat
            </a>
            <NavbarButton href="/business-register" variant="primary" className="mt-4">
              Register Business
            </NavbarButton>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      
      <div className="pt-32 pb-8 px-4 max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4 border border-primary/30">
            <Sparkles className="w-4 h-4 mr-2" />
            Welcome Back
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-glow">
            Sign In to <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Thikana AI</span>
          </h1>
          <p className="text-muted-foreground">
            Access your account to manage your business or discover local services
          </p>
        </div>

        {/* Login Form */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 bg-background border-border focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 bg-background border-border focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !formData.email || !formData.password}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6">
            <Separator className="my-4" />
            <p className="text-center text-sm text-muted-foreground">Or continue with</p>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <Button variant="outline" className="w-full bg-background border-border hover:bg-muted">
              <div className="w-5 h-5 mr-3 bg-gradient-to-r from-red-500 to-red-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              Continue with Google
            </Button>
            
            <Button variant="outline" className="w-full bg-background border-border hover:bg-muted">
              <div className="w-5 h-5 mr-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">f</span>
              </div>
              Continue with Facebook
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Create account
              </Link>
            </p>
          </div>

          {/* Business Registration Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Want to register your business?{' '}
              <Link href="/business-register" className="text-accent hover:text-accent/80 font-medium transition-colors">
                Business Registration
              </Link>
            </p>
          </div>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-card/30 rounded-lg border border-border/50">
            <User className="w-6 h-6 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Personal Account</h3>
            <p className="text-xs text-muted-foreground mt-1">Discover local businesses</p>
          </div>
          <div className="p-4 bg-card/30 rounded-lg border border-border/50">
            <Sparkles className="w-6 h-6 text-accent mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Business Account</h3>
            <p className="text-xs text-muted-foreground mt-1">Manage your business</p>
          </div>
        </div>
      </div>
    </div>
  )
}
