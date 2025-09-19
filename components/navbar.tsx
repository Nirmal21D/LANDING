"use client"

import { Button } from "@/components/ui/button"
import { Menu, X, Triangle } from "lucide-react"
import { useState } from "react"
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Triangle className="w-6 h-6 text-primary fill-primary" />
            <span className="text-xl font-bold text-foreground">Thikana AI</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              Home
            </a>
            <a
              href="/chat"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              Chat
            </a>
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              How it Works
            </a>
            <a
              href="#faq"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              FAQ
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <AnimatedThemeToggler />
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-muted/50">
              <a href="/login">Sign In</a>
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
              <a href="/business-register">Register Business</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </a>
              <a href="/chat" className="text-muted-foreground hover:text-foreground transition-colors">
                Chat
              </a>
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                How it Works
              </a>
              <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <AnimatedThemeToggler />
                </div>
                <Button variant="outline" size="sm" className="text-foreground hover:bg-muted/50 bg-transparent">
                  <a href="/login">Sign In</a>
                </Button>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                  <a href="/business-register">Register Business</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
