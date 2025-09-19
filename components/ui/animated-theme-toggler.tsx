"use client"

import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

type AnimatedThemeTogglerProps = {
  className?: string
  size?: "sm" | "default" | "lg" | "icon"
  variant?: "ghost" | "default" | "outline" | "secondary" | "destructive" | "link"
}

export function AnimatedThemeToggler({ className, size = "sm", variant = "ghost" }: AnimatedThemeTogglerProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted ? (resolvedTheme ?? theme) === "dark" : false

  // Prevent hydration mismatch by rendering a consistent initial state
  if (!mounted) {
    return (
      <Button
        variant={variant}
        size={size}
        className={`text-foreground/70 hover:text-foreground hover:bg-muted/50 transition-colors ${className ?? ""}`}
        aria-pressed={false}
        title="Toggle theme"
        disabled
      >
        <span className="relative inline-flex items-center justify-center w-4 h-4">
          <Sun className="h-4 w-4 opacity-0" />
        </span>
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const handleToggle = async () => {
    
    const next = isDark ? "light" : "dark"

    // Fallback if View Transitions API is unavailable
    // @ts-ignore - vendor feature detection
    if (typeof document.startViewTransition !== "function" || !buttonRef.current) {
      setTheme(next)
      return
    }

    const button = buttonRef.current
    const rect = button.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const right = window.innerWidth - rect.left
    const bottom = window.innerHeight - rect.top
    const maxRad = Math.hypot(Math.max(rect.left, right), Math.max(rect.top, bottom))

    // @ts-ignore - experimental API in some browsers
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(next)
      })
    })

    // Animate the reveal from the toggle position
    await transition.ready
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRad}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        // @ts-ignore - pseudo element for view transition
        pseudoElement: "::view-transition-new(root)",
      },
    )
  }

  return (
    <Button
      ref={buttonRef}
      variant={variant}
      size={size}
      onClick={handleToggle}
      className={`text-foreground/70 hover:text-foreground hover:bg-muted/50 transition-colors ${className ?? ""}`}
      aria-pressed={isDark}
      title="Toggle theme"
    >
      <span className="relative inline-flex items-center justify-center w-4 h-4">
        <Sun
          className={`h-4 w-4 transform transition-all duration-300 ${
            mounted && !isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
          }`}
        />
        <Moon
          className={`absolute h-4 w-4 transform transition-all duration-300 ${
            mounted && isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-0"
          }`}
        />
      </span>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
