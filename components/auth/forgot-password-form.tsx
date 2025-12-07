"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Loader2, Mail, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSubmitted(true)
  }

  return (
    <div className="w-full max-w-md">
      <div className="glass-card rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Image src="/logo.svg" alt="Leli Rentals" width={150} height={40} className="h-10 w-auto dark:invert" />
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

            <Button type="submit" className="w-full h-12 bg-primary text-primary-foreground" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Reset Link"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-12 bg-transparent"
              onClick={() => {
                setIsSubmitted(false)
                setEmail("")
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
