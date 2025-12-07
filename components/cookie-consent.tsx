"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "all")
    setIsVisible(false)
  }

  const acceptEssential = () => {
    localStorage.setItem("cookie-consent", "essential")
    setIsVisible(false)
  }

  const dismiss = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="container mx-auto max-w-4xl">
        <div className="glass-card rounded-2xl p-6 shadow-lg border border-border/50 bg-background/95 backdrop-blur-lg">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold mb-2">We value your privacy</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                By clicking &quot;Accept All&quot;, you consent to our use of cookies. Read our{" "}
                <Link href="/cookies" className="text-primary hover:underline">
                  Cookie Policy
                </Link>
                ,{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                , and{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                for more information.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={acceptAll} className="bg-primary text-primary-foreground">
                  Accept All
                </Button>
                <Button variant="outline" onClick={acceptEssential}>
                  Essential Only
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/cookies">Cookie Settings</Link>
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={dismiss}
              aria-label="Dismiss cookie banner"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
