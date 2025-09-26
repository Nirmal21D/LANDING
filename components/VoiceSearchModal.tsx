"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Search, Loader2, Volume2 } from "lucide-react"

interface VoiceSearchModalProps {
  onResults?: (data: any) => void
  onTranscript?: (text: string) => void
  maxDistanceKm?: number
  limit?: number
  userLocation?: { lat: number; lng: number }
}

export default function VoiceSearchModal({
  onResults,
  onTranscript,
  maxDistanceKm = 10,
  limit = 20,
  userLocation = { lat: 0, lng: 0 }
}: VoiceSearchModalProps) {
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [transcript, setTranscript] = useState("")
  const [results, setResults] = useState([])
  const [permissionStatus, setPermissionStatus] = useState<string>("unknown")
  const recognitionRef = useRef<any>(null)

  const SpeechRecognition = useMemo(() => {
    if (typeof window === "undefined") return null
    return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null
  }, [])

  // Check microphone permission on mount
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        if (navigator.permissions) {
          const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName })
          setPermissionStatus(permission.state)
          permission.addEventListener('change', () => {
            setPermissionStatus(permission.state)
          })
        }
      } catch (err) {
        console.warn('Could not check microphone permissions:', err)
      }
    }
    checkPermissions()
  }, [])

  const requestMicrophoneAccess = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop()) // Stop the stream, we just needed permission
      setPermissionStatus("granted")
      setError("")
      return true
    } catch (err: any) {
      console.error('Microphone access denied:', err)
      setError(`Microphone access denied: ${err.message}. Please allow microphone access in your browser.`)
      setPermissionStatus("denied")
      return false
    }
  }, [])

  const startListening = useCallback(async () => {
    setError("")
    setTranscript("")
    
    // Check if we're on HTTPS (required for speech recognition)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      setError("Voice search requires HTTPS. Please use a secure connection.")
      return
    }
    
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.")
      return
    }

    // Check and request microphone permission
    if (permissionStatus !== "granted") {
      const hasAccess = await requestMicrophoneAccess()
      if (!hasAccess) {
        return
      }
    }
    
    try {
      const recognition = new SpeechRecognition()
      recognition.lang = "en-US"
      recognition.interimResults = true
      recognition.continuous = false // Set to false for better reliability
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        console.log("Speech recognition started")
        setIsListening(true)
        setError("")
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
        setTranscript(combinedText)
        if (onTranscript) {
          onTranscript(combinedText)
        }
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
        
        setError(errorMessage)
        setIsListening(false)
      }

      recognition.onend = () => {
        console.log("Speech recognition ended")
        setIsListening(false)
      }

      recognition.start()
      recognitionRef.current = recognition
      
    } catch (err: any) {
      console.error("Failed to start speech recognition:", err)
      setError(`Failed to start voice recognition: ${err.message}`)
      setIsListening(false)
    }
  }, [SpeechRecognition, onTranscript, permissionStatus, requestMicrophoneAccess])

  const stopListening = useCallback(() => {
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

  const runSearch = useCallback(async (queryText: string) => {
    console.log("🔍 Voice Search - Starting search with query:", queryText)
    console.log("🌍 Voice Search - User location:", userLocation)
    console.log("📍 Voice Search - Max distance:", maxDistanceKm)
    
    setIsLoading(true)
    setError("")
    try {
      const requestBody = {
        user_location: userLocation,
        query: queryText,
        max_distance_km: maxDistanceKm,
        tag_filters: [],
        limit,
      }
      
      console.log("📤 Voice Search - Request body:", requestBody)
      
      const resp = await fetch("/api/search-businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })
      
      console.log("📥 Voice Search - Response status:", resp.status)
      
      const data = await resp.json()
      console.log("📊 Voice Search - Response data:", data)
      
      if (!resp.ok) throw new Error(data?.error || "Search failed")
      
      const results = Array.isArray(data?.results) ? data.results : []
      setResults(results)
      console.log("✅ Voice Search - Found", results.length, "results")
      
      if (onResults) {
        onResults(data)
      }
    } catch (err: any) {
      console.error("❌ Voice Search - Search error:", err)
      setError(err?.message || "Failed to search")
    } finally {
      setIsLoading(false)
    }
  }, [limit, maxDistanceKm, onResults, userLocation])

  const handleSubmit = useCallback(async () => {
    const q = transcript.trim()
    if (!q) {
      setError("Please speak your search query first.")
      return
    }
    await runSearch(q)
  }, [runSearch, transcript])

  return (
    <div className="space-y-6">
      {/* Voice Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Volume2 className="w-5 h-5" />
            Voice Input
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Permission Status */}
          {permissionStatus !== "granted" && (
            <Alert>
              <Mic className="w-4 h-4" />
              <AlertDescription>
                {permissionStatus === "denied" 
                  ? "Microphone access is required for voice search. Please allow microphone access in your browser settings."
                  : "Microphone permission needed for voice search."
                }
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            {!isListening ? (
              <Button 
                onClick={startListening} 
                className="flex items-center gap-2"
                variant="default"
                disabled={permissionStatus === "denied"}
              >
                <Mic className="w-4 h-4" />
                {permissionStatus === "granted" ? "Start Recording" : "Allow Microphone & Record"}
              </Button>
            ) : (
              <Button 
                onClick={stopListening} 
                variant="destructive"
                className="flex items-center gap-2"
              >
                <MicOff className="w-4 h-4" />
                Stop Recording
              </Button>
            )}
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || !transcript.trim()} 
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
            
            {/* Test button for debugging */}
            {process.env.NODE_ENV === 'development' && (
              <Button 
                onClick={() => {
                  const testQuery = "coffee shops near me"
                  setTranscript(testQuery)
                  if (onTranscript) onTranscript(testQuery)
                }} 
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                Test Voice
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Transcript</label>
            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={3}
              placeholder="Your speech will appear here... You can also type directly."
              className="resize-none"
            />
          </div>

          {isListening && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              🎤 Listening... Speak clearly now
            </div>
          )}
          
          {/* Status Info */}
          <div className="text-xs text-muted-foreground">
            <div>Browser: {SpeechRecognition ? "✅ Supported" : "❌ Not supported"}</div>
            <div>Microphone: {permissionStatus === "granted" ? "✅ Allowed" : permissionStatus === "denied" ? "❌ Denied" : "⏳ Checking..."}</div>
            <div>Connection: {location.protocol === 'https:' || location.hostname === 'localhost' ? "✅ Secure" : "❌ Requires HTTPS"}</div>
          </div>
        </CardContent>
      </Card>

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
          <li>Click "Start Recording" and speak clearly</li>
          <li>Say things like "coffee shops near me" or "Italian restaurants"</li>
          <li>You can edit the transcript before searching</li>
          <li>Click "Search" to find businesses matching your query</li>
        </ul>
        
        {error && (
          <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-950/20 rounded border">
            <p><strong>Troubleshooting:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
              <li>Ensure your microphone is connected and working</li>
              <li>Allow microphone access when prompted</li>
              <li>Try refreshing the page if issues persist</li>
              <li>Use Chrome, Edge, or Safari for best compatibility</li>
              {location.protocol !== 'https:' && location.hostname !== 'localhost' && (
                <li className="text-red-600 dark:text-red-400">Voice search requires HTTPS - try using localhost for development</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}