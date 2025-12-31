"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Check, Loader2 } from "lucide-react"
import { sendNewsletterConfirmationEmail } from "@/lib/actions/email-actions"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setLoading(true)
      try {
        await sendNewsletterConfirmationEmail(email)
        setSubscribed(true)
        setEmail("")
        setTimeout(() => setSubscribed(false), 5000)
      } catch (error) {
        console.error("Subscription error:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="glass-card rounded-3xl p-8 md:p-12 max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-primary" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay ahead of the curve</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join our newsletter for exclusive deals, new listings, and rental tips delivered straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-background/50"
              required
            />
            <Button
              type="submit"
              size="lg"
              disabled={loading || subscribed}
              className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : subscribed ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Subscribed!
                </>
              ) : (
                "Subscribe"
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  )
}
