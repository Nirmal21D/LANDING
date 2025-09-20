"use client"

import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Send, Bot, User, Sparkles, MapPin, Clock, Star, ExternalLink, Triangle, Globe, Database, Zap, Filter } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  articles?: Article[]
  sources?: string[]
}

interface Article {
  id: string
  title: string
  summary: string
  content: string
  source: string
  url: string
  publishedAt: Date
  category: string
  tags: string[]
  relevanceScore: number
}

// Mock scraped articles data
const mockArticles: Article[] = [
  {
    id: "1",
    title: "Small Business Digital Marketing Trends 2025",
    summary: "Latest digital marketing strategies that small businesses are using to grow their customer base.",
    content: "Small businesses are increasingly leveraging social media marketing, local SEO, and customer review management to compete with larger companies...",
    source: "Business Today",
    url: "https://businesstoday.com/marketing-trends-2025",
    publishedAt: new Date('2025-09-19'),
    category: "Marketing",
    tags: ["digital marketing", "small business", "social media", "SEO"],
    relevanceScore: 0.95
  },
  {
    id: "2",
    title: "Restaurant Industry Recovery and New Customer Expectations",
    summary: "How restaurants are adapting to post-pandemic customer preferences and technology adoption.",
    content: "The restaurant industry has seen significant changes in customer expectations, with increased demand for contactless ordering, delivery options, and health safety measures...",
    source: "Food & Service Magazine",
    url: "https://foodservice.com/restaurant-recovery-2025",
    publishedAt: new Date('2025-09-18'),
    category: "Restaurant",
    tags: ["restaurant", "customer service", "technology", "health safety"],
    relevanceScore: 0.88
  },
  {
    id: "3",
    title: "Local Business Cloud Storage Solutions for Data Security",
    summary: "Essential cloud storage and backup strategies for small businesses to protect customer data.",
    content: "Local businesses are increasingly moving to cloud-based storage solutions to ensure data security, compliance, and business continuity...",
    source: "Tech Business Weekly",
    url: "https://techbusiness.com/cloud-storage-small-business",
    publishedAt: new Date('2025-09-17'),
    category: "Technology",
    tags: ["cloud storage", "data security", "small business", "compliance"],
    relevanceScore: 0.82
  }
]

function ChatInterface() {
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "🏢 **Welcome to Thikana Business Intelligence Hub!**\n\nI'm your AI-powered business research assistant. I can help you:\n\n• **📊 Analyze market trends** - Get insights from the latest industry reports\n• **💡 Marketing strategies** - Discover effective tactics for business growth\n• **🔧 Technology solutions** - Find the right tools for your business needs\n• **📈 Industry insights** - Stay updated with real-time business news\n\nOur system continuously scrapes business articles from trusted sources and stores them in our cloud database. Simply ask me any business-related question!",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [isTyping, setIsTyping] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [lastProcessedQuery, setLastProcessedQuery] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const processedQueries = useRef<Set<string>>(new Set())
  const hasProcessedInitialQuery = useRef(false)

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

  // Search articles based on query using RAG-like functionality
  const searchRelevantArticles = (query: string): Article[] => {
    const queryLower = query.toLowerCase()
    
    // Filter articles based on content relevance
    return mockArticles.filter(article => {
      const titleMatch = article.title.toLowerCase().includes(queryLower)
      const contentMatch = article.content.toLowerCase().includes(queryLower)
      const tagMatch = article.tags.some(tag => tag.toLowerCase().includes(queryLower))
      const categoryMatch = article.category.toLowerCase().includes(queryLower)
      
      return titleMatch || contentMatch || tagMatch || categoryMatch
    }).sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 3)
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
      const relevantArticles = searchRelevantArticles(userMessage)
      let botResponse = ""
      let sources: string[] = []
      
      if (relevantArticles.length > 0) {
        botResponse = `Based on the latest business articles in our database, here's what I found regarding "${userMessage}":\n\n`
        
        relevantArticles.forEach((article, index) => {
          botResponse += `${index + 1}. **${article.title}**\n${article.summary}\n\n`
          sources.push(article.source)
        })
        
        botResponse += "The articles above are continuously updated from real-time web scraping and stored in our cloud database. You can click on any article to read the full content."
      } else {
        botResponse = "I couldn't find specific articles matching your query, but our system is continuously scraping and updating business articles. Try asking about marketing strategies, technology trends, or industry insights."
        relevantArticles.push(...mockArticles.slice(0, 2)) // Show some sample articles
        sources = mockArticles.slice(0, 2).map(a => a.source)
      }

      const botMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        articles: relevantArticles,
        sources: Array.from(new Set(sources))
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
            <NavbarButton href="/search" variant="secondary">
              Search
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
              <NavbarButton href="/search" variant="secondary">
                Search
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
            <Database className="w-4 h-4 mr-2" />
            Business Intelligence Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Business Article</span> RAG System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ask questions about business trends, marketing strategies, and industry insights. Our AI searches through real-time scraped articles to provide you with the most current information.
          </p>
        </div>

       

        {/* Chat Container */}
        <Card className="h-[800px] flex flex-col bg-card/50 backdrop-blur-sm border-border shadow-2xl">
          {/* Chat Header */}
          <div className="border-b border-border p-4 bg-card/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Business Intelligence Assistant</h3>
                  <p className="text-xs text-muted-foreground">Real-time article analysis • RAG-powered insights</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>

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
                      {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-10 h-4" />}
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

                {/* Article Results */}
                {message.articles && message.articles.length > 0 && (
                  <div className="ml-11 space-y-3">
                    {message.articles.map((article) => (
                      <Card key={article.id} className="p-4 bg-card border-border hover:shadow-lg transition-all duration-200 cursor-pointer">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-foreground mb-1">{article.title}</h3>
                            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Globe className="w-3 h-3" />
                                <span>{article.source}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{article.publishedAt.toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <Zap className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">{(article.relevanceScore * 100).toFixed(0)}%</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {article.summary}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {article.category}
                            </Badge>
                            {article.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button variant="outline" size="sm" className="text-xs" onClick={() => window.open(article.url, '_blank')}>
                            Read Full Article
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Cloud Storage & Real-time Indicator */}
                {message.sources && message.sources.length > 0 && (
                  <div className="ml-11 mt-3 p-3 bg-muted/50 rounded-lg border">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Database className="w-4 h-4 text-primary" />
                      <span>Sources from cloud database:</span>
                      <div className="flex items-center space-x-1">
                        {message.sources.map((source, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {source}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center space-x-1 ml-auto">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs">Live Data</span>
                      </div>
                    </div>
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
                placeholder="Ask about business trends and strategies... (e.g., 'Digital marketing trends for small businesses')"
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
                "Small business marketing strategies",
                "Restaurant industry trends 2025",
                "Cloud storage solutions for businesses",
                "Customer retention techniques",
                "Digital transformation insights"
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

        {/* Business Intelligence Features */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card/30 border-border/50 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Real-Time Web Scraping</h3>
            <p className="text-sm text-muted-foreground">Continuously updated business articles from trusted industry sources</p>
          </Card>

          <Card className="p-6 bg-card/30 border-border/50 text-center">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">AI-Powered RAG System</h3>
            <p className="text-sm text-muted-foreground">Advanced retrieval-augmented generation for precise business insights</p>
          </Card>

          <Card className="p-6 bg-card/30 border-border/50 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Cloud-Based Storage</h3>
            <p className="text-sm text-muted-foreground">Secure cloud storage with instant access to the latest business intelligence</p>
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
