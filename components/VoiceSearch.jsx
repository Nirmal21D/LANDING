"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

// Reusable, self-contained Voice Search component using Web Speech API
// - Captures speech → transcribes to text → calls /api/search-businesses
// - Manages its own UI state (listening, loading, error)
// - Attempts geolocation; falls back to { lat: 0, lng: 0 }

export default function VoiceSearch({
  buttonLabel = "Start Voice Search",
  stopLabel = "Stop",
  searchingLabel = "Searching...",
  onResults,
  maxDistanceKm = 10000,
  limit = 20,
}) {
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [transcript, setTranscript] = useState("")
  const [results, setResults] = useState([])
  const recognitionRef = useRef(null)
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 })

  // Try to get geolocation once
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!navigator?.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      },
      () => {
        // Silent fallback to default {0,0}
      },
      { enableHighAccuracy: true, timeout: 5000 }
    )
  }, [])

  const SpeechRecognition = useMemo(() => {
    if (typeof window === "undefined") return null
    return window.SpeechRecognition || window.webkitSpeechRecognition || null
  }, [])

  const startListening = useCallback(() => {
    setError("")
    setTranscript("")
    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser.")
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.interimResults = true
    recognition.continuous = true

    recognition.onresult = (event) => {
      let text = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript
      }
      setTranscript(text.trim())
    }

    recognition.onerror = (e) => {
      setError(e?.error || "Speech recognition error")
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
    recognitionRef.current = recognition
    setIsListening(true)
  }, [SpeechRecognition])

  const stopListening = useCallback(() => {
    const r = recognitionRef.current
    if (r) {
      try { r.stop() } catch {}
    }
    setIsListening(false)
  }, [])

  const runSearch = useCallback(async (queryText) => {
    setIsLoading(true)
    setError("")
    try {
      const resp = await fetch("/api/search-businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_location: userLocation,
          query: queryText,
          max_distance_km: maxDistanceKm,
          tag_filters: [],
          limit,
        }),
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data?.error || "Search failed")
      setResults(Array.isArray(data?.results) ? data.results : [])
      if (typeof onResults === "function") onResults(data)
    } catch (err) {
      setError(err?.message || "Failed to search")
    } finally {
      setIsLoading(false)
    }
  }, [limit, maxDistanceKm, onResults, userLocation])

  const handleSubmit = useCallback(async () => {
    const q = transcript.trim()
    if (!q) {
      setError("Please say something first.")
      return
    }
    await runSearch(q)
  }, [runSearch, transcript])

  return (
    <div style={{ border: "1px solid var(--border, #e5e7eb)", borderRadius: 8, padding: 16, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {!isListening ? (
          <button onClick={startListening} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db" }}>
            {buttonLabel}
          </button>
        ) : (
          <button onClick={stopListening} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", background: "#fee2e2" }}>
            {stopLabel}
          </button>
        )}
        <button onClick={handleSubmit} disabled={isLoading || !transcript.trim()} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", background: isLoading ? "#e5e7eb" : "#eef2ff" }}>
          {isLoading ? searchingLabel : "Search"}
        </button>
      </div>

      <div>
        <label style={{ display: "block", fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Transcript</label>
        <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} rows={3} placeholder="Your spoken query will appear here..." style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #d1d5db" }} />
      </div>

      {error ? (
        <div style={{ color: "#b91c1c", background: "#fee2e2", padding: 8, borderRadius: 6 }}>{error}</div>
      ) : null}

      {!!results?.length && (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Results ({results.length})</div>
          <ul style={{ display: "grid", gap: 6, listStyle: "none", padding: 0, margin: 0 }}>
            {results.map((r, idx) => (
              <li key={idx} style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: 8 }}>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{JSON.stringify(r, null, 2)}</pre>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ fontSize: 12, color: "#6b7280" }}>
        {isListening ? "Listening..." : "Click start to use your microphone."}
      </div>
    </div>
  )
}


