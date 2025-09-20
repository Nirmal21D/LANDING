"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
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
import BusinessFlowDiagram from "@/components/ui/businessflow"
import ScrapingRagDiagram from "@/components/ui/scrapragflow"
import { MapPin, MessageCircle, Users, Zap, ArrowRight, Sparkles, Globe, Code, Search, Triangle } from "lucide-react"
import Link from "next/link"

export default function ThikanaAILanding() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (searchQuery.trim()) {
      // Redirect to search page with search query as URL parameter
      const trimmedQuery = searchQuery.trim()
      console.log('Searching for:', trimmedQuery)
      window.location.href = `/search?q=${encodeURIComponent(trimmedQuery)}`
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    console.log('Suggestion clicked:', suggestion)
    setSearchQuery(suggestion)
    // Immediately redirect with the suggestion
    window.location.href = `/search?q=${encodeURIComponent(suggestion)}`
  }

  const handleSearchButtonClick = () => {
    handleSearch()
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
            { name: "How it Works", link: "#how-it-works" },
            { name: "FAQ", link: "#faq" },
            { name: "Chat", link: "/chat" }
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
              <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                How it Works
              </a>
              <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
                FAQ
              </a>
              <Link href="/chat" className="text-sm font-medium hover:text-primary transition-colors">
                Chat
              </Link>
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

      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-24 md:pt-40 md:pb-32 lg:pt-48 lg:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-8 border border-primary/30">
            <Sparkles className="w-4 h-4 mr-2" />
            Thikana AI for Local Discovery
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-balance mb-8 leading-tight text-glow">
            AI for local business{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">discovery</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 text-pretty leading-relaxed">
            Empower your entire neighborhood to discover at the speed of thought, while ensuring accuracy remains at the
            forefront.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3 p-2 bg-card/50 backdrop-blur-sm border border-border rounded-2xl shadow-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  name="search"
                  placeholder="Ask me anything... 'Find coffee shops with WiFi near me'"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="pl-12 pr-4 py-4 text-lg bg-transparent border-0 focus:ring-0 focus:border-0 placeholder:text-muted-foreground/70"
                  autoComplete="off"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                onClick={handleSearchButtonClick}
                disabled={!searchQuery.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg font-semibold rounded-xl"
              >
                Search
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </form>

          {/* Quick Search Suggestions */}
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            <span className="text-sm text-muted-foreground">Try:</span>
            {[
              "Best pizza nearby",
              "Coffee shops with WiFi",
              "Dentist open today",
              "Kid-friendly restaurants",
              "Late night pharmacies"
            ].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs bg-muted/30 border-border/50 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Code Preview Section */}
      <section className="py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                The complete platform to discover local.
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Your neighborhood's toolkit to stop searching and start discovering. Securely find, explore, and connect
                with the best local experiences with Thikana AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Get a demo
                </Button>
                <Button variant="outline" size="lg" className="border-border text-foreground bg-transparent">
                  Explore the Product
                </Button>
              </div>
            </div>

            {/* Code Preview Panel */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">AI Query Interface</span>
                </div>
                <div className="text-xs text-muted-foreground">thikana.ai</div>
              </div>
              <div className="p-6 font-mono text-sm">
                <div className="text-green-600 dark:text-green-400">$ thikana ask</div>
                <div className="text-foreground mt-2">
                  "Find me the best coffee shop near downtown with WiFi and outdoor seating"
                </div>
                <div className="text-blue-600 dark:text-blue-400 mt-4">→ Analyzing local businesses...</div>
                <div className="text-yellow-600 dark:text-yellow-400 mt-1">→ Checking reviews and amenities...</div>
                <div className="text-green-600 dark:text-green-400 mt-1">✓ Found 3 perfect matches</div>
                <div className="text-foreground mt-3">
                  <div className="text-purple-700 dark:text-purple-400">1. Brew & Bytes Café</div>
                  <div className="text-muted-foreground ml-4">• 4.8★ rating • Free WiFi • Large patio</div>
                  <div className="text-muted-foreground ml-4">• 0.3 miles away • Open until 9pm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground mb-2">10k+</div>
              <div className="text-muted-foreground">businesses discovered</div>
              <div className="text-2xl font-bold text-foreground mt-4">LOCAL EATS</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground mb-2">98%</div>
              <div className="text-muted-foreground">accuracy rate</div>
              <div className="text-2xl font-bold text-foreground mt-4">QUICKFIND</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground mb-2">5x</div>
              <div className="text-muted-foreground">faster discovery</div>
              <div className="text-2xl font-bold text-foreground mt-4">NEIGHBORHOOD</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground mb-2">24/7</div>
              <div className="text-muted-foreground">AI availability</div>
              <div className="text-2xl font-bold text-foreground mt-4">ALWAYS ON</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-primary font-medium">Innovation</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Faster discovery. <span className="text-muted-foreground">More innovation.</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                The platform for rapid local exploration. Let your curiosity focus on discovering amazing places instead
                of managing endless search results with automated AI recommendations, built-in local insights, and
                integrated community feedback.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="p-6 bg-card/50 border-white/10 hover:bg-card/70 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Hyper-Local Intelligence</h3>
                    <p className="text-muted-foreground">
                      AI that understands your neighborhood's unique character and hidden gems.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card/50 border-white/10 hover:bg-card/70 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Natural Conversations</h3>
                    <p className="text-muted-foreground">
                      Ask questions like you would to a local friend who knows everything.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card/50 border-white/10 hover:bg-card/70 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Instant Results</h3>
                    <p className="text-muted-foreground">
                      Get comprehensive answers in seconds with real-time data and insights.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how Thikana AI processes real-time data and connects businesses with customers through advanced AI technology
            </p>
          </div>
          
          {/* Technical Flowcharts */}
          <div className="space-y-20">
            {/* RAG Query Flowchart */}
            <div className="bg-card/50 border border-border rounded-2xl p-8 shadow-lg">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-3">AI Content Processing & RAG Chat System</h3>
                <p className="text-muted-foreground">
                  Real-time web scraping, content vectorization, and intelligent query processing for business intelligence insights.
                </p>
              </div>
              <div className="h-[800px]">
                <ScrapingRagDiagram />
              </div>
            </div>

            {/* Business Registration Flowchart */}
            <div className="bg-card/50 border border-border rounded-2xl p-8 shadow-lg">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-3">Business Registration & Discovery Process</h3>
                <p className="text-muted-foreground">
                  Complete flow from business registration to customer discovery through location-based search and AI-powered matching.
                </p>
              </div>
              <div className="h-[800px]">
                <BusinessFlowDiagram/>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Customer CTA Section */}
      <section className="py-24 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Discover What's Nearby</h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed">
            From the best coffee shops to emergency services, get instant AI-powered recommendations for everything
            around you.
          </p>
          <Button size="lg" className="gradient-secondary text-white px-8 py-4 text-lg font-semibold">
            <a href="/chat" className="flex items-center">
              Start Chatting
              <MessageCircle className="w-5 h-5 ml-2" />
            </a>
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-secondary/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">Everything you need to know about Thikana AI</p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-card rounded-xl px-6 py-2 shadow-sm border-0">
              <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline">
                How accurate are the AI recommendations?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4 leading-relaxed">
                Our AI uses real-time data from verified business listings, customer reviews, and local insights to
                provide highly accurate recommendations. We continuously update our database to ensure information stays
                current and reliable.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-card rounded-xl px-6 py-2 shadow-sm border-0">
              <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline">
                Is Thikana AI free to use?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4 leading-relaxed">
                Yes! Thikana AI is completely free for customers to discover and get recommendations about local
                businesses. Business registration also starts with a free tier with premium features available.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-card rounded-xl px-6 py-2 shadow-sm border-0">
              <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline">
                How do I register my business?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4 leading-relaxed">
                Simply click "Register Business" and follow our quick 5-minute setup process. You'll need basic business
                information, photos, and operating hours. Our team will verify and activate your listing within 24
                hours.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-card rounded-xl px-6 py-2 shadow-sm border-0">
              <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline">
                What types of questions can I ask?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4 leading-relaxed">
                Ask anything about local businesses! "Best pizza near me", "Dentist open on weekends", "Kid-friendly
                restaurants with parking" - our AI understands natural language and provides contextual answers.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-card rounded-xl px-6 py-2 shadow-sm border-0">
              <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline">
                Which cities are supported?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4 leading-relaxed">
                We're currently available in major cities across North America and expanding rapidly. Check our coverage
                map or try searching - if we're in your area, you'll get results instantly!
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border bg-background text-foreground">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Logo and Branding */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">T</span>
              </div>
              <span className="text-2xl font-bold">Thikana AI</span>
            </div>
            
            {/* Description */}
            <p className="text-lg text-muted-foreground text-center max-w-md">
              Find Local. Get Smart Answers. Discover the best businesses around you with AI-powered recommendations.
            </p>

            {/* Official Link */}
            <div className="flex flex-col items-center space-y-2">
              <a 
                href="https://thikana-portal.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:from-primary/90 hover:to-accent/90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                <Globe className="w-4 h-4 mr-2" />
                Visit Official Portal
              </a>
              <p className="text-xs text-muted-foreground">
                Official Thikana Portal
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">© 2025 Thikana AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
