import { Globe } from "lucide-react"

export function Footer() {
  return (
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
  )
}