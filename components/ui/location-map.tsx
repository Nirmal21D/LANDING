"use client"

import { useEffect, useRef, useState } from 'react'
import { MapPin, Crosshair, Search } from 'lucide-react'

interface LocationMapProps {
  latitude: number | null
  longitude: number | null
  onLocationChange?: (lat: number, lng: number) => void
  onAddressChange?: (address: string) => void
  address?: string
  className?: string
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export default function LocationMap({ 
  latitude, 
  longitude, 
  onLocationChange, 
  onAddressChange,
  address = '',
  className = "" 
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [map, setMap] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)
  const [geocoder, setGeocoder] = useState<any>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchAddress, setSearchAddress] = useState(address)
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [autocompleteService, setAutocompleteService] = useState<any>(null)

  // Reverse geocode function to get address from coordinates
  const reverseGeocode = (lat: number, lng: number, geocoder: any) => {
    if (!geocoder) return

    const latLng = { lat, lng }
    geocoder.geocode({ location: latLng }, (results: any[], status: string) => {
      if (status === 'OK' && results[0]) {
        const address = results[0].formatted_address
        setSearchAddress(address)
        if (onAddressChange) {
          onAddressChange(address)
        }
      }
    })
  }

  // Forward geocode function to get coordinates from address
  const forwardGeocode = (address: string) => {
    if (!geocoder || !address.trim()) return

    setIsSearching(true)
    geocoder.geocode({ address }, (results: any[], status: string) => {
      setIsSearching(false)
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location
        const lat = location.lat()
        const lng = location.lng()
        
        if (onLocationChange) {
          onLocationChange(lat, lng)
        }
        
        // Update the map and marker
        if (map && marker) {
          map.setCenter(location)
          marker.setPosition(location)
        }
        
        const formattedAddress = results[0].formatted_address
        setSearchAddress(formattedAddress)
        if (onAddressChange) {
          onAddressChange(formattedAddress)
        }
      } else {
        alert('Address not found. Please try a different search term.')
      }
    })
  }

  // Handle search form submission
  const handleAddressSearch = (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault()
    }
    setShowSuggestions(false)
    forwardGeocode(searchAddress)
  }

  // Get autocomplete suggestions
  const getAutocompleteSuggestions = (input: string) => {
    if (!autocompleteService || !input.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const request = {
      input,
      types: ['establishment', 'geocode'],
      componentRestrictions: {} // You can restrict to specific countries if needed
    }

    autocompleteService.getPlacePredictions(request, (results: any[], status: string) => {
      if (status === 'OK' && results) {
        setSuggestions(results.slice(0, 5)) // Limit to 5 suggestions
        setShowSuggestions(true)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    })
  }

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: any) => {
    const placeId = suggestion.place_id
    const placesService = new window.google.maps.places.PlacesService(document.createElement('div'))
    
    placesService.getDetails(
      { placeId },
      (place: any, status: string) => {
        if (status === 'OK' && place.geometry) {
          const location = place.geometry.location
          const lat = location.lat()
          const lng = location.lng()
          
          if (onLocationChange) {
            onLocationChange(lat, lng)
          }
          
          // Update the map and marker
          if (map && marker) {
            map.setCenter(location)
            marker.setPosition(location)
          }
          
          const formattedAddress = place.formatted_address || suggestion.description
          setSearchAddress(formattedAddress)
          if (onAddressChange) {
            onAddressChange(formattedAddress)
          }
          
          setShowSuggestions(false)
        }
      }
    )
  }

  // Handle input change with debounced suggestions
  const handleInputChange = (value: string) => {
    setSearchAddress(value)
    
    // Debounce the autocomplete request
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      getAutocompleteSuggestions(value)
    }, 300)
  }

  // Update search address when address prop changes
  useEffect(() => {
    setSearchAddress(address)
  }, [address])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.suggestions-container')) {
        setShowSuggestions(false)
      }
    }

    if (showSuggestions) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showSuggestions])

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setIsMapLoaded(true)
        return
      }

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        console.error('Google Maps API key is not configured')
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        setIsMapLoaded(true)
      }
      script.onerror = () => {
        console.error('Failed to load Google Maps API')
      }
      document.head.appendChild(script)
    }

    loadGoogleMaps()
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Initialize map when API is loaded and coordinates are available
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !latitude || !longitude) return

    const mapOptions = {
      center: { lat: latitude, lng: longitude },
      zoom: 15,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        }
      ]
    }

    const newMap = new window.google.maps.Map(mapRef.current, mapOptions)
    setMap(newMap)

    // Initialize geocoder
    const newGeocoder = new window.google.maps.Geocoder()
    setGeocoder(newGeocoder)

    // Initialize autocomplete service
    const newAutocompleteService = new window.google.maps.places.AutocompleteService()
    setAutocompleteService(newAutocompleteService)

    // Create draggable marker
    const newMarker = new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: newMap,
      draggable: true,
      title: 'Drag to set business location',
      animation: window.google.maps.Animation.DROP,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#ef4444',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      }
    })

    setMarker(newMarker)

    // Add click listener to map
    newMap.addListener('click', (event: any) => {
      const newLat = event.latLng.lat()
      const newLng = event.latLng.lng()
      
      newMarker.setPosition(event.latLng)
      if (onLocationChange) {
        onLocationChange(newLat, newLng)
      }
      
      // Reverse geocode to get address
      reverseGeocode(newLat, newLng, newGeocoder)
    })

    // Add dragend listener to marker
    newMarker.addListener('dragend', (event: any) => {
      const newLat = event.latLng.lat()
      const newLng = event.latLng.lng()
      
      if (onLocationChange) {
        onLocationChange(newLat, newLng)
      }
      
      // Reverse geocode to get address
      reverseGeocode(newLat, newLng, newGeocoder)
    })

    // Cleanup function
    return () => {
      if (newMarker) {
        newMarker.setMap(null)
      }
    }
  }, [isMapLoaded, latitude, longitude])

  // Update marker position when coordinates change externally
  useEffect(() => {
    if (!marker || !latitude || !longitude) return

    const newPosition = { lat: latitude, lng: longitude }
    marker.setPosition(newPosition)
    
    if (map) {
      map.setCenter(newPosition)
    }
  }, [marker, map, latitude, longitude])

  // Get current location
  const getCurrentLocation = () => {
    setIsLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLat = position.coords.latitude
          const newLng = position.coords.longitude
          
          if (onLocationChange) {
            onLocationChange(newLat, newLng)
          }
          
          // Reverse geocode to get address
          reverseGeocode(newLat, newLng, geocoder)
          setIsLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          alert("Unable to get your location. Please click on the map to set location manually.")
          setIsLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      )
    } else {
      alert("Geolocation is not supported by this browser.")
      setIsLoading(false)
    }
  }

  if (!latitude || !longitude) {
    return (
      <div className={`bg-muted/30 border border-border rounded-lg p-6 flex flex-col items-center justify-center text-center ${className}`}>
        <MapPin className="w-8 h-8 text-muted-foreground mb-4" />
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Interactive Location Map</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Set coordinates or search for an address to see your business location on Google Maps
        </p>
        
        {/* Address Search Form */}
        <div className="w-full max-w-sm mb-4 relative suggestions-container">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Enter address or place name..."
                value={searchAddress}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddressSearch(e)
                  }
                  if (e.key === 'Escape') {
                    setShowSuggestions(false)
                  }
                }}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true)
                  }
                }}
                className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-[99999] mt-1 bg-background/95 backdrop-blur-sm border border-border rounded-md shadow-xl max-h-48 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion.place_id}
                      type="button"
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className="w-full px-3 py-2 text-left text-xs hover:bg-muted/70 focus:bg-muted/70 focus:outline-none border-b border-border/50 last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-foreground">{suggestion.structured_formatting?.main_text}</div>
                      <div className="text-muted-foreground text-xs">{suggestion.structured_formatting?.secondary_text}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleAddressSearch}
              disabled={isSearching || !searchAddress.trim()}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-xs hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              ) : (
                <Search className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md text-xs hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                Getting Location...
              </>
            ) : (
              <>
                <Crosshair className="w-3 h-3" />
                Get My Location
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative bg-card border border-border rounded-lg overflow-visible ${className}`}>
      {/* Address Search Bar */}
      <div className="bg-card/90 backdrop-blur-sm border-b border-border p-3 relative suggestions-container overflow-visible z-[100]">
        <div className="flex gap-2">
          <div className="flex-1 relative overflow-visible">
            <input
              type="text"
              placeholder="Search for address or place name..."
              value={searchAddress}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddressSearch(e)
                }
                if (e.key === 'Escape') {
                  setShowSuggestions(false)
                }
              }}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true)
                }
              }}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-[99999] mt-1 bg-background/95 backdrop-blur-sm border border-border rounded-md shadow-xl max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.place_id}
                    type="button"
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted/70 focus:bg-muted/70 focus:outline-none border-b border-border/50 last:border-b-0 transition-colors"
                  >
                    <div className="font-medium text-foreground">{suggestion.structured_formatting?.main_text}</div>
                    <div className="text-muted-foreground text-xs">{suggestion.structured_formatting?.secondary_text}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddressSearch}
            disabled={isSearching || !searchAddress.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search
              </>
            )}
          </button>
        </div>
      </div>

      {/* Map Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border p-3 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Interactive Business Location</span>
        <div className="ml-auto text-xs text-muted-foreground">
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </div>
      </div>
      
      {/* Map Container */}
      <div className="relative z-10">
        <div ref={mapRef} className="w-full h-[350px]" />
        
        {/* Loading overlay */}
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Loading Google Maps...
            </div>
          </div>
        )}
      </div>
      
      {/* Map Footer */}
      <div className="bg-card/80 backdrop-blur-sm border-t border-border p-2 text-center">
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>🖱️ Click map to set location</span>
          <span>🔄 Drag marker to adjust</span>
          <button
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs hover:bg-primary/20 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-primary"></div>
                Getting...
              </>
            ) : (
              <>
                <Crosshair className="w-3 h-3" />
                My Location
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}