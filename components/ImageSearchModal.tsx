"use client"

import React, { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Upload, Search, Loader2, Image as ImageIcon, X } from "lucide-react"

interface ImageSearchModalProps {
  onResults?: (data: any) => void
  onDescription?: (text: string) => void
  maxDistanceKm?: number
  limit?: number
  userLocation?: { lat: number; lng: number }
}

export default function ImageSearchModal({
  onResults,
  onDescription,
  maxDistanceKm = 10,
  limit = 20,
  userLocation = { lat: 0, lng: 0 }
}: ImageSearchModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile)
    setError("")
    setDescription("")
    setResults([])
  }, [])

  const removeImage = useCallback(() => {
    setFile(null)
    setPreviewUrl("")
    setDescription("")
    setError("")
    setResults([])
  }, [])

  const analyzeImage = useCallback(async () => {
    setError("")
    setDescription("")
    if (!file) {
      setError("Please select an image first.")
      return
    }
    
    setIsLoading(true)
    try {
      const form = new FormData()
      form.append("image", file)
      const resp = await fetch("/api/image-to-text", { method: "POST", body: form })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data?.error || "Failed to analyze image")
      const text = data?.description || ""
      setDescription(text)
      if (onDescription) {
        onDescription(text)
      }
    } catch (err: any) {
      setError(err?.message || "Image analysis failed")
    } finally {
      setIsLoading(false)
    }
  }, [file, onDescription])

  const runSearch = useCallback(async () => {
    setError("")
    const q = description.trim()
    if (!q) {
      setError("No description available to search. Please analyze an image first.")
      return
    }
    
    setIsLoading(true)
    try {
      const resp = await fetch("/api/search-businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_location: userLocation,
          query: q,
          max_distance_km: maxDistanceKm,
          tag_filters: [],
          limit,
        }),
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data?.error || "Search failed")
      setResults(Array.isArray(data?.results) ? data.results : [])
      if (onResults) {
        onResults(data)
      }
    } catch (err: any) {
      setError(err?.message || "Failed to search")
    } finally {
      setIsLoading(false)
    }
  }, [description, limit, maxDistanceKm, onResults, userLocation])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Camera className="w-5 h-5" />
            Upload Image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!file ? (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Drop your image here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports JPG, PNG, WebP up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0]
                    if (selectedFile) handleFileSelect(selectedFile)
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button asChild variant="outline">
                    <span className="cursor-pointer flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Choose File
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Upload preview"
                    className="max-w-full h-auto max-h-64 object-contain rounded-lg border mx-auto"
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 bg-muted rounded-lg border">
                    <ImageIcon className="w-16 h-16 text-muted-foreground/50" />
                  </div>
                )}
                <Button
                  onClick={removeImage}
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{file.name}</span>
                <span>{formatFileSize(file.size)}</span>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={analyzeImage} 
                  disabled={isLoading} 
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  {isLoading ? "Analyzing..." : "Analyze Image"}
                </Button>
                
                <Button 
                  onClick={runSearch} 
                  disabled={!description || isLoading} 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  {isLoading ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Description */}
      {(description || isLoading) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Image Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="AI-generated description will appear here..."
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              You can edit this description before searching
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {results.length > 0 && (
        <Alert>
          <Search className="w-4 h-4" />
          <AlertDescription>
            Found {results.length} businesses! Results will be displayed in the main search area.
          </AlertDescription>
        </Alert>
      )}

      {/* Instructions */}
      <div className="text-sm text-muted-foreground space-y-2">
        <p><strong>How to use:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Upload a photo of what you're looking for</li>
          <li>AI will analyze the image and generate a description</li>
          <li>Edit the description if needed</li>
          <li>Click "Search" to find related businesses</li>
        </ul>
        <p className="text-xs">
          <strong>Examples:</strong> Coffee cup → coffee shops, Pizza → restaurants, Car → auto services
        </p>
      </div>
    </div>
  )
}