"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { MapPin, Search, Send, Bot, User, Navigation, Clock, Star, Phone, Globe, Triangle, Database, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  businesses?: Business[]
}

interface Business {
  id: string
  owner_name: string
  business_name: string
  category: string
  tags: string[]
  latitude: number
  longitude: number
  distance: number
  rating: number
  isOpen: boolean
  description: string
  address: string
  phone?: string
  posts?: string[]
}

// Mock local businesses registered on Thikana
const mockBusinesses: Business[] = [
  {
    id: "1",
    owner_name: "Rajesh Kumar",
    business_name: "Pure Veg Delight",
    category: "Restaurant",
    tags: ["pure-veg", "indian", "family-restaurant", "lunch", "dinner"],
    latitude: 37.7749,
    longitude: -122.4194,
    distance: 0.3,
    rating: 4.6,
    isOpen: true,
    description: "100% pure vegetarian restaurant serving authentic Indian cuisine",
    address: "123 Main Street, Downtown",
    phone: "+1-555-0123",
    posts: ["New South Indian menu launched!", "Fresh organic vegetables daily"]
  },
  {
    id: "2",
    owner_name: "Dr. Sarah Wilson",
    business_name: "Wilson Family Clinic",
    category: "Medical",
    tags: ["family-doctor", "clinic", "consultation", "emergency"],
    latitude: 37.7849,
    longitude: -122.4094,
    distance: 0.8,
    rating: 4.8,
    isOpen: true,
    description: "Family medical practice with 15+ years experience",
    address: "456 Health Ave, Medical District",
    phone: "+1-555-0456",
    posts: ["Weekend consultation available", "Vaccination drive this month"]
  },
  {
    id: "3",
    owner_name: "Mike Chen",
    business_name: "Tech Repair Hub",
    category: "Service",
    tags: ["laptop-repair", "mobile-repair", "freelancer", "tech-support"],
    latitude: 37.7649,
    longitude: -122.4294,
    distance: 1.2,
    rating: 4.4,
    isOpen: false,
    description: "Freelance tech repair specialist - laptops, mobiles, tablets",
    address: "789 Tech Street, Silicon Valley",
    phone: "+1-555-0789",
    posts: ["Same day laptop repair service", "iPhone screen replacement - 30 min"]
  },
  {
    id: "4",
    owner_name: "Priya Sharma",
    business_name: "Green Grocery Store",
    category: "Store",
    tags: ["organic", "vegetables", "fruits", "grocery", "local"],
    latitude: 37.7549,
    longitude: -122.4394,
    distance: 0.6,
    rating: 4.7,
    isOpen: true,
    description: "Fresh organic produce and daily groceries",
    address: "321 Green Lane, Suburb",
    phone: "+1-555-0321",
  }
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "👋 Hi! I'm Thikana Search Assistant. I'm automatically detecting your location to help you find local businesses nearby.\n\n🗺️ Once your location is confirmed, just tell me what you're looking for:\n• \"Pure veg restaurants near me\"\n• \"Laptop repair shops\"\n• \"Family doctors nearby\"\n• \"Organic grocery stores\"\n\nI'll search through our registered local businesses and show you the best matches with their locations, ratings, and contact details!",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Handle search query from URL parameters and auto-fetch location
  useEffect(() => {
    // Auto-fetch location on component mount
    getCurrentLocation()
    
    const query = searchParams.get('q')
    if (query) {
      setInputValue(query)
      // Don't auto-search immediately, wait for location to be available
    }
  }, [searchParams])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-execute search when location becomes available and there's a pending query
  useEffect(() => {
    const query = searchParams.get('q')
    if (userLocation && query && inputValue === query && messages.length === 1) {
      // Location is now available and we have a query from URL, execute it
      handleSearch(query)
    }
  }, [userLocation, searchParams, inputValue, messages.length])

  // Get user location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setIsLoadingLocation(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLoadingLocation(false)
          
          // Add error message to chat
          const errorMessage: Message = {
            id: Date.now().toString(),
            type: 'bot',
            content: `❌ **Location Access Error**\n\n${
              error.code === 1 ? "Location access was denied. Please enable location permissions in your browser settings." :
              error.code === 2 ? "Location information is unavailable. Please check your internet connection." :
              error.code === 3 ? "Location request timed out. Please try again." :
              "Unable to retrieve your location. Please try again or check your browser settings."
            }\n\nLocation access is required to find local businesses near you.`,
            timestamp: new Date()
          }
          setMessages(prev => [...prev, errorMessage])
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
      setIsLoadingLocation(false)
      
      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: "❌ **Geolocation Not Supported**\n\nYour browser doesn't support location services. Please use a modern browser or manually search for businesses by area name.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  // Search businesses based on query (vectorized search simulation)
  const searchBusinesses = (query: string): Business[] => {
    const queryLower = query.toLowerCase()
    
    // Simulate vectorized search through business data, posts, and descriptions
    return mockBusinesses.filter(business => {
      const nameMatch = business.business_name.toLowerCase().includes(queryLower)
      const categoryMatch = business.category.toLowerCase().includes(queryLower)
      const tagMatch = business.tags.some(tag => tag.toLowerCase().includes(queryLower))
      const descriptionMatch = business.description.toLowerCase().includes(queryLower)
      const postMatch = business.posts?.some(post => post.toLowerCase().includes(queryLower))
      
      return nameMatch || categoryMatch || tagMatch || descriptionMatch || postMatch
    }).sort((a, b) => a.distance - b.distance).slice(0, 5)
  }

  const handleSearch = (searchQuery?: string) => {
    const query = searchQuery || inputValue.trim()
    if (!query) return

    // Check if user location is available
    if (!userLocation) {
      // Show error message requesting location
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: "📍 I need your location to find nearby businesses. Please click the 'Get My Location' button above to enable location access, then try searching again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      return
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    // Simulate search processing
    setTimeout(() => {
      const foundBusinesses = searchBusinesses(query)
      let botResponse = ""

      if (foundBusinesses.length > 0) {
        botResponse = `🎯 Found ${foundBusinesses.length} local businesses matching "${query}":\n\nThese are registered businesses on Thikana with verified locations and real-time information.`
      } else {
        botResponse = `🔍 No businesses found matching "${query}". Try searching for:\n• Restaurants near me\n• Medical clinics\n• Repair services\n• Grocery stores\n• Freelancers`
        // Show some sample businesses
        foundBusinesses.push(...mockBusinesses.slice(0, 2))
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        businesses: foundBusinesses
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)

    setInputValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    }
  }

  const BusinessCard = ({ business }: { business: Business }) => (
    <Card className="mb-3 hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">{business.business_name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">by {business.owner_name}</span>
              <Badge variant="outline" className="text-xs">{business.category}</Badge>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{business.rating}</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${business.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{business.description}</p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{business.address}</span>
            <span className="text-primary font-medium">• {business.distance} km away</span>
          </div>

          {business.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4" />
              <span>{business.phone}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {business.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag.replace('-', ' ')}
              </Badge>
            ))}
          </div>

          {business.posts && business.posts.length > 0 && (
            <div className="mt-3 p-2 bg-muted/50 rounded">
              <p className="text-xs text-muted-foreground mb-1">Latest posts:</p>
              {business.posts.slice(0, 2).map((post, index) => (
                <p key={index} className="text-xs text-foreground">• {post}</p>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Navigation className="h-4 w-4 mr-1" />
              Directions
            </Button>
            <Button size="sm" className="flex-1">
              <Phone className="h-4 w-4 mr-1" />
              Contact
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

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
            <NavbarButton href="/chat" variant="secondary">
              Business Intel
            </NavbarButton>
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
            <div className="space-y-4 p-4">
              <a href="/" className="block text-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a href="/chat" className="block text-foreground hover:text-primary transition-colors">
                Chat
              </a>
              <div className="space-y-2">
                <NavbarButton href="/chat" variant="secondary" className="w-full">
                  Business Intel
                </NavbarButton>
                <NavbarButton href="/business-register" variant="primary" className="w-full">
                  Register Business
                </NavbarButton>
              </div>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      <div className="pt-20 pb-8 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4 border border-primary/30">
            <Search className="w-4 h-4 mr-2" />
            Local Business Discovery
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Find Local</span> Businesses
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Chat-style search for registered stores, medical services, freelancers & more. Get location-based results with real-time data.
          </p>
        </div>

        {/* Location Loading/Status Section */}
        {isLoadingLocation ? (
          <Card className="max-w-2xl mx-auto mb-8 bg-card/50 backdrop-blur-sm border-border shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Getting Your Location</h3>
              <p className="text-muted-foreground mb-6">
                We're automatically detecting your location to show you the most relevant local businesses nearby.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span>Please allow location access when prompted by your browser</span>
              </div>
            </CardContent>
          </Card>
        ) : !userLocation ? (
          <Card className="max-w-2xl mx-auto mb-8 bg-card/50 backdrop-blur-sm border-border shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-950/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Location Access Required</h3>
              <p className="text-muted-foreground mb-6">
                Location access was denied or unavailable. Please enable location permissions in your browser settings and refresh the page to search for local businesses.
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                size="lg" 
                variant="outline"
                className="mr-3"
              >
                Refresh Page
              </Button>
              <Button 
                onClick={getCurrentLocation} 
                size="lg" 
                className="bg-primary hover:bg-primary/90"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Location Status */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <MapPin className="w-4 h-4 text-green-600" />
                <span>Location enabled • Finding businesses near you</span>
              </div>
              <div className="mt-2 text-center">
                <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-background/80 rounded-md px-3 py-1 border">
                  <Globe className="w-3 h-3" />
                  <span className="font-mono">
                    {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-muted"
                    onClick={() => {
                      navigator.clipboard.writeText(`${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}`)
                    }}
                    title="Copy coordinates"
                  >
                    📋
                  </Button>
                </div>
              </div>
            </div>

        {/* Chat Interface */}
        <Card className="h-[800px] flex flex-col bg-card/50 backdrop-blur-sm border shadow-lg">
          {/* Chat Header */}
          <div className="border-b p-4 bg-card/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Search className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Local Business Search</h3>
                  <p className="text-xs text-muted-foreground">Find registered businesses • Real-time data</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {mockBusinesses.length} businesses
                </Badge>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div key={message.id}>
                <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                  <div className={`flex items-start space-x-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-accent text-accent-foreground'
                    }`}>
                      {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Results */}
                {message.businesses && message.businesses.length > 0 && (
                  <div className="ml-11 space-y-3">
                    {message.businesses.map((business) => (
                      <BusinessCard key={business.id} business={business} />
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="flex items-start space-x-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-muted">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={!userLocation ? "Enable location access to start searching..." : "Search for businesses... (e.g., 'pure veg restaurants near me')"}
                className="flex-1"
                disabled={isTyping || !userLocation}
              />
              <Button 
                onClick={() => handleSearch()}
                disabled={!inputValue.trim() || isTyping || !userLocation}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                "Pure veg restaurants near me",
                "Laptop repair shops",
                "Family doctors nearby",
                "Organic grocery stores",
                "Mobile repair services"
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(suggestion)}
                  className="text-xs"
                  disabled={isTyping || !userLocation}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Location-Based Search</h3>
            <p className="text-sm text-muted-foreground">Find businesses with exact distances and directions</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Verified Businesses</h3>
            <p className="text-sm text-muted-foreground">All businesses are registered and verified on Thikana</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Smart Search</h3>
            <p className="text-sm text-muted-foreground">Vectorized search through business data and posts</p>
          </Card>
        </div>
            </>
        )}
      </div>
      
      <Footer />
    </div>
  )
}