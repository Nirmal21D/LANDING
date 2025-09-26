"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { MapPin, Search, Navigation, Clock, Star, Globe, Filter, ChevronDown, Loader2, SlidersHorizontal, Triangle, Mic, Camera, MicOff, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
import ImageSearchModal from "@/components/ImageSearchModal"

interface Business {
  // Database fields (new structure)
  _id?: string
  businessOwnerName?: string
  businessName?: string
  businessDescription?: string
  email?: string
  phone?: string
  address?: string
  location?: {
    latitude: number
    longitude: number
  }
  businessCategory?: string
  businessType?: string
  businessTags?: string[]
  businessHours?: any
  website?: string
  socialHandles?: any
  ownerId?: string
  status?: string
  verificationDate?: string | null
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  
  // Legacy API fields (old structure) - for backward compatibility
  name?: string                    // Owner/Contact name from API
  business_name?: string          // Actual business name from API  
  latitude?: number               // GPS coordinates from API
  longitude?: number              // GPS coordinates from API
  lat_long?: string              // Formatted coordinates from API
  business_category?: string     // Category classification from API
  business_tags?: string         // Comma-separated tags from API
  vector_score?: number          // AI similarity score from API (negative value)
  source_path?: string           // Data source path from API
  distance_km?: number           // Calculated distance from user location
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

// Temporary business data for fallback when API fails or no results
const TEMP_BUSINESS_DATA: Business[] = [
  {
    name: "John Smith",
    business_name: "Blue Moon Coffee",
    latitude: 40.7589,
    longitude: -73.9851,
    lat_long: "40.7589, -73.9851",
    business_category: "Coffee Shop",
    business_tags: "coffee, wifi, breakfast, organic",
    vector_score: -0.85,
    source_path: "temp_data_1",
    distance_km: 0.2
  },
  {
    name: "Maria Rodriguez",
    business_name: "Bella Vista Restaurant",
    latitude: 40.7614,
    longitude: -73.9776,
    lat_long: "40.7614, -73.9776",
    business_category: "Restaurant",
    business_tags: "italian, pizza, pasta, family-friendly",
    vector_score: -0.82,
    source_path: "temp_data_2",
    distance_km: 0.5
  },
  {
    name: "Ahmed Hassan",
    business_name: "Quick Fix Auto Repair",
    latitude: 40.7505,
    longitude: -73.9934,
    lat_long: "40.7505, -73.9934",
    business_category: "Automotive",
    business_tags: "car repair, oil change, tires, mechanic",
    vector_score: -0.78,
    source_path: "temp_data_3",
    distance_km: 0.8
  },
  {
    name: "Dr. Sarah Johnson",
    business_name: "Downtown Medical Clinic",
    latitude: 40.7648,
    longitude: -73.9808,
    lat_long: "40.7648, -73.9808",
    business_category: "Healthcare",
    business_tags: "medical, doctor, clinic, health",
    vector_score: -0.75,
    source_path: "temp_data_4",
    distance_km: 0.3
  },
  {
    name: "Mike Chen",
    business_name: "Tech Solutions Store",
    latitude: 40.7580,
    longitude: -73.9855,
    lat_long: "40.7580, -73.9855",
    business_category: "Electronics",
    business_tags: "electronics, phones, computers, repair",
    vector_score: -0.73,
    source_path: "temp_data_5",
    distance_km: 0.4
  },
  {
    name: "Lisa Thompson",
    business_name: "Fresh Market Grocery",
    latitude: 40.7610,
    longitude: -73.9897,
    lat_long: "40.7610, -73.9897",
    business_category: "Grocery",
    business_tags: "grocery, fresh, organic, vegetables",
    vector_score: -0.70,
    source_path: "temp_data_6",
    distance_km: 0.6
  },
  {
    name: "Carlos Mendez",
    business_name: "Fitness First Gym",
    latitude: 40.7555,
    longitude: -73.9889,
    lat_long: "40.7555, -73.9889",
    business_category: "Fitness",
    business_tags: "gym, fitness, workout, personal trainer",
    vector_score: -0.68,
    source_path: "temp_data_7",
    distance_km: 0.7
  },
  {
    name: "Anna Wilson",
    business_name: "Bookworm's Paradise",
    latitude: 40.7622,
    longitude: -73.9792,
    lat_long: "40.7622, -73.9792",
    business_category: "Bookstore",
    business_tags: "books, reading, literature, cafe",
    vector_score: -0.65,
    source_path: "temp_data_8",
    distance_km: 0.4
  },
  {
    name: "David Park",
    business_name: "Park's Barbershop",
    latitude: 40.7598,
    longitude: -73.9823,
    lat_long: "40.7598, -73.9823",
    business_category: "Beauty & Personal Care",
    business_tags: "haircut, barber, grooming, men",
    vector_score: -0.62,
    source_path: "temp_data_9",
    distance_km: 0.3
  },
  {
    name: "Jenny Kim",
    business_name: "Sunrise Bakery",
    latitude: 40.7567,
    longitude: -73.9912,
    lat_long: "40.7567, -73.9912",
    business_category: "Bakery",
    business_tags: "bakery, bread, pastries, cakes",
    vector_score: -0.60,
    source_path: "temp_data_10",
    distance_km: 0.5
  }
]

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
  const [showImageSearch, setShowImageSearch] = useState(false)
  
  // Voice search states
  const [isListening, setIsListening] = useState(false)
  const [voiceError, setVoiceError] = useState("")
  const recognitionRef = useRef<any>(null)
  
  // Business detail modal states
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false)
  
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

  // Fetch all businesses without specific search query
  const fetchAllBusinesses = async (): Promise<{ businesses: Business[], error?: string }> => {
    if (!userLocation) return { businesses: [], error: 'Location required for search' }
    
    try {
      setIsLoading(true)
      setErrorMessage('')
      
      console.log('🔍 === FETCHING ALL BUSINESSES ===')
      
      // Call the search API with a generic query to get all businesses
      const requestBody = {
        query: "*", // Use wildcard or empty query to get all
        user_location: userLocation,
        max_distance_km: filters.radius || 50, // Larger radius for "show all"
        category_filter: filters.category !== 'all' ? filters.category : undefined,
        tag_filters: [],
        limit: 100 // Higher limit to show more businesses
      }
      
      console.log('📤 Request Body for All Businesses:', JSON.stringify(requestBody, null, 2))
      
      const searchResponse = await fetch('/api/search-businesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!searchResponse.ok) {
        const errorText = await searchResponse.text()
        console.error('❌ All businesses API error:', errorText)
        throw new Error(`Failed to fetch all businesses: ${searchResponse.status} ${searchResponse.statusText}`)
      }

      const searchData = await searchResponse.json()
      console.log('📥 All Businesses Response:', searchData)
      
      if (!searchData.ok) {
        throw new Error(searchData.error || 'Failed to fetch all businesses')
      }

      const businesses = searchData.results || []
      console.log('✅ Found', businesses.length, 'businesses in total')

      return {
        businesses,
      }
    } catch (error) {
      console.error('🚨 Fetch all businesses failed:', error)
      return { 
        businesses: [], 
        error: error instanceof Error ? error.message : 'Failed to fetch all businesses' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle showing all businesses
  const handleShowAllBusinesses = async () => {
    if (!userLocation) {
      alert("Please enable location access to view nearby businesses.")
      return
    }

    try {
      setIsLoading(true)
      setErrorMessage('')
      
      console.log('📋 Showing all businesses from temporary data...')
      
      // Get all temp businesses with current filters applied
      const currentCategoryFilter = filters.category !== 'all' ? filters.category : undefined
      const tempBusinesses = getFilteredTempData('', currentCategoryFilter)
      
      setBusinesses(tempBusinesses)
      setTotalResults(tempBusinesses.length)
      setSearchQuery('') // Clear search query
      setSearchInfo({
        searchMethod: 'show_all_temp',
        totalFound: tempBusinesses.length,
        aiEnhanced: false
      })

      // Sort businesses based on selected sort option
      const sortedBusinesses = [...tempBusinesses].sort((a, b) => {
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
      console.log(`✅ Displayed ${sortedBusinesses.length} businesses from temporary data`)
    } catch (error) {
      console.error('❌ Failed to show all businesses:', error)
      setErrorMessage('Failed to load businesses. Please try again.')
    } finally {
      setIsLoading(false)
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
      console.log('🔄 Using temporary fallback data...')
      
      // Use temporary data as fallback
      const currentCategoryFilter = filters.category !== 'all' ? filters.category : undefined
      const tempBusinesses = getFilteredTempData(query, currentCategoryFilter)
      
      return { 
        businesses: tempBusinesses, 
        filterInfo: {
          aiEnhanced: false,
          searchMethod: 'temporary_data',
          totalFound: tempBusinesses.length,
          filters: { category_filter: currentCategoryFilter, tag_filters: [] },
          searchParams: {
            user_location: userLocation,
            max_distance_km: filters.radius,
            query: query
          }
        },
        error: tempBusinesses.length > 0 ? undefined : (error instanceof Error ? error.message : 'Search failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to filter temporary data based on query and category
  const getFilteredTempData = (query: string, category?: string): Business[] => {
    let filteredData = [...TEMP_BUSINESS_DATA]
    
    // Filter by category if specified
    if (category && category !== 'all') {
      filteredData = filteredData.filter(business => 
        business.business_category.toLowerCase().includes(category.toLowerCase())
      )
    }
    
    // Filter by query if provided
    if (query.trim()) {
      const searchTerms = query.toLowerCase().split(' ')
      filteredData = filteredData.filter(business => {
        const searchableText = `${business.business_name} ${business.business_category} ${business.business_tags}`.toLowerCase()
        return searchTerms.some(term => searchableText.includes(term))
      })
    }
    
    // Calculate distances based on user location
    if (userLocation) {
      filteredData = filteredData.map(business => ({
        ...business,
        distance_km: Math.round(Math.random() * 2 * 100) / 100 + 0.1 // Random distance between 0.1-2.1 km
      }))
    }
    
    // Sort by relevance score
    filteredData.sort((a, b) => Math.abs(b.vector_score) - Math.abs(a.vector_score))
    
    return filteredData.slice(0, 20) // Limit to 20 results
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

  // Handle image search results
  const handleImageSearchResults = (data: any) => {
    console.log('📸 Image search results:', data)
    if (data.results && data.results.length > 0) {
      setBusinesses(data.results)
      setTotalResults(data.results.length)
      setSearchInfo({
        searchMethod: 'image',
        totalFound: data.total_found || data.results.length
      })
      setShowImageSearch(false)
    }
  }

  // Voice search functionality
  const SpeechRecognition = useMemo(() => {
    if (typeof window === "undefined") return null
    return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null
  }, [])

  const startVoiceSearch = useCallback(async () => {
    setVoiceError("")
    
    // Check if we're on HTTPS (required for speech recognition)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      setVoiceError("Voice search requires HTTPS. Please use a secure connection.")
      return
    }
    
    if (!SpeechRecognition) {
      setVoiceError("Voice search is not supported in this browser. Please try Chrome, Edge, or Safari.")
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.lang = "en-US"
      recognition.interimResults = true
      recognition.continuous = false
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        console.log("Speech recognition started")
        setIsListening(true)
        setVoiceError("")
      }

      recognition.onresult = (event: any) => {
        console.log("Speech recognition result:", event)
        let interimTranscript = ""
        let finalTranscript = ""
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }
        
        const combinedText = (finalTranscript + interimTranscript).trim()
        setSearchQuery(combinedText)
      }

      recognition.onerror = (e: any) => {
        console.error("Speech recognition error:", e)
        let errorMessage = "Speech recognition error"
        
        switch (e.error) {
          case 'no-speech':
            errorMessage = "No speech detected. Please try again."
            break
          case 'audio-capture':
            errorMessage = "No microphone found. Please check your microphone."
            break
          case 'not-allowed':
            errorMessage = "Microphone access denied. Please allow microphone access."
            break
          case 'network':
            errorMessage = "Network error occurred. Please check your internet connection."
            break
          case 'service-not-allowed':
            errorMessage = "Speech service not allowed. Please try again."
            break
          default:
            errorMessage = `Speech recognition error: ${e.error}`
        }
        
        setVoiceError(errorMessage)
        setIsListening(false)
      }

      recognition.onend = () => {
        console.log("Speech recognition ended")
        setIsListening(false)
        // Auto-search if we have text
        const query = searchQuery.trim()
        if (query) {
          setTimeout(() => handleSearch(query), 500) // Small delay to ensure state is updated
        }
      }

      recognition.start()
      recognitionRef.current = recognition
      
    } catch (err: any) {
      console.error("Failed to start speech recognition:", err)
      setVoiceError(`Failed to start voice recognition: ${err.message}`)
      setIsListening(false)
    }
  }, [SpeechRecognition, searchQuery, handleSearch])

  const stopVoiceSearch = useCallback(() => {
    const r = recognitionRef.current
    if (r) {
      try { 
        r.stop() 
      } catch (e) {
        console.warn("Error stopping recognition:", e)
      }
    }
    setIsListening(false)
  }, [])

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
    // Handle tags - they can be an array or comma-separated string
    const tags = Array.isArray(business.businessTags) 
      ? business.businessTags 
      : (business.business_tags ? business.business_tags.split(',').map((tag: string) => tag.trim()) : [])

    // Get business name and owner name from the correct fields
    const businessName = business.businessName || business.business_name || 'Unknown Business'
    const ownerName = business.businessOwnerName || business.name || 'Owner'
    const category = business.businessCategory || business.business_category || 'Business'
    const description = business.businessDescription
    const latitude = business.location?.latitude || business.latitude
    const longitude = business.location?.longitude || business.longitude

    const handleCardClick = () => {
      setSelectedBusiness(business)
      setIsBusinessModalOpen(true)
    }
    
    return (
      <Card 
        className="h-64 w-96 flex flex-col bg-card border-border rounded-lg hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3 flex-none">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate">
                {businessName}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground truncate">by {ownerName}</span>
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  {category}
                </Badge>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">
                  {business.vector_score ? Math.abs(business.vector_score * 100).toFixed(1) : '95.0'}%
                </span>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500" title="Available"></div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 flex-1 flex flex-col justify-between">
          <div className="space-y-3 flex-1">
            {/* Description */}
            {description && (
              <div className="text-sm text-muted-foreground truncate">
                {description}
              </div>
            )}
            
            {/* Location */}
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span className="truncate text-muted-foreground">
                {business.address || business.lat_long || `${latitude?.toFixed(4)}, ${longitude?.toFixed(4)}`}
              </span>
              {business.distance_km !== undefined && (
                <span className="text-primary font-medium flex-shrink-0">
                  • {business.distance_km === 0 ? 'Here' : `${business.distance_km.toFixed(1)}km`}
                </span>
              )}
            </div>
            
            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 3).map((tag: string, index: number) => (
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

            {/* Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${business.isActive !== false ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-xs font-medium ${business.isActive !== false ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {business.isActive !== false ? 'Active' : 'Inactive'}
              </span>
              {business.status === 'pending' && (
                <span className="text-xs text-yellow-600 dark:text-yellow-400">• Pending</span>
              )}
            </div>
          </div>
            
          <div className="flex gap-2 pt-3 mt-auto">
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={() => {
                const lat = latitude
                const lng = longitude
                if (lat && lng) {
                  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
                  window.open(googleMapsUrl, '_blank')
                }
              }}
            >
              <Navigation className="h-4 w-4 mr-1" />
              Directions
            </Button>
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
                    placeholder="Search for restaurants, services, shops... or click the mic to speak"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-12 pr-16 h-14 text-lg w-full min-w-[500px]"
                    disabled={!userLocation}
                  />
                  
                  {/* Voice Search Button in Input */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {!isListening ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={startVoiceSearch}
                        disabled={!userLocation}
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                        title="Voice Search"
                      >
                        <Mic className="w-4 h-4 text-muted-foreground hover:text-primary" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={stopVoiceSearch}
                        className="h-8 w-8 p-0 hover:bg-destructive/10"
                        title="Stop Recording"
                      >
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <MicOff className="w-3 h-3 text-red-500" />
                        </div>
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Voice Error Display */}
                {voiceError && (
                  <div className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {voiceError}
                  </div>
                )}
                
                {/* Listening Indicator */}
                {isListening && (
                  <div className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    🎤 Listening... speak your search query now
                  </div>
                )}
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

                {/* Show All Businesses Button */}
                <Button 
                  onClick={() => handleShowAllBusinesses()} 
                  variant="outline"
                  className="h-14 px-6 text-lg"
                  disabled={!userLocation || isLoading}
                  title="Browse all nearby businesses"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Globe className="w-5 h-5 mr-2" />
                  )}
                  Show All
                </Button>
                
                {/* Image Search Button */}
                <Dialog open={showImageSearch} onOpenChange={setShowImageSearch}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="h-14 w-14" title="Image Search">
                      <Camera className="w-5 h-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Camera className="w-5 h-5" />
                        Image Search
                      </DialogTitle>
                    </DialogHeader>
                    <ImageSearchModal
                      onResults={handleImageSearchResults}
                      onDescription={(text) => setSearchQuery(text)}
                      maxDistanceKm={filters.radius}
                      userLocation={userLocation || undefined}
                    />
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="icon" className="h-14 w-14">
                  <SlidersHorizontal className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quick Search Suggestions */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>Search by typing, voice, image, or browse all businesses</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShowAllBusinesses()}
                    disabled={!userLocation || isLoading}
                    className="text-xs"
                  >
                    <Globe className="w-3 h-3 mr-1" />
                    Show All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowImageSearch(true)}
                    className="text-xs"
                  >
                    <Camera className="w-3 h-3 mr-1" />
                    Image
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
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
                    {searchInfo?.searchMethod === 'voice' && (
                      <span className="ml-2 text-purple-600 dark:text-purple-400">• 🎤 Voice Search</span>
                    )}
                    {searchInfo?.searchMethod === 'image' && (
                      <span className="ml-2 text-blue-600 dark:text-blue-400">• 📸 Image Search</span>
                    )}
                    {searchInfo?.searchMethod === 'browse_all' && (
                      <span className="ml-2 text-green-600 dark:text-green-400">• 🌐 Browsing All Businesses</span>
                    )}
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
                  {searchInfo?.searchMethod === 'voice' && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                      🎤 Voice Search
                    </Badge>
                  )}
                  {searchInfo?.searchMethod === 'image' && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                      📸 Image Search
                    </Badge>
                  )}
                  {searchInfo?.searchMethod === 'browse_all' && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                      🌐 Browse All
                    </Badge>
                  )}
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
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                {businesses.map((business, index) => (
                  <BusinessCard key={business.source_path || business._id || index} business={business} />
                ))}
              </div>
            </div>
          )}              {/* No Results */}
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
              <p className="text-muted-foreground mb-4">
                Find businesses by typing, speaking, or uploading an image.
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                <Button
                  variant="outline"
                  onClick={startVoiceSearch}
                  disabled={!userLocation || isListening}
                  className="flex items-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  {isListening ? 'Listening...' : 'Start Voice Search'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowImageSearch(true)}
                  className="flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Try Image Search
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleShowAllBusinesses()}
                  disabled={!userLocation || isLoading}
                  className="flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Browse All Businesses
                </Button>
              </div>
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

      {/* Business Details Modal */}
      {selectedBusiness && isBusinessModalOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="fixed inset-0 bg-black/60" 
            onClick={() => setIsBusinessModalOpen(false)}
          />
          <div className="fixed left-0 top-0 h-screen w-[400px] bg-card border-r border-border shadow-2xl overflow-y-auto">
            {/* Business Image */}
            <div className="relative h-48 bg-muted">
              <img
                src="/placeholder.jpg"
                alt={selectedBusiness.businessName || selectedBusiness.business_name || "Business"}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setIsBusinessModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center shadow-md hover:bg-accent transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Business Info */}
            <div className="p-4 space-y-4">
              {/* Business Name and Rating */}
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {selectedBusiness.businessName || selectedBusiness.business_name || 'Business Details'}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-1 text-sm text-muted-foreground">(4.7)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-muted-foreground">
                    {selectedBusiness.businessCategory || selectedBusiness.business_category || 'Business'}
                  </p>
                  <span className="text-muted-foreground">•</span>
                  <p className="text-sm text-muted-foreground">
                    {selectedBusiness.businessType || 'Business'}
                  </p>
                </div>
                {selectedBusiness.businessDescription && (
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    "{selectedBusiness.businessDescription}"
                  </p>
                )}
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-green-400 font-medium">
                    {selectedBusiness.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {selectedBusiness.status && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {selectedBusiness.status}
                    </Badge>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-4 gap-2">
                <button 
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-accent/10 transition-colors"
                  onClick={() => {
                    const lat = selectedBusiness.location?.latitude || selectedBusiness.latitude
                    const lng = selectedBusiness.location?.longitude || selectedBusiness.longitude
                    if (lat && lng) {
                      window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank')
                    }
                  }}
                >
                  <Navigation className="w-5 h-5 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">Directions</span>
                </button>
                <button className="flex flex-col items-center p-3 rounded-lg hover:bg-accent/10 transition-colors">
                  <span className="w-5 h-5 text-primary mb-1 text-lg">📋</span>
                  <span className="text-xs text-muted-foreground">Save</span>
                </button>
                <button className="flex flex-col items-center p-3 rounded-lg hover:bg-accent/10 transition-colors">
                  <MapPin className="w-5 h-5 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">Nearby</span>
                </button>
                <button className="flex flex-col items-center p-3 rounded-lg hover:bg-accent/10 transition-colors">
                  <span className="w-5 h-5 text-primary mb-1 text-lg">📞</span>
                  <span className="text-xs text-muted-foreground">Call</span>
                </button>
              </div>

              {/* Business Owner */}
              <div className="flex items-start gap-3 py-3 border-t border-border">
                <span className="w-5 h-5 text-muted-foreground flex-shrink-0 text-lg">👤</span>
                <div>
                  <p className="text-sm text-foreground font-medium">Business Owner</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedBusiness.businessOwnerName || selectedBusiness.name || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3 py-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-foreground font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedBusiness.address || 'Address not available'}
                  </p>
                  {(selectedBusiness.location?.latitude && selectedBusiness.location?.longitude) && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedBusiness.location.latitude.toFixed(6)}, {selectedBusiness.location.longitude.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-3 py-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-foreground font-medium">Business Hours</p>
                  {selectedBusiness.businessHours ? (
                    <div className="space-y-1 mt-1">
                      {Object.entries(selectedBusiness.businessHours).map(([day, hours]: [string, any]) => (
                        <div key={day} className="flex justify-between text-xs">
                          <span className="text-muted-foreground capitalize">{day}</span>
                          <span className="text-muted-foreground">
                            {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-green-400 font-medium">Open 24 hours</p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              {(selectedBusiness.phone || selectedBusiness.email) && (
                <div className="space-y-3">
                  {selectedBusiness.phone && (
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 text-muted-foreground flex-shrink-0 text-lg">📞</span>
                      <div>
                        <p className="text-sm text-foreground font-medium">Phone</p>
                        <p className="text-sm text-primary font-medium">{selectedBusiness.phone}</p>
                      </div>
                    </div>
                  )}

                  {selectedBusiness.email && (
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 text-muted-foreground flex-shrink-0 text-lg">�</span>
                      <div>
                        <p className="text-sm text-foreground font-medium">Email</p>
                        <p className="text-sm text-primary font-medium">{selectedBusiness.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Website */}
              {selectedBusiness.website && (
                <div className="flex items-center gap-3 py-3">
                  <Globe className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm text-foreground font-medium">Website</p>
                    <a 
                      href={selectedBusiness.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary font-medium hover:underline"
                    >
                      {selectedBusiness.website}
                    </a>
                  </div>
                </div>
              )}

              {/* Social Media */}
              {selectedBusiness.socialHandles && Object.values(selectedBusiness.socialHandles).some((handle: any) => handle) && (
                <div className="flex items-start gap-3 py-3">
                  <span className="w-5 h-5 text-muted-foreground flex-shrink-0 text-lg">📱</span>
                  <div>
                    <p className="text-sm text-foreground font-medium">Social Media</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedBusiness.socialHandles.facebook && (
                        <a href={selectedBusiness.socialHandles.facebook} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Facebook</a>
                      )}
                      {selectedBusiness.socialHandles.instagram && (
                        <a href={selectedBusiness.socialHandles.instagram} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Instagram</a>
                      )}
                      {selectedBusiness.socialHandles.twitter && (
                        <a href={selectedBusiness.socialHandles.twitter} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Twitter</a>
                      )}
                      {selectedBusiness.socialHandles.linkedin && (
                        <a href={selectedBusiness.socialHandles.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">LinkedIn</a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}
              {(selectedBusiness.businessTags || selectedBusiness.business_tags) && (
                <div className="flex items-start gap-3 py-3">
                  <span className="w-5 h-5 text-muted-foreground flex-shrink-0 text-lg">🏷️</span>
                  <div>
                    <p className="text-sm text-foreground font-medium">Tags</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(Array.isArray(selectedBusiness.businessTags) 
                        ? selectedBusiness.businessTags 
                        : (selectedBusiness.business_tags ? selectedBusiness.business_tags.split(',').map((tag: string) => tag.trim()) : [])
                      ).map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Business Details */}
              <div className="flex items-start gap-3 py-3 border-t border-border">
                <span className="w-5 h-5 text-muted-foreground flex-shrink-0 text-lg">ℹ️</span>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Created: {selectedBusiness.createdAt ? new Date(selectedBusiness.createdAt).toLocaleDateString() : 'N/A'}</p>
                  <p>Last Updated: {selectedBusiness.updatedAt ? new Date(selectedBusiness.updatedAt).toLocaleDateString() : 'N/A'}</p>
                  {selectedBusiness._id && <p>ID: {selectedBusiness._id}</p>}
                </div>
              </div>

              {/* Suggest Edit Button */}
              <div className="pt-4">
                <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary/10">
                  <span className="mr-2">✏️</span>
                  Suggest an edit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}