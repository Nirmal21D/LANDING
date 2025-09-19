"use client"

import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { 
  Navbar, 
  NavBody, 
  NavItems, 
  MobileNav, 
  MobileNavHeader, 
  MobileNavMenu, 
  MobileNavToggle,
  NavbarButton 
} from "@/components/ui/resizable-navbar"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { Send, Bot, User, Sparkles, MapPin, Clock, Star, ExternalLink, Triangle } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  businessResults?: BusinessResult[]
}

interface BusinessResult {
  id: string
  name: string
  category: string
  rating: number
  distance: string
  address: string
  isOpen: boolean
  description: string
}

function ChatInterface() {
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm Thikana AI, your local business discovery assistant. Ask me anything about businesses in your area - from restaurants and cafes to services and entertainment!",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [lastProcessedQuery, setLastProcessedQuery] = useState<string>('')
  const hasProcessedInitialQuery = useRef(false)
  const processedQueries = useRef<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle search query from URL parameter - only once per unique query
  useEffect(() => {
    const query = searchParams.get('q')
    console.log('Chat page received query:', query, 'hasProcessedInitialQuery:', hasProcessedInitialQuery.current)
    
    if (query && query.trim()) {
      const trimmedQuery = query.trim()
      
      // Check if we've already processed this exact query
      if (!processedQueries.current.has(trimmedQuery)) {
        console.log('Processing NEW search query in chat:', trimmedQuery)
        
        processedQueries.current.add(trimmedQuery)
        hasProcessedInitialQuery.current = true
        
        // Add user message immediately
        const userMessage: Message = {
          id: Date.now().toString(),
          type: 'user',
          content: trimmedQuery,
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, userMessage])
        
        // Simulate bot response after a short delay
        setTimeout(() => {
          simulateBotResponse(trimmedQuery)
        }, 800)
        
        // Clear the URL parameter after processing
        setTimeout(() => {
          if (window.history.replaceState) {
            window.history.replaceState({}, document.title, '/chat')
          }
        }, 1000)
      } else {
        console.log('Skipping DUPLICATE search query:', trimmedQuery)
      }
    }
  }, [searchParams])

  // Sample business results for demo
  const getSampleBusinessResults = (query: string): BusinessResult[] => {
    const allBusinesses: BusinessResult[] = [
      {
        id: '1',
        name: 'Brew & Bytes Café',
        category: 'Coffee Shop',
        rating: 4.8,
        distance: '0.3 miles',
        address: '123 Main St, Downtown',
        isOpen: true,
        description: 'Cozy café with free WiFi, outdoor seating, and locally roasted coffee'
      },
      {
        id: '2',
        name: 'The Digital Den',
        category: 'Coffee Shop',
        rating: 4.6,
        distance: '0.5 miles',
        address: '456 Tech Blvd, Silicon District',
        isOpen: true,
        description: 'Tech-friendly workspace with high-speed internet and charging stations'
      },
      {
        id: '3',
        name: 'Garden View Restaurant',
        category: 'Fine Dining',
        rating: 4.9,
        distance: '0.7 miles',
        address: '789 Garden Ave, Uptown',
        isOpen: false,
        description: 'Farm-to-table restaurant with beautiful outdoor garden seating'
      },
      {
        id: '4',
        name: 'Quick Bites Deli',
        category: 'Deli',
        rating: 4.4,
        distance: '0.2 miles',
        address: '321 Business Row, Downtown',
        isOpen: true,
        description: 'Fast casual deli with fresh sandwiches and salads'
      },
      {
        id: '5',
        name: 'Wellness Dental Clinic',
        category: 'Healthcare',
        rating: 4.7,
        distance: '1.2 miles',
        address: '555 Health Plaza, Medical District',
        isOpen: true,
        description: 'Modern dental practice with evening and weekend appointments'
      }
    ]

    // Simple keyword matching for demo
    const queryLower = query.toLowerCase()
    if (queryLower.includes('coffee') || queryLower.includes('café') || queryLower.includes('wifi')) {
      return allBusinesses.filter(b => b.category === 'Coffee Shop')
    }
    if (queryLower.includes('restaurant') || queryLower.includes('food') || queryLower.includes('eat')) {
      return allBusinesses.filter(b => b.category === 'Fine Dining' || b.category === 'Deli')
    }
    if (queryLower.includes('dentist') || queryLower.includes('dental') || queryLower.includes('doctor')) {
      return allBusinesses.filter(b => b.category === 'Healthcare')
    }
    return allBusinesses.slice(0, 3) // Default: show first 3
  }

  const simulateBotResponse = (userMessage: string) => {
    // Prevent duplicate responses for the same message
    if (lastProcessedQuery === userMessage || isTyping) {
      console.log('Skipping duplicate bot response for:', userMessage)
      return
    }
    
    setLastProcessedQuery(userMessage)
    setIsTyping(true)
    
    setTimeout(() => {
      const businessResults = getSampleBusinessResults(userMessage)
      let botResponse = ""
      
      if (businessResults.length > 0) {
        botResponse = `I found ${businessResults.length} great options for you! Here are the best matches based on your query:`
      } else {
        botResponse = "I understand you're looking for local businesses. Let me show you some popular options in your area:"
      }

      const botMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        businessResults: businessResults
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleSendMessage = () => {
    console.log('Send button clicked, inputValue:', inputValue)
    if (!inputValue.trim()) {
      console.log('Input is empty, returning')
      return
    }

    const trimmedInput = inputValue.trim()
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: trimmedInput,
      timestamp: new Date()
    }

    console.log('Adding user message:', userMessage)
    setMessages(prev => [...prev, userMessage])
    simulateBotResponse(trimmedInput)
    setInputValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Resizable Navbar */}
      <Navbar className="fixed top-0 left-0 right-0 z-50">
        {/* Desktop Navbar */}
        <NavBody>
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Triangle className="w-6 h-6 text-primary fill-primary" />
            <span className="text-xl font-bold text-foreground">Thikana AI</span>
          </div>

          {/* Navigation Items */}
          <NavItems items={[
            { name: "Home", link: "/" },
            { name: "How it Works", link: "/#how-it-works" }
          ]} />

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <AnimatedThemeToggler />
            <NavbarButton href="/login" variant="secondary">
              Login
            </NavbarButton>
            <NavbarButton href="/business-register" variant="primary">
              Register Business
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navbar */}
        <MobileNav>
          <MobileNavHeader>
            <div className="flex items-center space-x-2">
              <Triangle className="w-6 h-6 text-primary fill-primary" />
              <span className="text-xl font-bold text-foreground">Thikana AI</span>
            </div>
            <div className="flex items-center space-x-2">
              <AnimatedThemeToggler />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            <div className="flex flex-col space-y-4 p-4">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <a href="/#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                How it Works
              </a>
              <div className="border-t border-border my-4"></div>
              <NavbarButton href="/login" variant="secondary">
                Login
              </NavbarButton>
              <NavbarButton href="/business-register" variant="primary">
                Register Business
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      
      <div className="pt-20 pb-8 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4 border border-primary/30">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Local Discovery
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
            Chat with <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Thikana AI</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ask me anything about local businesses - I'll help you discover the perfect places around you
          </p>
        </div>

        {/* Chat Container */}
        <Card className="h-[600px] flex flex-col bg-card/50 backdrop-blur-sm border-border shadow-2xl">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div key={message.id}>
                <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                  <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-accent text-accent-foreground'
                    }`}>
                      {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Results */}
                {message.businessResults && message.businessResults.length > 0 && (
                  <div className="ml-11 space-y-3">
                    {message.businessResults.map((business) => (
                      <Card key={business.id} className="p-4 bg-card border-border hover:shadow-lg transition-all duration-200 cursor-pointer">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">{business.name}</h3>
                            <p className="text-sm text-muted-foreground">{business.category}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{business.rating}</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {business.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{business.distance}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span className={business.isOpen ? 'text-green-600' : 'text-red-600'}>
                                {business.isOpen ? 'Open now' : 'Closed'}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs">{business.address}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="flex items-start space-x-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-muted">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="flex space-x-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me about local businesses... (e.g., 'Find coffee shops with WiFi nearby')"
                className="flex-1 bg-background border-border focus:ring-primary"
                disabled={isTyping}
              />
              <Button 
                type="button"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                disabled={!inputValue.trim() || isTyping}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                "Coffee shops with WiFi",
                "Best restaurants nearby",
                "Dentist open weekends",
                "Kid-friendly places",
                "Late night food"
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(suggestion)}
                  className="text-xs bg-muted/50 border-border hover:bg-muted"
                  disabled={isTyping}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Features Info */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card/30 border-border/50 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Smart Recommendations</h3>
            <p className="text-sm text-muted-foreground">AI-powered suggestions based on your preferences and location</p>
          </Card>

          <Card className="p-6 bg-card/30 border-border/50 text-center">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Real-Time Data</h3>
            <p className="text-sm text-muted-foreground">Up-to-date information on hours, availability, and reviews</p>
          </Card>

          <Card className="p-6 bg-card/30 border-border/50 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Location-Aware</h3>
            <p className="text-sm text-muted-foreground">Find businesses near you with accurate distance and directions</p>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background grid-pattern flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    }>
      <ChatInterface />
    </Suspense>
  )
}
