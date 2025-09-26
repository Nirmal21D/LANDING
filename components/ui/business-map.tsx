"use client"

import { useEffect, useRef, useState } from 'react'
import { MapPin, Star, Clock, Navigation, Building2 } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface BusinessMapProps {
  businessInfo: {
    name: string
    latitude: number
    longitude: number
    rating: number
    category: string
  }
  competitors: Array<{
    id: number
    name: string
    category: string
    distance: string
    rating: number
    latitude: number
    longitude: number
    status: string
    hours: string
  }>
  className?: string
}

declare global {
  interface Window {
    google: any
  }
}

export default function BusinessMap({ businessInfo, competitors, className = "" }: BusinessMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null)

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

  // Initialize map when API is loaded
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !businessInfo.latitude || !businessInfo.longitude) return

    const mapOptions = {
      center: { lat: businessInfo.latitude, lng: businessInfo.longitude },
      zoom: 15,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      streetViewControl: false,
      fullscreenControl: true,
      mapTypeControl: true,
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

    // Create info window
    const infoWindow = new window.google.maps.InfoWindow()

    // Add main business marker
    const mainBusinessMarker = new window.google.maps.Marker({
      position: { lat: businessInfo.latitude, lng: businessInfo.longitude },
      map: newMap,
      title: businessInfo.name,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#ef4444',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      },
      zIndex: 1000
    })

    // Add main business info window
    mainBusinessMarker.addListener('click', () => {
      infoWindow.setContent(`
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #1f2937; font-weight: bold;">${businessInfo.name}</h3>
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
            <span style="color: #fbbf24;">★</span>
            <span style="color: #6b7280; font-size: 14px;">${businessInfo.rating} • ${businessInfo.category}</span>
          </div>
          <div style="background: #ef4444; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; display: inline-block;">
            YOUR BUSINESS
          </div>
        </div>
      `)
      infoWindow.open(newMap, mainBusinessMarker)
    })

    // Add competitor markers
    competitors.forEach((competitor) => {
      const competitorMarker = new window.google.maps.Marker({
        position: { lat: competitor.latitude, lng: competitor.longitude },
        map: newMap,
        title: competitor.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: competitor.status === 'competitor' ? '#f59e0b' : '#6b7280',
          fillOpacity: 0.8,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        }
      })

      // Add competitor info window
      competitorMarker.addListener('click', () => {
        infoWindow.setContent(`
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-weight: bold;">${competitor.name}</h3>
            <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
              <span style="color: #fbbf24;">★</span>
              <span style="color: #6b7280; font-size: 14px;">${competitor.rating} • ${competitor.category}</span>
            </div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 4px;">
              📍 ${competitor.distance} away
            </div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 8px;">
              🕒 ${competitor.hours}
            </div>
            <div style="background: ${competitor.status === 'competitor' ? '#f59e0b' : '#6b7280'}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; display: inline-block;">
              ${competitor.status === 'competitor' ? 'COMPETITOR' : 'RELATED BUSINESS'}
            </div>
          </div>
        `)
        infoWindow.open(newMap, competitorMarker)
        setSelectedBusiness(competitor)
      })
    })

  }, [isMapLoaded, businessInfo, competitors])

  return (
    <div className={`relative bg-card border border-border rounded-lg overflow-hidden ${className}`}>
      {/* Map Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-lg font-semibold">Business Location & Competitors</h3>
            <p className="text-sm text-muted-foreground">Your business and nearby competition</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-muted-foreground">Your Business</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-xs text-muted-foreground">Competitors</span>
          </div>
        </div>
      </div>
      
      {/* Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        <div className="lg:col-span-2 relative">
          <div ref={mapRef} className="w-full h-[400px]" />
          
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

        {/* Competitors List */}
        <div className="border-l border-border bg-muted/20 overflow-y-auto max-h-[400px]">
          <div className="p-4">
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Nearby Businesses ({competitors.length})
            </h4>
            <div className="space-y-3">
              {competitors.map((competitor) => (
                <div 
                  key={competitor.id} 
                  className={`p-3 bg-background rounded-lg border border-border/50 cursor-pointer transition-all hover:shadow-sm ${
                    selectedBusiness?.id === competitor.id ? 'ring-2 ring-primary/20 bg-primary/5' : ''
                  }`}
                  onClick={() => {
                    if (map) {
                      map.setCenter({ lat: competitor.latitude, lng: competitor.longitude })
                      map.setZoom(17)
                    }
                    setSelectedBusiness(competitor)
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-sm">{competitor.name}</h5>
                    <Badge 
                      variant={competitor.status === 'competitor' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {competitor.status === 'competitor' ? 'Competitor' : 'Related'}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{competitor.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        <span>{competitor.distance}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{competitor.category}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{competitor.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map Footer */}
      <div className="bg-card/80 backdrop-blur-sm border-t border-border p-3 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>🔴 Red marker: Your business location</span>
          <span>🟡 Yellow markers: Direct competitors</span>
          <span>⚫ Gray markers: Related businesses</span>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Navigation className="w-4 h-4" />
          Get Directions
        </Button>
      </div>
    </div>
  )
}