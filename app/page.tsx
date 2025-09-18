import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Navbar } from "@/components/navbar"
import { MapPin, MessageCircle, Users, Zap, ArrowRight, Sparkles, Globe, Code } from "lucide-react"

export default function ThikanaAILanding() {
  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />

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
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg font-semibold"
            >
              Start Exploring
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-muted/50 px-8 py-4 text-lg bg-transparent"
            >
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center mr-3">
                <div className="w-0 h-0 border-l-[6px] border-l-foreground border-y-[4px] border-y-transparent ml-0.5"></div>
              </div>
              Watch Demo
            </Button>
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
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to discover the best local businesses around you
            </p>
          </div>
          
          {/* Flow Diagram */}
          <div className="relative">
            {/* Desktop Flow */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-between">
                {/* Step 1 */}
                <div className="flex flex-col items-center group">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 border-4 border-background">
                      <MessageCircle className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-background">
                      1
                    </div>
                  </div>
                  <div className="mt-6 text-center max-w-xs">
                    <h3 className="text-xl font-bold mb-3">Ask Your Question</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Type what you're looking for in natural language - restaurants, services, or local info.
                    </p>
                  </div>
                </div>

                {/* Arrow 1 */}
                <div className="flex-1 flex justify-center">
                  <div className="relative">
                    <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                    <ArrowRight className="w-6 h-6 text-primary absolute -top-2.5 right-0" />
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center group">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-accent to-primary rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 border-4 border-background">
                      <Zap className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-background">
                      2
                    </div>
                  </div>
                  <div className="mt-6 text-center max-w-xs">
                    <h3 className="text-xl font-bold mb-3">AI Searches</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Our AI instantly searches through local business data, reviews, and real-time information.
                    </p>
                  </div>
                </div>

                {/* Arrow 2 */}
                <div className="flex-1 flex justify-center">
                  <div className="relative">
                    <div className="w-16 h-1 bg-gradient-to-r from-accent to-primary rounded-full"></div>
                    <ArrowRight className="w-6 h-6 text-accent absolute -top-2.5 right-0" />
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center group">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 border-4 border-background">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-background">
                      3
                    </div>
                  </div>
                  <div className="mt-6 text-center max-w-xs">
                    <h3 className="text-xl font-bold mb-3">Get Smart Answers</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Receive personalized recommendations with all the details, reviews, and context you need.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile/Tablet Flow */}
            <div className="lg:hidden space-y-12">
              {/* Step 1 */}
              <div className="flex items-start space-x-6 group">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-background">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs border border-background">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">Ask Your Question</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Type what you're looking for in natural language - restaurants, services, or local info.
                  </p>
                </div>
              </div>

              {/* Arrow 1 */}
              <div className="flex justify-center">
                <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-6 group">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-background">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xs border border-background">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">AI Searches</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our AI instantly searches through local business data, reviews, and real-time information.
                  </p>
                </div>
              </div>

              {/* Arrow 2 */}
              <div className="flex justify-center">
                <div className="w-1 h-8 bg-gradient-to-b from-accent to-primary rounded-full"></div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-6 group">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-background">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs border border-background">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">Get Smart Answers</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Receive personalized recommendations with all the details, reviews, and context you need.
                  </p>
                </div>
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
            Start Chatting
            <MessageCircle className="w-5 h-5 ml-2" />
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
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">T</span>
                </div>
                <span className="text-2xl font-bold">Thikana AI</span>
              </div>
              <p className="text-lg text-muted-foreground mb-6 max-w-md">
                Find Local. Get Smart Answers. Discover the best businesses around you with AI-powered recommendations.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors cursor-pointer">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors cursor-pointer">
                  <Users className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <a href="#" className="hover:opacity-100 transition-opacity">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-100 transition-opacity">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-100 transition-opacity">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-100 transition-opacity">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <a href="#" className="hover:opacity-100 transition-opacity">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-100 transition-opacity">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-100 transition-opacity">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-100 transition-opacity">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">© 2024 Thikana AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
