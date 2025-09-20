"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { MapPin, Search, Navigation, Clock, Star, Phone, Globe, Filter, ChevronDown, Loader2, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { 
  Navbar
} from "@/components/navbar"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { Footer } from "@/components/ui/footer"

interface Business {
  name: string                    // Owner/Contact name from API
  business_name: string          // Actual business name from API  
  latitude: number               // GPS coordinates from API
  longitude: number              // GPS coordinates from API
  lat_long: string              // Formatted coordinates from API
  business_category: string     // Category classification from API
  business_tags: string         // Comma-separated tags from API
  vector_score: number          // AI similarity score from API (negative value)
  source_path: string           // Data source path from API
  distance_km: number           // Calculated distance from user location
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

interface FilterState {
  category: string
  radius: number
  tags: string[]
  sortBy: 'distance' | 'rating' | 'name'
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [searchInfo, setSearchInfo] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    radius: 20,
    tags: [],
    sortBy: 'distance'
  })

  // Auto-fetch location on component mount
  useEffect(() => {
    getCurrentLocation()
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
    }
    
    // Load demo data by default to showcase the interface
    setBusinesses(demoBusinesses.slice(0, 3)) // Show first 3 businesses
    setTotalResults(3)
  }, [searchParams])

  // Auto-execute search when location becomes available and there's a query
  useEffect(() => {
    const query = searchParams.get('q')
    if (userLocation && query && searchQuery === query && businesses.length === 0) {
      handleSearch(query)
    }
  }, [userLocation, searchParams, searchQuery, businesses.length])

  // Get user location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          setIsLoadingLocation(false)
          console.log('Location obtained:', { lat: latitude, lng: longitude })
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLoadingLocation(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
      setIsLoadingLocation(false)
    }
  }

  // Demo data for testing while endpoint is having issues
  const demoBusinesses: Business[] = [
    {
      name: "John's Coffee Shop",
      business_name: "Brew & Bean",
      latitude: 40.7128,
      longitude: -74.0060,
      lat_long: "40.7128, -74.0060",
      business_category: "Cafe",
      business_tags: "coffee, espresso, wifi, organic, breakfast",
      vector_score: -0.85,
      source_path: "/business/brew-bean",
      distance_km: 0.8
    },
    {
      name: "Maria Garcia",
      business_name: "Family Medical Center",
      latitude: 40.7589,
      longitude: -73.9851,
      lat_long: "40.7589, -73.9851",
      business_category: "Medical",
      business_tags: "family-doctor, pediatric, emergency, health-checkup",
      vector_score: -0.92,
      source_path: "/business/family-medical",
      distance_km: 1.2
    },
    {
      name: "Tech Solutions Inc",
      business_name: "QuickFix Laptop Repair",
      latitude: 40.7505,
      longitude: -73.9934,
      lat_long: "40.7505, -73.9934",
      business_category: "Service",
      business_tags: "laptop-repair, mobile-repair, same-day, warranty",
      vector_score: -0.78,
      source_path: "/business/quickfix-repair",
      distance_km: 2.1
    },
    {
      name: "Italian Delights",
      business_name: "Pasta Paradise",
      latitude: 40.7282,
      longitude: -74.0776,
      lat_long: "40.7282, -74.0776",
      business_category: "Restaurant",
      business_tags: "italian, pasta, pizza, delivery, family-friendly",
      vector_score: -0.89,
      source_path: "/business/pasta-paradise",
      distance_km: 1.5
    },
    {
      name: "Green Grocers",
      business_name: "Fresh Market",
      latitude: 40.7614,
      longitude: -73.9776,
      lat_long: "40.7614, -73.9776",
      business_category: "Store",
      business_tags: "organic, fresh-produce, local, eco-friendly",
      vector_score: -0.81,
      source_path: "/business/fresh-market",
      distance_km: 3.2
    },
    {
      name: "Downtown Dental",
      business_name: "Smile Clinic",
      latitude: 40.7411,
      longitude: -74.0012,
      lat_long: "40.7411, -74.0012",
      business_category: "Medical",
      business_tags: "dental, teeth-cleaning, orthodontics, cosmetic",
      vector_score: -0.87,
      source_path: "/business/smile-clinic",
      distance_km: 1.8
    },
    {
      name: "Cafe Milano",
      business_name: "Espresso Corner",
      latitude: 40.7352,
      longitude: -74.0088,
      lat_long: "40.7352, -74.0088",
      business_category: "Cafe",
      business_tags: "coffee, espresso, pastries, wifi, breakfast",
      vector_score: -0.83,
      source_path: "/business/espresso-corner",
      distance_km: 2.3
    },
    {
      name: "Pizza Express",
      business_name: "Tony's Pizzeria",
      latitude: 40.7198,
      longitude: -74.0123,
      lat_long: "40.7198, -74.0123",
      business_category: "Restaurant",
      business_tags: "pizza, italian, delivery, family-friendly, takeout",
      vector_score: -0.79,
      source_path: "/business/tonys-pizzeria",
      distance_km: 2.8
    },
    {
      name: "Mobile Solutions",
      business_name: "Phone Fix Pro",
      latitude: 40.7445,
      longitude: -73.9912,
      lat_long: "40.7445, -73.9912",
      business_category: "Service",
      business_tags: "mobile-repair, phone-repair, screen-replacement, same-day",
      vector_score: -0.76,
      source_path: "/business/phone-fix-pro",
      distance_km: 1.9
    },
    {
      name: "Brew & Bean",
      business_name: "Morning Grind",
      latitude: 40.7289,
      longitude: -74.0089,
      lat_long: "40.7289, -74.0089",
      business_category: "Cafe",
      business_tags: "coffee, brew, artisan, organic, wifi, breakfast",
      vector_score: -0.72,
      source_path: "/business/morning-grind",
      distance_km: 3.1
    },
    {
      name: "Fresh Market",
      business_name: "Green Valley Grocers",
      latitude: 40.7556,
      longitude: -73.9845,
      lat_long: "40.7556, -73.9845",
      business_category: "Store",
      business_tags: "grocery, organic, fresh-produce, local, market",
      vector_score: -0.69,
      source_path: "/business/green-valley-grocers",
      distance_km: 2.7
    },
    {
      name: "Burger Hub",
      business_name: "All-American Diner",
      latitude: 40.7123,
      longitude: -74.0156,
      lat_long: "40.7123, -74.0156",
      business_category: "Restaurant",
      business_tags: "burgers, american, diner, comfort-food, milkshakes",
      vector_score: -0.65,
      source_path: "/business/all-american-diner",
      distance_km: 3.5
    }
  ]

  // Search businesses using real API
  const searchBusinesses = async (query: string): Promise<{ businesses: Business[], filterInfo?: any, error?: string }> => {
    if (!userLocation) return { businesses: [], error: 'Location required for search' }
    
    try {
      setIsLoading(true)
      setErrorMessage('')
      
      // Generate intelligent filters using Gemini AI 
      const filtersResponse = await fetch('/api/generate-search-filters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query,
          user_location: userLocation 
        })
      })
      
      let category_filter: string | undefined
      let tag_filters: string[] = []
      let enhanced_query = query
      let max_distance_km = filters.radius
      let limit = 20
      let search_type = 'specific'
      let aiFiltersUsed = false
      
      if (filtersResponse.ok) {
        const filtersData = await filtersResponse.json()
        if (filtersData.success) {
          category_filter = filtersData.filters.category_filter
          tag_filters = filtersData.filters.tag_filters
          enhanced_query = filtersData.filters.enhanced_query || query
          max_distance_km = filtersData.filters.max_distance_km || filters.radius
          limit = filtersData.filters.limit || 20
          search_type = filtersData.filters.search_type || 'specific'
          aiFiltersUsed = true
          console.log('🤖 Gemini AI generated filters:', filtersData.filters)
        }
      }

      // Apply manual filters if category is selected
      if (filters.category !== 'all') {
        category_filter = filters.category
      }
      
      // Call the real business search API
      const searchResponse = await fetch('/api/search-businesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: enhanced_query,
          user_location: userLocation,
          max_distance_km,
          category_filter,
          tag_filters,
          limit
        })
      })

      if (!searchResponse.ok) {
        throw new Error(`Search API error: ${searchResponse.status} ${searchResponse.statusText}`)
      }

      const searchData = await searchResponse.json()
      
      if (!searchData.ok) {
        throw new Error(searchData.error || 'Search failed')
      }

      const businesses = searchData.results || []
      
      console.log('✅ Real API search results:', {
        query: enhanced_query,
        total_found: searchData.total_found,
        results_count: businesses.length,
        search_method: searchData.search_method,
        ai_enhanced: aiFiltersUsed,
        category_filter,
        tag_filters
      })

      return {
        businesses,
        filterInfo: {
          aiEnhanced: aiFiltersUsed,
          searchMethod: searchData.search_method,
          totalFound: searchData.total_found,
          filters: { category_filter, tag_filters },
          searchParams: searchData.search_params
        }
      }
    } catch (error) {
      console.error('🚨 Business search failed:', error)
      return { 
        businesses: [], 
        error: error instanceof Error ? error.message : 'Search failed. Please try again.' 
      }
    } finally {
      setIsLoading(false)
    }
  }
      
      // Filter demo data based on search criteria with intelligent matching
      let filteredBusinesses = demoBusinesses.filter(business => {
        const queryLower = query.toLowerCase()
        
        // Enhanced matching logic with smart prioritization
        const businessMatchesQuery = 
          // Direct name/category/tag matches
          business.business_name.toLowerCase().includes(queryLower) ||
          business.business_category.toLowerCase().includes(queryLower) ||
          business.business_tags.toLowerCase().includes(queryLower) ||
          business.name.toLowerCase().includes(queryLower) ||
          
          // Smart food + location queries
          (queryLower.includes('pasta') && queryLower.includes('near') && (business.business_tags.includes('pasta') || business.business_tags.includes('italian'))) ||
          (queryLower.includes('pizza') && queryLower.includes('near') && (business.business_tags.includes('pizza') || business.business_tags.includes('italian'))) ||
          (queryLower.includes('italian') && queryLower.includes('near') && business.business_tags.includes('italian')) ||
          (queryLower.includes('coffee') && queryLower.includes('near') && (business.business_tags.includes('coffee') || business.business_category === 'Cafe')) ||
          (queryLower.includes('burger') && queryLower.includes('near') && business.business_tags.includes('burgers')) ||
          (queryLower.includes('food') && queryLower.includes('near') && business.business_category === 'Restaurant') ||
          
          // Specific food terms (without location)
          (queryLower.includes('pasta') && !queryLower.includes('near') && (business.business_tags.includes('pasta') || business.business_tags.includes('italian'))) ||
          (queryLower.includes('pizza') && !queryLower.includes('near') && (business.business_tags.includes('pizza') || business.business_tags.includes('italian'))) ||
          (queryLower.includes('italian') && business.business_tags.includes('italian')) ||
          (queryLower.includes('burger') && business.business_tags.includes('burgers')) ||
          (queryLower.includes('diner') && business.business_tags.includes('diner')) ||
          (queryLower.includes('american') && business.business_tags.includes('american')) ||
          
          // General food/restaurant terms
          (queryLower.includes('food') && !queryLower.includes('near') && business.business_category === 'Restaurant') ||
          (queryLower.includes('eat') && business.business_category === 'Restaurant') ||
          (queryLower.includes('dining') && business.business_category === 'Restaurant') ||
          (queryLower.includes('restaurant') && business.business_category === 'Restaurant') ||
          
          // Coffee related terms
          (queryLower.includes('coffee') && !queryLower.includes('near') && (business.business_tags.includes('coffee') || business.business_category === 'Cafe')) ||
          (queryLower.includes('cafe') && business.business_category === 'Cafe') ||
          (queryLower.includes('espresso') && business.business_tags.includes('espresso')) ||
          (queryLower.includes('brew') && business.business_tags.includes('coffee')) ||
          
          // Medical related terms
          (queryLower.includes('doctor') && business.business_category === 'Medical') ||
          (queryLower.includes('clinic') && business.business_category === 'Medical') ||
          (queryLower.includes('medical') && business.business_category === 'Medical') ||
          (queryLower.includes('health') && business.business_category === 'Medical') ||
          (queryLower.includes('dental') && business.business_tags.includes('dental')) ||
          (queryLower.includes('teeth') && business.business_tags.includes('dental')) ||
          
          // Repair/Service related terms
          (queryLower.includes('repair') && business.business_category === 'Service') ||
          (queryLower.includes('fix') && business.business_category === 'Service') ||
          (queryLower.includes('laptop') && business.business_tags.includes('laptop-repair')) ||
          (queryLower.includes('computer') && business.business_tags.includes('laptop-repair')) ||
          (queryLower.includes('mobile') && business.business_tags.includes('mobile-repair')) ||
          (queryLower.includes('phone') && business.business_tags.includes('mobile-repair')) ||
          
          // Store/Shopping related terms
          (queryLower.includes('store') && business.business_category === 'Store') ||
          (queryLower.includes('shop') && business.business_category === 'Store') ||
          (queryLower.includes('market') && business.business_category === 'Store') ||
          (queryLower.includes('grocery') && business.business_category === 'Store') ||
          (queryLower.includes('organic') && business.business_tags.includes('organic')) ||
          (queryLower.includes('fresh') && business.business_tags.includes('fresh-produce')) ||
          
          // Generic location queries (only when no specific category is mentioned)
          (!queryLower.includes('pasta') && !queryLower.includes('pizza') && !queryLower.includes('coffee') && 
           !queryLower.includes('medical') && !queryLower.includes('repair') && !queryLower.includes('burger') &&
           (queryLower.includes('near me') || queryLower.includes('nearby') || queryLower.includes('close')))
        
        const categoryMatches = !category_filter || business.business_category === category_filter
        const distanceMatches = business.distance_km <= max_distance_km
        
        let tagMatches = true
        if (tag_filters.length > 0) {
          tagMatches = tag_filters.some(tag => 
            business.business_tags.toLowerCase().includes(tag.toLowerCase())
          )
        }
        
        return businessMatchesQuery && categoryMatches && distanceMatches && tagMatches
      })

      // Limit results
      filteredBusinesses = filteredBusinesses.slice(0, limit)
      
      // Fallback: if no results found but query seems to be looking for a category, show all in that category
      if (filteredBusinesses.length === 0 && category_filter) {
        filteredBusinesses = demoBusinesses.filter(business => 
          business.business_category === category_filter && 
          business.distance_km <= max_distance_km
        ).slice(0, limit)
      }
      
      // Final fallback: if still no results and it's a "near me" type query, show closest businesses
      if (filteredBusinesses.length === 0 && (query.toLowerCase().includes('near') || query.toLowerCase().includes('close'))) {
        filteredBusinesses = demoBusinesses
          .filter(business => business.distance_km <= max_distance_km)
          .sort((a, b) => a.distance_km - b.distance_km)
          .slice(0, Math.min(3, limit))
      }
      
      console.log('🔍 Demo search results:', {
        query,
        category_filter,
        tag_filters,
        max_distance_km,
        results: filteredBusinesses.length,
        fallback_used: filteredBusinesses.length > 0 && !demoBusinesses.some(b => 
          b.business_name.toLowerCase().includes(query.toLowerCase()) ||
          b.business_tags.toLowerCase().includes(query.toLowerCase())
        )
      })
      
      return { 
        businesses: filteredBusinesses,
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
      
    } catch (error) {
      console.error('Search error:', error)
      
      let errorMessage = "❌ Search failed. "
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage += "Please check your internet connection and try again."
        } else if (error.message.includes('500')) {
          errorMessage += "Our search service is temporarily unavailable. Please try again in a moment."
        } else {
          errorMessage += `Error: ${error.message}`
        }
      } else {
        errorMessage += "Please try again. If the problem persists, our search service might be temporarily unavailable."
      }
      
      return { businesses: [], error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (queryParam?: string) => {
    const query = queryParam || searchQuery.trim()
    if (!query) return

    if (!userLocation) {
      alert("Please enable location access to search for nearby businesses.")
      return
    }

    try {
      const searchResult = await searchBusinesses(query)
      const foundBusinesses = searchResult.businesses
      const filterInfo = searchResult.filterInfo
      const searchError = searchResult.error

      if (searchError) {
        alert(searchError)
        return
      }

      setBusinesses(foundBusinesses)
      setTotalResults(foundBusinesses.length)
      setSearchInfo(filterInfo)

      // Sort businesses based on selected sort option
      const sortedBusinesses = [...foundBusinesses].sort((a, b) => {
        switch (filters.sortBy) {
          case 'distance':
            return a.distance_km - b.distance_km
          case 'rating':
            return b.vector_score - a.vector_score
          case 'name':
            return a.business_name.localeCompare(b.business_name)
          default:
            return 0
        }
      })
      
      setBusinesses(sortedBusinesses)
      
    } catch (error) {
      console.error('Search failed:', error)
      alert("Search failed. Please try again.")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    }
  }

  const BusinessCard = ({ business }: { business: Business }) => {
    const tags = business.business_tags ? business.business_tags.split(',').map(tag => tag.trim()) : []
    
    return (
      <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
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
                <span className="text-sm font-medium">
                  {Math.abs(business.vector_score * 100).toFixed(1)}% match
                </span>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500" title="Available"></div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{business.lat_long}</span>
              {business.distance_km !== undefined && (
                <span className="text-primary font-medium">
                  • {business.distance_km === 0 ? 'Current location' : `${business.distance_km.toFixed(1)} km away`}
                </span>
              )}
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
            
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Navigation className="h-4 w-4 mr-1" />
                Directions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 pb-8">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Find Local Businesses
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover registered businesses near you with AI-powered search and real-time information
              </p>
              
              {/* Demo Mode Indicator */}
              <div className="mt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                  <span className="text-sm font-medium">🧪 Demo Mode - Using sample data</span>
                </div>
              </div>
            </div>

            {/* Location Status */}
            {isLoadingLocation ? (
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">Getting your location...</span>
                </div>
              </div>
            ) : userLocation ? (
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">Location detected • Ready to search</span>
                </div>
              </div>
            ) : (
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                  <Navigation className="w-4 h-4" />
                  <span className="text-sm font-medium">Location needed for accurate results</span>
                  <Button size="sm" variant="ghost" onClick={getCurrentLocation}>
                    Enable Location
                  </Button>
                </div>
              </div>
            )}

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={!userLocation ? "Enable location to start searching..." : "Search for businesses... (e.g., 'coffee shops', 'restaurants')"}
                    className="pl-10 h-12 text-base"
                    disabled={!userLocation || isLoading}
                  />
                </div>
                <Button 
                  onClick={() => handleSearch()}
                  disabled={!searchQuery.trim() || !userLocation || isLoading}
                  className="h-12 px-6"
                  size="lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12 px-4"
                  size="lg"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Quick Search Suggestions */}
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {[
                  "Coffee near me",
                  "Pasta restaurants", 
                  "Medical clinics",
                  "Phone repair",
                  "Fresh groceries",
                  "Burger places",
                  "Italian food",
                  "Dental care"
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery(suggestion)
                      handleSearch(suggestion)
                    }}
                    className="text-xs"
                    disabled={!userLocation}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="border-b bg-card">
            <div className="max-w-6xl mx-auto px-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Restaurant">Restaurant</SelectItem>
                      <SelectItem value="Cafe">Cafe</SelectItem>
                      <SelectItem value="Medical">Medical</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                      <SelectItem value="Store">Store</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Radius: {filters.radius}km</label>
                  <Slider
                    value={[filters.radius]}
                    onValueChange={(value) => setFilters({...filters, radius: value[0]})}
                    max={50}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={filters.sortBy} onValueChange={(value: 'distance' | 'rating' | 'name') => setFilters({...filters, sortBy: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distance">Distance</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={() => searchQuery && handleSearch()}
                    disabled={!searchQuery || !userLocation || isLoading}
                    className="w-full"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Results Header */}
          {businesses.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Search Results</h2>
                  <p className="text-muted-foreground">
                    Found {totalResults} businesses
                    {searchInfo?.aiEnhanced && (
                      <span className="ml-2 text-primary">• AI Enhanced • Vectorized Search</span>
                    )}
                  </p>
                </div>
                {searchInfo?.aiEnhanced && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    🤖 AI Enhanced Search
                  </Badge>
                )}
              </div>
              {searchInfo?.aiEnhanced && (
                <div className="mt-2 text-sm text-muted-foreground">
                  {searchInfo.category_filter && <span>Category: {searchInfo.category_filter} • </span>}
                  {searchInfo.tag_filters?.length > 0 && <span>Tags: {searchInfo.tag_filters.join(', ')} • </span>}
                  <span>Radius: {searchInfo.max_distance_km}km</span>
                </div>
              )}
            </div>
          )}

          {/* Business Cards Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Searching for businesses...</p>
            </div>
          ) : businesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business, index) => (
                <BusinessCard key={index} business={business} />
              ))}
            </div>
          ) : searchQuery && userLocation ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No businesses found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or expanding the radius
              </p>
              <Button onClick={() => setShowFilters(true)} variant="outline">
                Adjust Filters
              </Button>
            </div>
          ) : null}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}