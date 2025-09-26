"use client"

import { useState, useEffect } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [debugInfo, setDebugInfo] = useState({
    networkTest: null,
    authTest: null,
    businessApiTest: null,
    testApiTest: null
  })

  const runTests = async () => {
    console.log('Starting debug tests...')
    
    // Test 1: Basic network connectivity
    try {
      const response = await fetch('/api/health', { method: 'GET' })
      setDebugInfo(prev => ({
        ...prev,
        networkTest: { status: response.status, text: await response.text() }
      }))
    } catch (error) {
      setDebugInfo(prev => ({
        ...prev,
        networkTest: { error: error.message }
      }))
    }

    // Test 2: Authentication
    if (user?.id) {
      try {
        const response = await fetch('/api/test-business')
        const data = await response.json()
        setDebugInfo(prev => ({
          ...prev,
          testApiTest: { status: response.status, data }
        }))
      } catch (error) {
        setDebugInfo(prev => ({
          ...prev,
          testApiTest: { error: error.message }
        }))
      }

      // Test 3: Business API
      try {
        const response = await fetch(`/api/business/${user.id}`)
        const data = await response.json()
        setDebugInfo(prev => ({
          ...prev,
          businessApiTest: { status: response.status, data }
        }))
      } catch (error) {
        setDebugInfo(prev => ({
          ...prev,
          businessApiTest: { error: error.message }
        }))
      }
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
            <CardDescription>Troubleshooting business update issues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Authentication Status */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Authentication Status</h3>
              <div className="space-y-1 text-sm">
                <p>Clerk Loaded: {isLoaded ? '✅ Yes' : '❌ No'}</p>
                <p>User Signed In: {isSignedIn ? '✅ Yes' : '❌ No'}</p>
                <p>User ID: {user?.id || 'None'}</p>
                <p>User Email: {user?.primaryEmailAddress?.emailAddress || 'None'}</p>
                <p>User Name: {user?.fullName || user?.firstName || 'None'}</p>
              </div>
            </div>

            {/* Test Button */}
            <div>
              <Button onClick={runTests} className="mb-4">Run API Tests</Button>
            </div>

            {/* Test Results */}
            <div className="grid gap-4">
              <div>
                <h4 className="font-semibold">Network Test:</h4>
                <pre className="text-xs bg-muted p-2 rounded">
                  {JSON.stringify(debugInfo.networkTest, null, 2)}
                </pre>
              </div>
              
              <div>
                <h4 className="font-semibold">Test API:</h4>
                <pre className="text-xs bg-muted p-2 rounded">
                  {JSON.stringify(debugInfo.testApiTest, null, 2)}
                </pre>
              </div>
              
              <div>
                <h4 className="font-semibold">Business API:</h4>
                <pre className="text-xs bg-muted p-2 rounded">
                  {JSON.stringify(debugInfo.businessApiTest, null, 2)}
                </pre>
              </div>
            </div>

            {/* Manual Test */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Manual Tests</h3>
              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/test-business')
                      const data = await response.json()
                      alert(JSON.stringify(data, null, 2))
                    } catch (error) {
                      alert(`Error: ${error.message}`)
                    }
                  }}
                  variant="outline"
                  size="sm"
                >
                  Test API
                </Button>
                
                <Button
                  onClick={async () => {
                    if (!user?.id) {
                      alert('No user ID available')
                      return
                    }
                    try {
                      const response = await fetch(`/api/business/${user.id}`)
                      const data = await response.json()
                      alert(JSON.stringify(data, null, 2))
                    } catch (error) {
                      alert(`Error: ${error.message}`)
                    }
                  }}
                  variant="outline"
                  size="sm"
                >
                  Test Business API
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}