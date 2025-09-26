"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { MapPin, Search, Navigation, Clock, Star, Globe, Filter, ChevronDown, Loader2, SlidersHorizontal, Triangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
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

interface RecentSearch {
  searchQuery: string
  timestamp: string
  resultsCount?: number
  id?: string
}

interface FilterState {
  category: string
  radius: number
  sortBy: string
  tags: string[]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [totalResults, setTotalResults] = useState(0)
  const [searchInfo, setSearchInfo] = useState<any>(null)
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [isLoadingRecentSearches, setIsLoadingRecentSearches] = useState(false)
  
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    radius: 10,
    sortBy: 'relevance',
    tags: []
  })

  // Get user location
  const getCurrentLocation = async () => {
    setIsLoadingLocation(true)
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser.')
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        })
      })

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      
      setUserLocation(location)
      console.log('📍 User location:', location)
    } catch (error) {
      console.error('❌ Location error:', error)
      setErrorMessage('Unable to get your location. Please enable location access.')
      // Default to NYC coordinates
      setUserLocation({ lat: 40.7128, lng: -74.0060 })
    } finally {
      setIsLoadingLocation(false)
    }
  }

  // Fetch recent search logs
  const fetchRecentSearches = async () => {
    setIsLoadingRecentSearches(true)
    try {
      console.log('🔍 Fetching recent search logs...')
      const response = await fetch('http://139.59.29.80:8005/search-logs/recent', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.warn('⚠️ Recent searches API failed:', response.status)
        return
      }

      const data = await response.json()
      console.log('📥 Recent searches data:', data)
      
      // Handle the specific response format with logs array
      let searches: RecentSearch[] = []
      if (data.logs && Array.isArray(data.logs)) {
        searches = data.logs
      } else if (Array.isArray(data)) {
        searches = data
      } else if (data.searches && Array.isArray(data.searches)) {
        searches = data.searches
      } else if (data.data && Array.isArray(data.data)) {
        searches = data.data
      }

      setRecentSearches(searches.slice(0, 10)) // Limit to 10 recent searches
      console.log('✅ Recent searches loaded:', searches.length)
    } catch (error) {
      console.warn('⚠️ Failed to fetch recent searches (non-blocking):', error)
    } finally {
      setIsLoadingRecentSearches(false)
    }
  }

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
      
      // Use the filter radius instead of AI suggested radius
      max_distance_km = filters.radius
      
      // Call the real business search API
      const requestBody = {
        query: enhanced_query,
        user_location: userLocation,
        max_distance_km,
        category_filter,
        tag_filters,
        limit
      }
      
      console.log('🔍 === SEARCH REQUEST TO ENDPOINT ===')
      console.log('📤 Request URL:', '/api/search-businesses')
      console.log('📤 Request Method:', 'POST')
      console.log('📤 Request Headers:', { 'Content-Type': 'application/json' })
      console.log('📤 Request Body:', JSON.stringify(requestBody, null, 2))
      console.log('📤 Original Query:', query)
      console.log('📤 Enhanced Query:', enhanced_query)
      console.log('📤 User Location:', userLocation)
      console.log('📤 AI Filters Used:', aiFiltersUsed)
      
      const searchResponse = await fetch('/api/search-businesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('📥 === SEARCH RESPONSE FROM ENDPOINT ===')
      console.log('📥 Response Status:', searchResponse.status)
      console.log('📥 Response Headers:', Object.fromEntries(searchResponse.headers.entries()))

      if (!searchResponse.ok) {
        const errorText = await searchResponse.text()
        console.error('❌ Search API error response:', errorText)
        console.error('❌ Full error details:', {
          status: searchResponse.status,
          statusText: searchResponse.statusText,
          url: searchResponse.url,
          body: errorText
        })
        throw new Error(`Search API error: ${searchResponse.status} ${searchResponse.statusText} - ${errorText}`)
      }

      const searchData = await searchResponse.json()
      console.log('📥 Response Body (Raw):', JSON.stringify(searchData, null, 2))
      console.log('📥 Response Summary:', {
        ok: searchData.ok,
        total_found: searchData.total_found,
        results_count: searchData.results?.length || 0,
        search_method: searchData.search_method,
        search_params: searchData.search_params
      })
      
      if (!searchData.ok) {
        console.error('❌ API returned ok: false')
        console.error('❌ Error details:', searchData.error || 'No error message provided')
        throw new Error(searchData.error || 'Search failed')
      }

      const businesses = searchData.results || []
      
      console.log('✅ === FINAL SEARCH RESULTS ===')
      console.log('✅ Query processed:', enhanced_query)
      console.log('✅ Total found:', searchData.total_found)
      console.log('✅ Results returned:', businesses.length)
      console.log('✅ Search method:', searchData.search_method)
      console.log('✅ AI enhanced:', aiFiltersUsed)
      console.log('✅ Applied filters:', { category_filter, tag_filters })
      console.log('✅ Individual businesses:', businesses.map((b: Business) => ({
        name: b.business_name,
        category: b.business_category,
        distance: b.distance_km,
        score: b.vector_score
      })))
      console.log('✅ ===============================')

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
            return Math.abs(b.vector_score) - Math.abs(a.vector_score)
          case 'name':
            return a.business_name.localeCompare(b.business_name)
          default: // relevance
            return Math.abs(b.vector_score) - Math.abs(a.vector_score)
        }
      })

      setBusinesses(sortedBusinesses)

      // Fetch recent searches after successful search
      fetchRecentSearches()
    } catch (error) {
      console.error('❌ Search failed:', error)
      setErrorMessage('Search failed. Please try again.')
    }
  }

  // Initialize location and search on mount
  useEffect(() => {
    getCurrentLocation()
    
    // Handle search from URL params
    const queryFromUrl = searchParams.get('q')
    if (queryFromUrl) {
      setSearchQuery(queryFromUrl)
    }

    // Fetch recent searches on page load
    fetchRecentSearches()
  }, [])

  // Auto-search when location is available and we have a query from URL
  useEffect(() => {
    const queryFromUrl = searchParams.get('q')
    if (userLocation && queryFromUrl && !isLoading) {
      handleSearch(queryFromUrl)
    }
  }, [userLocation, searchParams])

  // Re-search when filters change (but only if we already have results)
  useEffect(() => {
    if (userLocation && searchQuery && businesses.length > 0 && !isLoading) {
      console.log('🔄 Filters changed, re-searching with:', filters)
      handleSearch()
    }
  }, [filters.category, filters.radius])

  // Business card component
  const BusinessCard = ({ business }: { business: Business }) => {
    const tags = business.business_tags ? business.business_tags.split(',').map(tag => tag.trim()) : []
    
    return (
      <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] bg-card/80 backdrop-blur-sm border-border">
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
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`
                  window.open(googleMapsUrl, '_blank')
                }}
              >
                <Navigation className="h-4 w-4 mr-1" />
                Get Directions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Resizable Navbar */}
      <Navbar className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
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
            { name: "How it Works", link: "/#how-it-works" },
            { name: "FAQ", link: "/#faq" }
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

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            <div className="flex flex-col space-y-4 p-4">
              <a href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </a>
              <a href="/#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                How it Works
              </a>
              <a href="/#faq" className="text-sm font-medium hover:text-primary transition-colors">
                FAQ
              </a>
              <div className="border-t border-border my-4"></div>
              <NavbarButton href="/business-register" variant="primary">
                Register Business
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      
      <div className="container mx-auto px-4 py-8 pt-20">{/* Added pt-20 for fixed navbar */}
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Find Local Businesses</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Discover amazing businesses near you with AI-powered search
            </p>
            
            {/* Location Status */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {isLoadingLocation ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Getting your location...</span>
                </>
              ) : userLocation ? (
                <>
                  <MapPin className="w-4 h-4 text-green-500 dark:text-green-400" />
                  <span className="text-sm text-green-600 dark:text-green-400">Location detected • Ready to search</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 text-red-500 dark:text-red-400" />
                  <span className="text-sm text-red-600 dark:text-red-400">Location required for search</span>
                </>
              )}
            </div>
          </div>

          {/* Search Section */}
          <div className="bg-card/80 backdrop-blur-sm rounded-lg shadow-lg border border-border p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 max-w-4xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search for restaurants, services, shops..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-12 h-14 text-lg w-full min-w-[500px]"
                    disabled={!userLocation}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSearch()} 
                  className="h-14 px-8 text-lg"
                  disabled={!userLocation || !searchQuery.trim() || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Search className="w-5 h-5 mr-2" />
                  )}
                  Search
                </Button>
                <Button variant="outline" size="icon" className="h-14 w-14">
                  <SlidersHorizontal className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quick Search Suggestions */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
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
                >
                  {suggestion}
                </Button>
              ))}
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Restaurant">Restaurants</SelectItem>
                    <SelectItem value="Cafe">Cafes</SelectItem>
                    <SelectItem value="Medical">Medical</SelectItem>
                    <SelectItem value="Service">Services</SelectItem>
                    <SelectItem value="Store">Stores</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Distance: {filters.radius}km</label>
                <Slider
                  value={[filters.radius]}
                  onValueChange={(value) => setFilters({...filters, radius: value[0]})}
                  max={10000}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <Select value={filters.sortBy} onValueChange={(value) => setFilters({...filters, sortBy: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={() => searchQuery && handleSearch()} 
                  variant="outline" 
                  className="w-full"
                  disabled={!searchQuery || isLoading}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded mb-6 dark:bg-red-950/50 dark:border-red-900/50 dark:text-red-400">
              {errorMessage}
            </div>
          )}

          {/* Results Section */}
          {(businesses.length > 0 || isLoading) && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Search Results</h2>
                  <p className="text-muted-foreground">
                    Found {totalResults} businesses
                    {filters.category !== 'all' && (
                      <span className="ml-2 text-primary">• Category: {filters.category}</span>
                    )}
                    <span className="ml-2">• Within {filters.radius}km</span>
                    {searchInfo?.aiEnhanced && (
                      <span className="ml-2 text-primary">• AI Enhanced • Vectorized Search</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {filters.category !== 'all' && (
                    <Badge variant="outline">
                      {filters.category}
                    </Badge>
                  )}
                  <Badge variant="outline">
                    {filters.radius}km radius
                  </Badge>
                  {searchInfo?.aiEnhanced && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      🤖 AI Enhanced Search
                    </Badge>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Searching for businesses...</p>
                  </div>
                </div>
              )}

              {/* Results Grid */}
              {!isLoading && businesses.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {businesses.map((business, index) => (
                    <BusinessCard key={business.source_path || index} business={business} />
                  ))}
                </div>
              )}

              {/* No Results */}
              {!isLoading && businesses.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <Globe className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No businesses found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or increasing the search radius.
                  </p>
                  <Button onClick={() => setFilters({...filters, radius: Math.min(filters.radius + 10, 10000)})}>
                    Expand Search Radius
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Welcome State */}
          {!businesses.length && !isLoading && !searchQuery && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Ready to search</h3>
              <p className="text-muted-foreground">
                Enter a search term above to find businesses near you.
              </p>
            </div>
          )}

          {/* Recent Searches Section - Always visible if we have data */}
          {recentSearches.length > 0 && (
            <div className="mt-8">
              <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-semibold">Recent Search Activity</h3>
                  </div>
                  {isLoadingRecentSearches && (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentSearches.map((search, index) => (
                    <Card key={search.timestamp || index} className="hover:shadow-md transition-all duration-200 bg-card/80 border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground truncate max-w-[150px]" title={search.searchQuery}>
                              {search.searchQuery}
                            </span>
                          </div>
                          {search.resultsCount !== undefined && (
                            <Badge variant="secondary" className="text-xs">
                              {search.resultsCount} results
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mb-3">
                          {new Date(search.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => {
                            setSearchQuery(search.searchQuery)
                            handleSearch(search.searchQuery)
                          }}
                        >
                          Search Again
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {recentSearches.length >= 10 && (
                  <div className="text-center mt-4">
                    <p className="text-xs text-muted-foreground">
                      Showing last 10 searches
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}