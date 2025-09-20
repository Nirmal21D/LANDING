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
  name: string
  business_name: string
  latitude: number
  longitude: number
  lat_long: string
  business_category: string
  business_tags: string
  vector_score: number
  source_path: string
  distance_km: number
}

interface SearchResponse {
  ok: boolean
  results: Business[]
  search_params: {
    user_location: {
      lat: number
      lng: number
    }
    max_distance_km: number
    category_filter?: string
    tag_filters?: string[]
    query: string
  }
  total_found: number
  search_method: string
}

// Mock local businesses registered on Thikana - removed as we'll use real API

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
  const [isSearching, setIsSearching] = useState(false)
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

  // Search businesses using the real API with Gemini AI-enhanced filters
  const searchBusinesses = async (query: string): Promise<{ businesses: Business[], filterInfo?: any }> => {
    if (!userLocation) return { businesses: [] }
    
    try {
      setIsSearching(true)
      
      // Generate intelligent filters using Gemini AI
      const filtersResponse = await fetch('/api/generate-search-filters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      })
      
      let category_filter: string | undefined
      let tag_filters: string[] = []
      let enhanced_query = query
      let max_distance_km = 10
      let limit = 5
      let search_type = 'specific'
      let aiFiltersUsed = false
      
      if (filtersResponse.ok) {
        const filtersData = await filtersResponse.json()
        if (filtersData.success) {
          category_filter = filtersData.filters.category_filter
          tag_filters = filtersData.filters.tag_filters
          enhanced_query = filtersData.filters.enhanced_query || query
          max_distance_km = filtersData.filters.max_distance_km || 10
          limit = filtersData.filters.limit || 5
          search_type = filtersData.filters.search_type || 'specific'
          aiFiltersUsed = true
          console.log('🤖 Gemini AI generated filters:', filtersData.filters)
        } else {
          console.warn('AI filter generation failed, using fallback')
        }
      } else {
        console.warn('AI filter API unavailable, using original query')
      }
      
      const requestBody = {
        user_lat: userLocation.lat,
        user_lng: userLocation.lng,
        query: enhanced_query,
        max_distance_km: max_distance_km,
        ...(category_filter && { category_filter }),
        ...(tag_filters.length > 0 && { tag_filters }),
        limit: limit
      }
      
      console.log('🔍 Enhanced search request:', requestBody)
      
      const response = await fetch('http://128.199.11.96:8001/search-businesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: SearchResponse = await response.json()
      console.log('Search response:', data)
      
      if (data.ok) {
        return { 
          businesses: data.results,
          filterInfo: aiFiltersUsed ? {
            category_filter,
            tag_filters,
            enhanced_query,
            max_distance_km,
            limit,
            search_type,
            aiEnhanced: true
          } : undefined
        }
      } else {
        throw new Error('Search failed')
      }
      
    } catch (error) {
      console.error('Search error:', error)
      return { businesses: [] }
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = async (searchQuery?: string) => {
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

    try {
      // Search using real API
      const searchResult = await searchBusinesses(query)
      const foundBusinesses = searchResult.businesses
      const filterInfo = searchResult.filterInfo
      let botResponse = ""

      if (foundBusinesses.length > 0) {
        // Different messages based on search type
        if (filterInfo?.search_type === 'comprehensive') {
          botResponse = `🔍 **Comprehensive Search Results**\n\nFound ${foundBusinesses.length} businesses matching "${query}" within ${filterInfo.max_distance_km}km radius:`
        } else if (filterInfo?.search_type === 'broad') {
          botResponse = `🎯 **Broad Search Results**\n\nFound ${foundBusinesses.length} businesses matching "${query}" within ${filterInfo.max_distance_km}km:`
        } else {
          botResponse = `🎯 Found ${foundBusinesses.length} local businesses matching "${query}":`
        }
        
        // Add AI enhancement info if filters were used
        if (filterInfo?.aiEnhanced) {
          botResponse += "\n\n🤖 **AI-Enhanced Search**"
          if (filterInfo.search_type === 'comprehensive') {
            botResponse += "\n• Search Type: Comprehensive (maximum radius)"
          } else if (filterInfo.search_type === 'broad') {
            botResponse += "\n• Search Type: Broad (expanded area)"
          }
          if (filterInfo.category_filter) {
            botResponse += `\n• Category: ${filterInfo.category_filter}`
          }
          if (filterInfo.tag_filters?.length > 0) {
            botResponse += `\n• Tags: ${filterInfo.tag_filters.join(', ')}`
          }
          if (filterInfo.enhanced_query !== query) {
            botResponse += `\n• Enhanced query: "${filterInfo.enhanced_query}"`
          }
          botResponse += `\n• Radius: ${filterInfo.max_distance_km}km • Results: ${filterInfo.limit}`
        }
        
        botResponse += "\n\nThese are registered businesses on Thikana with verified locations and real-time information."
      } else {
        let searchScope = ""
        if (filterInfo?.search_type === 'comprehensive') {
          searchScope = ` within ${filterInfo.max_distance_km}km (maximum radius)`
        } else if (filterInfo?.search_type === 'broad') {
          searchScope = ` within ${filterInfo.max_distance_km}km (expanded area)`
        } else {
          searchScope = " in your immediate area"
        }
        
        botResponse = `🔍 No businesses found matching "${query}"${searchScope}.\n\n💡 **Try these comprehensive searches:**\n• "Find all coffee shops"\n• "All restaurants near me"\n• "List all medical clinics"\n• "Show all repair services"\n• "Find all grocery stores"\n\nOr be more specific with your needs.`
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        businesses: foundBusinesses
      }

      setMessages(prev => [...prev, botMessage])
      
    } catch (error) {
      console.error('Search failed:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "❌ Search failed. Please check your internet connection and try again. If the problem persists, our search service might be temporarily unavailable.",
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }

    setInputValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    }
  }

  const BusinessCard = ({ business }: { business: Business }) => {
    // Extract tags from business_tags string
    const tags = business.business_tags ? business.business_tags.split(',').map(tag => tag.trim()) : []
    
    return (
      <Card className="mb-3 hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold">{business.business_name}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">by {business.name}</span>
                <Badge variant="outline" className="text-xs">{business.business_category}</Badge>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{(business.vector_score * -100).toFixed(1)}</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{business.lat_long}</span>
              <span className="text-primary font-medium">• {business.distance_km.toFixed(1)} km away</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag.replace('-', ' ')}
                </Badge>
              ))}
            </div>

            <div className="bg-muted/50 rounded p-2">
              <p className="text-xs text-muted-foreground mb-1">Search match:</p>
              <p className="text-xs text-foreground">Vector score: {business.vector_score.toFixed(4)}</p>
              <p className="text-xs text-foreground">Method: Vectorized search</p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`
                  window.open(url, '_blank')
                }}
              >
                <Navigation className="h-4 w-4 mr-1" />
                Directions
              </Button>
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  window.open(`tel:${business.name}`, '_self')
                }}
              >
                <Phone className="h-4 w-4 mr-1" />
                Contact
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
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
            AI-powered chatbot search for comprehensive business discovery. Ask for "all coffee shops" to get maximum radius results, or be specific for nearby options.
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
                  Live Search Active
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
                    {message.businesses.map((business, index) => (
                      <BusinessCard key={`${business.business_name}-${index}`} business={business} />
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
                placeholder={!userLocation ? "Enable location access to start searching..." : "Ask me to find businesses... (e.g., 'find all coffee shops' or 'show me restaurants')"}
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
            
            {/* Quick Comprehensive Search Suggestions */}
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                "Find all coffee shops",
                "All restaurants near me", 
                "List all medical clinics",
                "Show all repair services",
                "Find all grocery stores"
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch(suggestion)}
                  className="text-xs hover:bg-primary hover:text-primary-foreground"
                  disabled={!userLocation}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
            
            {userLocation && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                💡 Try comprehensive searches like "Find all coffee shops" for maximum radius results
              </p>
            )}
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