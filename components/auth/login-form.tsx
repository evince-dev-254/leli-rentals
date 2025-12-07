"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Message } from "@/components/ui/message"
import { supabase } from "@/lib/supabase"
import { checkUserExists } from "@/lib/actions/auth-actions"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Login Logic State
  const [isEmailChecked, setIsEmailChecked] = useState(false)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState("")

  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsCheckingEmail(true)
    setError("")

    try {
      // Check if user exists using server action
      const result = await checkUserExists(email)

      if (result.error) {
        throw new Error("Could not verify email. Please try again.")
      }

      if (!result.exists) {
        // User does not exist -> Redirect to Signup
        setError("No account found with this email. Redirecting to signup...")
        setTimeout(() => {
          router.push(`/signup?email=${encodeURIComponent(email)}`)
        }, 1500)
        return
      }

      // User exists -> Show Password Field
      setIsEmailChecked(true)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setIsCheckingEmail(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return

    setIsLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.session) {
        // Fetch user profile to redirect correctly
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', data.user?.id)
          .single()

        const role = profile?.role || 'renter'

        router.refresh()

        if (next) {
          router.push(next)
        } else {
          if (role === 'admin') router.push('/dashboard/admin')
          else if (role === 'owner') router.push('/dashboard/owner')
          else if (role === 'affiliate') router.push('/dashboard/affiliate')
          else router.push('/categories')
        }
      }
    } catch (err: any) {
      setError(err.message || "Invalid login credentials")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) throw error
    } catch (error: any) {
      setError(error.message || "Failed to sign in with Google")
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="glass-card rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Image src="/logo.png" alt="Leli Rentals" width={150} height={40} className="h-10 w-auto dark:invert" />
          </Link>
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        {/* Google Login */}
        <Button
          variant="outline"
          className="w-full h-12 mb-6 bg-transparent"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || isLoading || isCheckingEmail}
        >
          {isGoogleLoading ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          Continue with Google
        </Button>

        <div className="relative mb-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-4 text-sm text-muted-foreground">
            or continue with email
          </span>
        </div>

        {error && <Message type="error" message={error} className="mb-6" />}

        <form onSubmit={isEmailChecked ? handleLogin : handleEmailCheck} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setIsEmailChecked(false) // Reset checking if email changes
                setError("")
              }}
              required
              disabled={isCheckingEmail || isLoading}
            />
          </div>

          {isEmailChecked && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 bg-primary text-primary-foreground mt-2"
            disabled={isCheckingEmail || isLoading}
          >
            {isCheckingEmail || isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isEmailChecked ? (
              "Sign In"
            ) : (
              "Continue"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Do not have an account?{" "}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
