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
      <div className="bg-card/80 backdrop-blur-sm border-b border-border p-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Business Location</h3>
      </div>
      {/* Map Only */}
      <div className="relative">
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
      {/* Map Footer (Legend) */}
      <div className="bg-card/80 backdrop-blur-sm border-t border-border p-3 flex items-center gap-4 text-xs text-muted-foreground justify-center">
        <span>🔴 Red marker: Your business location</span>
      </div>
    </div>
  )
}