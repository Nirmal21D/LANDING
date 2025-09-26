"use client"

import React, { useCallback, useEffect, useState } from "react"

// Reusable Image Search component
// - Uploads image to /api/image-to-text → receives description → searches via /api/search-businesses

export default function ImageSearch({
  onResults,
  maxDistanceKm = 10000,
  limit = 20,
}) {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [results, setResults] = useState([])
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 })

  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  // Try to get geolocation once
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!navigator?.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, timeout: 5000 }
    )
  }, [])

  const handleUpload = useCallback(async () => {
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
    } catch (err) {
      setError(err?.message || "Image analysis failed")
    } finally {
      setIsLoading(false)
    }
  }, [file])

  const runSearch = useCallback(async () => {
    setError("")
    const q = (description || "").trim()
    if (!q) {
      setError("No description available to search.")
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
      if (typeof onResults === "function") onResults(data)
    } catch (err) {
      setError(err?.message || "Failed to search")
    } finally {
      setIsLoading(false)
    }
  }, [description, limit, maxDistanceKm, onResults, userLocation])

  return (
    <div style={{ border: "1px solid var(--border, #e5e7eb)", borderRadius: 8, padding: 16, display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gap: 8 }}>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        {previewUrl ? (
          <img src={previewUrl} alt="preview" style={{ maxWidth: "100%", borderRadius: 8, border: "1px solid #e5e7eb" }} />
        ) : null}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={handleUpload} disabled={!file || isLoading} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db" }}>
            {isLoading ? "Analyzing..." : "Analyze Image"}
          </button>
          <button onClick={runSearch} disabled={!description || isLoading} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", background: "#eef2ff" }}>
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      <div>
        <label style={{ display: "block", fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Image-derived description will appear here..." style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #d1d5db" }} />
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
    </div>
  )
}


