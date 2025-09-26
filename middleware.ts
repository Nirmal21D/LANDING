import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/business-dashboard(.*)',
  '/business-update(.*)',
  '/api/business(.*)',
  '/api/user(.*)',
  '/api/test-business'
])

// Define public routes that should be accessible without authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)', // Allow all login routes
  '/business-register(.*)', // Allow all business-register routes
  '/search(.*)',
  '/api/register-business',
  '/api/search-businesses',
  '/api/webhooks(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // Protect private routes
  if (isProtectedRoute(req)) {
    try {
      const { userId } = await auth()
      
      if (!userId) {
        // Redirect to login if not authenticated
        const loginUrl = new URL('/login', req.url)
        return NextResponse.redirect(loginUrl)
      }
    } catch (error) {
      // Redirect to login if authentication fails
      const loginUrl = new URL('/login', req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}