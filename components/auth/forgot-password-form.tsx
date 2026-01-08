"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Loader2, Mail, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { Message } from "@/components/ui/message"
import { Turnstile } from '@marsidev/react-turnstile'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaError, setCaptchaError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (!captchaToken) {
        setError("Please complete the captcha verification")
        setIsLoading(false)
        return
      }

      // Use current origin for development, NEXT_PUBLIC_SITE_URL for production
      const redirectUrl = window.location.origin.includes('localhost')
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${redirectUrl}/update-password`,
        captchaToken: captchaToken,
      })

      if (error) {
        // Handle specific error codes if needed, mainly rate limits
        throw error
      }

      setIsSubmitted(true)
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="glass-card rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Image src="/logo.png" alt="leli rentals" width={150} height={40} className="h-10 dark:invert" style={{ width: 'auto' }} />
          </Link>

          {!isSubmitted ? (
            <>
              <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
              <p className="text-muted-foreground">
                No worries! Enter your email and we&apos;ll send you reset instructions.
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
              <p className="text-muted-foreground">
                We&apos;ve sent password reset instructions to <strong className="text-foreground">{email}</strong>
              </p>
            </>
          )}
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Message type="error" message={error} />}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Turnstile Captcha */}
            <div className="flex justify-center" style={{ minHeight: '65px' }}>
              <Turnstile
                siteKey={process.env.NODE_ENV === 'development' ? "1x00000000000000000000AA" : (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA")}
                onSuccess={(token) => {
                  setCaptchaToken(token)
                  setCaptchaError(false)
                }}
                onExpire={() => setCaptchaToken(null)}
                onError={() => {
                  setCaptchaToken(null)
                  setCaptchaError(true)
                }}
                options={{
                  theme: 'auto',
                  appearance: 'always',
                }}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary text-primary-foreground"
              disabled={isLoading || !captchaToken}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : captchaError ? (
                "Captcha Failed"
              ) : !captchaToken ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                </span>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-12 bg-transparent"
              onClick={handleSubmit}
              disabled={isLoading || !captchaToken}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Resend Reset Link"}
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 bg-transparent"
              onClick={() => {
                setIsSubmitted(false)
                setEmail("")
                setCaptchaToken(null)
              }}
            >
              Try Another Email
            </Button>
          </div>
        )}

        {/* Back to Login */}
        <div className="mt-6">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
