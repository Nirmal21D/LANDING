"use client"

import React from "react"
import VoiceSearch from "@/components/VoiceSearch"
import ImageSearch from "@/components/ImageSearch"

// Simple page to demo the reusable components.
// Both widgets are self-contained and can be dropped into any page.

export default function TestSearchPage() {
  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: 24, display: "grid", gap: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Test Search (Voice + Image)</h1>
      <p style={{ color: "#6b7280" }}>
        Use the voice widget to speak your query or the image widget to upload a
        photo. Each component handles its own state and posts to existing APIs.
      </p>

      <section style={{ display: "grid", gap: 12 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>Voice Search</h2>
        {/* VoiceSearch component demonstrates Web Speech API usage */}
        <VoiceSearch
          buttonLabel="Start Voice Search"
          stopLabel="Stop"
          searchingLabel="Searching..."
          onResults={(data: any) => console.log("Voice results:", data)}
        />
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>Image Search</h2>
        {/* MageSearch uploads to /api/image-to-text which calls Gemini */}
        <ImageSearch onResults={(data: any) => console.log("Image results:", data)} />
      </section>
    </div>
  )
}
