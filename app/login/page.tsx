"use client""use client"



import { useState } from 'react'import { useState } from 'react'

import { Button } from "@/components/ui/button"import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"import { Input } from "@/components/ui/input"

import { Card } from "@/components/ui/card"import { Card } from "@/components/ui/card"

import { Label } from "@/components/ui/label"import { Label } from "@/components/ui/label"

import { User, Lock, Sparkles, Triangle } from "lucide-react"import { Separator } from "@/components/ui/separator"

import Link from "next/link"import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, Triangle } from "lucide-react"

import { import Link from "next/link"

  Navbar, import { 

  NavBody,   Navbar, 

  NavItems,   NavBody, 

  MobileNav,   NavItems, 

  MobileNavHeader,   MobileNav, 

  MobileNavMenu,   MobileNavHeader, 

  MobileNavToggle,  MobileNavMenu, 

  NavbarButton   MobileNavToggle,

} from "@/components/ui/resizable-navbar"  NavbarButton 

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"} from "@/components/ui/resizable-navbar"

import { Footer } from "@/components/ui/footer"import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"



export default function LoginPage() {export default function LoginPage() {

  const [formData, setFormData] = useState({  const [formData, setFormData] = useState({

    email: '',    email: '',

    password: ''    password: ''

  })  })

  const [isLoading, setIsLoading] = useState(false)  const [showPassword, setShowPassword] = useState(false)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)  const [isLoading, setIsLoading] = useState(false)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setFormData({  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

      ...formData,    setFormData({

      [e.target.name]: e.target.value      ...formData,

    })      [e.target.name]: e.target.value

  }    })

  }

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()  const handleSubmit = async (e: React.FormEvent) => {

    setIsLoading(true)    e.preventDefault()

        setIsLoading(true)

    // Simulate API call    

    setTimeout(() => {    // Simulate API call

      console.log('Login attempt:', formData)    setTimeout(() => {

      setIsLoading(false)      console.log('Login attempt:', formData)

      // Add your login logic here      setIsLoading(false)

    }, 2000)      // Add your login logic here

  }    }, 1500)

  }

  return (

    <div className="min-h-screen bg-background grid-pattern">  return (

      {/* Resizable Navbar */}    <div className="min-h-screen bg-background grid-pattern">

      <Navbar className="fixed top-0 left-0 right-0 z-50">      {/* Resizable Navbar */}

        {/* Desktop Navbar */}      <Navbar className="fixed top-0 left-0 right-0 z-50">

        <NavBody>        {/* Desktop Navbar */}

          {/* Logo */}        <NavBody>

          <div className="flex items-center space-x-2">          {/* Logo */}

            <Triangle className="w-6 h-6 text-primary fill-primary" />          <div className="flex items-center space-x-2">

            <span className="text-xl font-bold text-foreground">Thikana AI</span>            <Triangle className="w-6 h-6 text-primary fill-primary" />

          </div>            <span className="text-xl font-bold text-foreground">Thikana AI</span>

          </div>

          {/* Navigation Items */}

          <NavItems items={[          {/* Navigation Items */}

            { name: "Home", link: "/" },          <NavItems items={[

            { name: "Chat", link: "/chat" },            { name: "Home", link: "/" },

            { name: "Search", link: "/search" }            { name: "Chat", link: "/chat" }

          ]} />          ]} />



          {/* Right Side Actions */}          {/* Right Side Actions */}

          <div className="flex items-center space-x-4">          <div className="flex items-center space-x-4">

            <AnimatedThemeToggler />            <AnimatedThemeToggler />

            <NavbarButton href="/business-register" variant="primary">            <NavbarButton href="/business-register" variant="primary">

              Register Business              Register Business

            </NavbarButton>            </NavbarButton>

          </div>          </div>

        </NavBody>        </NavBody>



        {/* Mobile Navbar */}        {/* Mobile Navbar */}

        <MobileNav>        <MobileNav>

          <MobileNavHeader>          <MobileNavHeader>

            <div className="flex items-center space-x-2">            <div className="flex items-center space-x-2">

              <Triangle className="w-6 h-6 text-primary fill-primary" />              <Triangle className="w-6 h-6 text-primary fill-primary" />

              <span className="text-xl font-bold text-foreground">Thikana AI</span>              <span className="text-xl font-bold text-foreground">Thikana AI</span>

            </div>            </div>

            <div className="flex items-center space-x-2">            <div className="flex items-center space-x-2">

              <AnimatedThemeToggler />              <AnimatedThemeToggler />

              <MobileNavToggle              <MobileNavToggle

                isOpen={isMobileMenuOpen}                isOpen={isMobileMenuOpen}

                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}

              />              />

            </div>            </div>

          </MobileNavHeader>          </MobileNavHeader>



          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>          <MobileNavMenu

            <div className="flex flex-col space-y-4 p-4">            isOpen={isMobileMenuOpen}

              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">            onClose={() => setIsMobileMenuOpen(false)}

                Home          >

              </Link>            <a

              <Link href="/chat" className="text-sm font-medium hover:text-primary transition-colors">              href="/"

                Chat              className="text-foreground hover:text-primary transition-colors"

              </Link>              onClick={() => setIsMobileMenuOpen(false)}

              <Link href="/search" className="text-sm font-medium hover:text-primary transition-colors">            >

                Search              Home

              </Link>            </a>

              <div className="border-t border-border my-4"></div>            <a

              <NavbarButton href="/business-register" variant="primary">              href="/chat"

                Register Business              className="text-foreground hover:text-primary transition-colors"

              </NavbarButton>              onClick={() => setIsMobileMenuOpen(false)}

            </div>            >

          </MobileNavMenu>              Chat

        </MobileNav>            </a>

      </Navbar>            <NavbarButton href="/business-register" variant="primary" className="mt-4">

                    Register Business

      <div className="pt-20 pb-8 px-4 max-w-md mx-auto">            </NavbarButton>

        {/* Header */}          </MobileNavMenu>

        <div className="text-center mb-8">        </MobileNav>

          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4 border border-primary/30">      </Navbar>

            <User className="w-4 h-4 mr-2" />      

            Login      <div className="pt-32 pb-8 px-4 max-w-md mx-auto">

          </div>        {/* Header */}

          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-glow">        <div className="text-center mb-8">

            Welcome <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Back</span>          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4 border border-primary/30">

          </h1>            <Sparkles className="w-4 h-4 mr-2" />

          <p className="text-muted-foreground max-w-xl mx-auto">            Welcome Back

            Sign in to your Thikana AI account to access personalized recommendations          </div>

          </p>          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-glow">

        </div>            Sign In to <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Thikana AI</span>

          </h1>

        {/* Login Form */}          <p className="text-muted-foreground">

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-2xl">            Access your account to manage your business or discover local services

          <form onSubmit={handleSubmit} className="space-y-6">          </p>

                    </div>

            {/* Email */}

            <div className="space-y-2">        {/* Login Form */}

              <Label htmlFor="email" className="text-sm font-medium flex items-center">        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-2xl">

                <User className="w-4 h-4 mr-2 text-primary" />          <form onSubmit={handleSubmit} className="space-y-6">

                Email *            {/* Email Field */}

              </Label>            <div className="space-y-2">

              <Input              <Label htmlFor="email" className="text-sm font-medium">

                id="email"                Email Address

                name="email"              </Label>

                type="email"              <div className="relative">

                placeholder="your@email.com"                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                value={formData.email}                <Input

                onChange={handleInputChange}                  id="email"

                className="bg-background border-border focus:ring-primary"                  name="email"

                required                  type="email"

              />                  placeholder="Enter your email"

            </div>                  value={formData.email}

                  onChange={handleInputChange}

            {/* Password */}                  className="pl-10 bg-background border-border focus:ring-primary"

            <div className="space-y-2">                  required

              <Label htmlFor="password" className="text-sm font-medium flex items-center">                />

                <Lock className="w-4 h-4 mr-2 text-primary" />              </div>

                Password *            </div>

              </Label>

              <Input            {/* Password Field */}

                id="password"            <div className="space-y-2">

                name="password"              <Label htmlFor="password" className="text-sm font-medium">

                type="password"                Password

                placeholder="Your password"              </Label>

                value={formData.password}              <div className="relative">

                onChange={handleInputChange}                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                className="bg-background border-border focus:ring-primary"                <Input

                required                  id="password"

              />                  name="password"

            </div>                  type={showPassword ? "text" : "password"}

                  placeholder="Enter your password"

            {/* Submit Button */}                  value={formData.password}

            <Button                  onChange={handleInputChange}

              type="submit"                  className="pl-10 pr-10 bg-background border-border focus:ring-primary"

              disabled={isLoading || !formData.email || !formData.password}                  required

              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white py-4 text-lg font-semibold"                />

            >                <button

              {isLoading ? (                  type="button"

                <div className="flex items-center">                  onClick={() => setShowPassword(!showPassword)}

                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"

                  Signing In...                >

                </div>                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}

              ) : (                </button>

                <div className="flex items-center justify-center">              </div>

                  <User className="w-5 h-5 mr-2" />            </div>

                  Sign In

                </div>            {/* Forgot Password */}

              )}            <div className="text-right">

            </Button>              <Link href="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">

          </form>                Forgot your password?

              </Link>

          {/* Business Registration Link */}            </div>

          <div className="mt-6 text-center">

            <p className="text-sm text-muted-foreground">            {/* Submit Button */}

              Want to register your business?{' '}            <Button

              <Link href="/business-register" className="text-accent hover:text-accent/80 font-medium transition-colors">              type="submit"

                Business Registration              disabled={isLoading || !formData.email || !formData.password}

              </Link>              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-semibold"

            </p>            >

          </div>              {isLoading ? (

        </Card>                <div className="flex items-center">

                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>

        {/* Features */}                  Signing in...

        <div className="mt-8 grid grid-cols-2 gap-4 text-center">                </div>

          <div className="p-4 bg-card/30 rounded-lg border border-border/50">              ) : (

            <User className="w-6 h-6 text-primary mx-auto mb-2" />                <div className="flex items-center justify-center">

            <h3 className="font-semibold text-sm">Personal Account</h3>                  Sign In

            <p className="text-xs text-muted-foreground mt-1">Discover local businesses</p>                  <ArrowRight className="w-4 h-4 ml-2" />

          </div>                </div>

          <div className="p-4 bg-card/30 rounded-lg border border-border/50">              )}

            <Sparkles className="w-6 h-6 text-accent mx-auto mb-2" />            </Button>

            <h3 className="font-semibold text-sm">Business Account</h3>          </form>

            <p className="text-xs text-muted-foreground mt-1">Manage your business</p>

          </div>          {/* Divider */}

        </div>          <div className="my-6">

      </div>            <Separator className="my-4" />

                  <p className="text-center text-sm text-muted-foreground">Or continue with</p>

      <Footer />          </div>

    </div>

  )          {/* Social Login */}

}          <div className="space-y-3">
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
