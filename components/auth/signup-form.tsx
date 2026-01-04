"use client"

import React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, User, Store, Users, Mail, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { PhoneNumberInput, validatePhoneNumber } from "@/components/ui/phone-input"
import { DateOfBirthInput, validateAge } from "@/components/ui/date-of-birth-input"
import { Message } from "@/components/ui/message"
import { OTPInput } from "@/components/ui/otp-input"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Turnstile } from '@marsidev/react-turnstile'

type AccountType = "renter" | "owner" | "affiliate"

export function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const refCode = searchParams.get("ref")
  const [step, setStep] = useState(1)
  const [accountType, setAccountType] = useState<AccountType>("renter")

  // Form fields
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  // OTP State
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otp, setOtp] = useState("")
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  // Persist referral code
  useEffect(() => {
    const urlRef = searchParams.get("ref")
    if (urlRef) {
      sessionStorage.setItem("referral_code", urlRef)
    }
  }, [searchParams])

  // Get effective ref code (URL > Session > null)
  const getEffectiveRefCode = () => {
    return searchParams.get("ref") || (typeof window !== 'undefined' ? sessionStorage.getItem("referral_code") : null)
  }

  const [timeLeft, setTimeLeft] = useState(0)

  React.useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!fullName.trim()) newErrors.fullName = "Full name is required"

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    const phoneValidation = validatePhoneNumber(phone)
    if (!phoneValidation.valid) {
      newErrors.phone = phoneValidation.error || "Invalid phone number"
    }

    const ageValidation = validateAge(dateOfBirth, 18)
    if (!ageValidation.valid) {
      newErrors.dateOfBirth = ageValidation.error || "Invalid date of birth"
    }

    if (!acceptedTerms) {
      newErrors.terms = "You must accept the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true)
    setGeneralError("")

    try {
      // Use current origin for development, NEXT_PUBLIC_SITE_URL for production
      const redirectUrl = window.location.origin.includes('localhost')
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${redirectUrl}/auth/callback?ref=${getEffectiveRefCode() || ''}`,
          captchaToken: captchaToken || undefined,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        } as any,
      })

      if (error) throw error
    } catch (error: any) {
      setGeneralError(error.message || "Failed to sign up with Google")
      toast.error("Google Signup Failed", {
        description: error.message || "Something went wrong. Please try again."
      })
      setIsGoogleLoading(false)
    }
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1) {
      if (validateStep1()) {
        setStep(2)
      }
      return
    }

    // Final Submission
    setIsLoading(true)
    setGeneralError("")
    setSuccessMessage("")

    try {
      // Use NEXT_PUBLIC_SITE_URL for production, fallback to current origin for development
      const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${redirectUrl}/auth/confirm`,
          shouldCreateUser: true,
          captchaToken: captchaToken || undefined, // Pass captcha token if available
          data: {
            full_name: fullName,
            phone: phone,
            date_of_birth: dateOfBirth,
            role: accountType,
            ref_code: getEffectiveRefCode(), // Store referral code in metadata
          }
        },
      })

      if (error) throw error

      setShowOtpInput(true)
      setTimeLeft(60) // Start timer on first show
      setSuccessMessage(`We've sent a verification code to ${email}. Enter it below to complete your signup.`)
      toast.success("Code sent!", {
        description: `Check your email (${email}) for the verification code.`
      })

    } catch (error: any) {
      setGeneralError(error.message || "Failed to sign up")
      toast.error("Signup Failed", {
        description: error.message || "Please check your details and try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length !== 8) return
    setIsLoading(true)
    setGeneralError("")

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email', // Use 'email' type for OTP verification
      })

      if (error) throw error

      if (data.session) {
        toast.success("Account verified successfully!", {
          description: "Welcome to Leli Rentals."
        })
        // Redirection based on role
        if (accountType === 'renter') router.push('/categories')
        else if (accountType === 'owner') router.push('/dashboard/owner')
        else if (accountType === 'affiliate') router.push('/dashboard/affiliate')
        else router.push('/categories') // Default
      }
    } catch (error: any) {
      setGeneralError(error.message || "Invalid or expired code")
      toast.error("Verification Failed", {
        description: error.message || "The code you entered is invalid or has expired."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    setGeneralError("")
    setSuccessMessage("")

    try {
      // Use NEXT_PUBLIC_SITE_URL for production, fallback to current origin for development
      const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${redirectUrl}/auth/confirm`,
          shouldCreateUser: true,
          data: {
            full_name: fullName,
            phone: phone,
            date_of_birth: dateOfBirth,
            role: accountType,
            ref_code: refCode,
          }
        },
      })

      if (error) throw error

      setSuccessMessage(`Code resent to ${email}!`)
      toast.success("Code resent successfully")
      setTimeLeft(60) // Reset timer
    } catch (error: any) {
      setGeneralError(error.message || "Failed to resend code")
      toast.error("Failed to resend code", {
        description: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (showOtpInput) {
    return (
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Verify Account</h2>
          <p className="text-muted-foreground mb-6">
            Enter the 8-digit code sent to <strong>{email}</strong>
          </p>

          {generalError && <Message type="error" message={generalError} className="mb-6" />}
          {successMessage && <Message type="success" message={successMessage} className="mb-6" />}

          <div className="flex justify-center mb-6">
            <OTPInput
              value={otp}
              onChange={setOtp}
              length={8}
              disabled={isLoading}
            />
          </div>

          <Button
            className="w-full h-12 bg-primary text-primary-foreground mb-4"
            onClick={handleVerifyOtp}
            disabled={isLoading || otp.length !== 8}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify Code"}
          </Button>

          <div className="flex justify-between items-center px-2">
            <Button
              variant="link"
              onClick={() => setShowOtpInput(false)}
              disabled={isLoading}
              className="text-sm text-muted-foreground hover:text-primary h-auto p-0"
            >
              Change Email
            </Button>
            <Button
              variant="link"
              onClick={handleResendCode}
              disabled={isLoading || timeLeft > 0}
              className="text-sm text-primary h-auto p-0"
            >
              {timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend Code"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="glass-card rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Image src="/logo.png" alt="leli rentals" width={150} height={40} className="h-10 w-auto dark:invert" />
          </Link>
          <h1 className="text-2xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground">
            {step === 1 ? "Enter your details" : "Choose your account type"}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`h-2 w-12 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-2 w-12 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
        </div>

        {generalError && <Message type="error" message={generalError} className="mb-6" />}

        {step === 1 ? (
          <>
            {/* Social Signup */}
            <div className="flex flex-col space-y-3 mb-6">
              <Button
                variant="outline"
                className="w-full h-12 bg-transparent"
                onClick={handleGoogleSignup}
                disabled={isGoogleLoading || isLoading || !captchaToken}
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
            </div>

            <div className="relative mb-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-4 text-sm text-muted-foreground">
                or use email
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={errors.fullName ? 'border-destructive' : ''}
                />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <PhoneNumberInput
                value={phone}
                onChange={setPhone}
                error={errors.phone}
                required
              />

              <DateOfBirthInput
                value={dateOfBirth}
                onChange={setDateOfBirth}
                error={errors.dateOfBirth}
              />

              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    className={errors.terms ? 'border-destructive mt-1' : 'mt-1'}
                  />
                  <div className="flex-1">
                    <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                      I agree to leli rentals&apos;
                    </Label>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1">
                      <Link href="/terms" className="text-sm text-primary hover:underline font-medium">Terms</Link>
                      <span className="text-sm text-muted-foreground">•</span>
                      <Link href="/privacy" className="text-sm text-primary hover:underline font-medium">Privacy</Link>
                      <span className="text-sm text-muted-foreground">•</span>
                      <Link href="/cookies" className="text-sm text-primary hover:underline font-medium">Cookies</Link>
                    </div>
                  </div>
                </div>
                {errors.terms && <p className="text-sm text-destructive pl-9">{errors.terms}</p>}
              </div>

              <Button type="submit" className="w-full h-12 bg-primary text-primary-foreground mt-4">
                Next Step <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-base mb-4 block">Select Account Type</Label>
              <RadioGroup value={accountType} onValueChange={(value) => setAccountType(value as AccountType)}>
                <div className="space-y-3">
                  <Label htmlFor="renter" className="flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer hover:bg-accent transition-all [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem value="renter" id="renter" />
                    <User className="h-6 w-6 text-primary" />
                    <div className="flex-1">
                      <p className="font-semibold">Renter</p>
                      <p className="text-sm text-muted-foreground">Browse and rent items</p>
                    </div>
                  </Label>

                  <Label htmlFor="owner" className="flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer hover:bg-accent transition-all [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem value="owner" id="owner" />
                    <Store className="h-6 w-6 text-primary" />
                    <div className="flex-1">
                      <p className="font-semibold">Owner</p>
                      <p className="text-sm text-muted-foreground">List and rent out your items</p>
                    </div>
                  </Label>

                  <Label htmlFor="affiliate" className="flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer hover:bg-accent transition-all [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem value="affiliate" id="affiliate" />
                    <Users className="h-6 w-6 text-primary" />
                    <div className="flex-1">
                      <p className="font-semibold">Affiliate</p>
                      <p className="text-sm text-muted-foreground">Earn commissions</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>


            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)} disabled={isLoading}>
                Back
              </Button>
              <Button type="submit" className="flex-1 bg-primary text-primary-foreground" disabled={isLoading || !captchaToken}>
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Complete Signup"}
              </Button>
            </div>
          </form>
        )}

        <div className="my-6 flex justify-center" style={{ minHeight: '65px' }}>
          <Turnstile
            siteKey={process.env.NODE_ENV === 'development' ? "1x00000000000000000000AA" : (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA")}
            onSuccess={(token) => setCaptchaToken(token)}
            onExpire={() => setCaptchaToken(null)}
            onError={() => setCaptchaToken(null)}
            options={{
              theme: 'auto',
              appearance: 'always',
            }}
          />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
