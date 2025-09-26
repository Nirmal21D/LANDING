import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const runtime = 'edge'

// This route accepts multipart/form-data with field "image"
// It proxies the image to Gemini for description extraction and returns { description }

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 })
    }

    const contentType = req.headers.get('content-type') || ''
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 400 })
    }

    const form = await req.formData()
    const image = form.get('image') as File | null
    if (!image) {
      return NextResponse.json({ error: 'Missing image file' }, { status: 400 })
    }

    const arrayBuffer = await image.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)

    const genAI = new GoogleGenerativeAI(apiKey)
    // const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `Describe this image in one sentence suitable as a search query for local businesses. Focus on recognizable items, brands, or scenes that relate to places a user might want to find (e.g., coffee shop with latte art, sushi restaurant, bicycle repair, pharmacy). Return only the sentence.`

    const toBase64 = (u8: Uint8Array) => {
      let binary = ''
      const chunkSize = 0x8000
      for (let i = 0; i < u8.length; i += chunkSize) {
        const chunk = u8.subarray(i, i + chunkSize)
        binary += String.fromCharCode.apply(null as any, Array.from(chunk))
      }
      return btoa(binary)
    }

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          data: toBase64(bytes),
          mimeType: image.type || 'image/png',
        },
      },
    ])

    const response = await result.response
    const descriptionRaw = (response.text() || '').trim()
    const description = descriptionRaw.replace(/^"|"$/g, '')

    return NextResponse.json({ description })
  } catch (error: any) {
    console.error('image-to-text error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to analyze image' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}


