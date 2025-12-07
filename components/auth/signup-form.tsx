"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, User, Store, Users } from "lucide-react"
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
import { sendWelcomeEmail } from "@/lib/actions/email-actions"
import { sendCustomOtp, verifyCustomOtp } from "@/lib/actions/verify-actions"
import { registerUser } from "@/lib/actions/auth-actions"

type AccountType = "renter" | "owner" | "affiliate"

export function SignupForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [accountType, setAccountType] = useState<AccountType>("renter")

  // Form fields
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  // OTP verification states
  const [showOtpStep, setShowOtpStep] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

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

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-z])/.test(password)) {
      newErrors.password = "Password must include a lowercase letter"
    } else if (!/(?=.*[A-Z])/.test(password)) {
      newErrors.password = "Password must include an uppercase letter"
    } else if (!/(?=.*\d)/.test(password)) {
      newErrors.password = "Password must include a number"
    } else if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])/.test(password)) {
      newErrors.password = "Password must include a special character"
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
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
      const { data, error } = await supabase.auth.signInWithOAuth({
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
      setGeneralError(error.message || "Failed to sign up with Google")
      setIsGoogleLoading(false)
    }
  }

  // OTP Verification function
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError("Please enter a 6-digit code")
      return
    }

    setIsVerifying(true)
    setOtpError("")

    try {
      // Use Custom OTP Verification
      const { success, error } = await verifyCustomOtp(email, otp, password, fullName)

      if (!success) throw new Error(error || "Invalid verification code")

      // If successful, we need to sign the user in manually
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      // Send welcome email after verification
      await sendWelcomeEmail(email, fullName.split(" ")[0])

      setSuccessMessage(`Welcome to Leli Rentals, ${fullName.split(" ")[0]}! 🎉`)

      // Redirect based on account type
      setTimeout(() => {
        if (accountType === "renter") {
          router.push("/categories")
        } else if (accountType === "owner") {
          router.push("/dashboard/owner")
        } else if (accountType === "affiliate") {
          router.push("/dashboard/affiliate")
        }
      }, 2000)
    } catch (error: any) {
      console.error('OTP verification error:', error)

      let msg = error.message || "Invalid verification code. Please try again."

      if (msg.includes("Password should contain at least one character")) {
        msg = "Weak password. Please use a stronger password (A-Z, a-z, 0-9, symbol)."
        // If we hit this, we should ideally send them back to step 1, but for now just show the error
        setGeneralError(msg)
        setOtpError("Password update failed. Please restart signup with a stronger password.")
      } else {
        setOtpError(msg)
      }
    } finally {
      setIsVerifying(false)
    }
  }

  // Resend OTP function
  const resendOtp = async () => {
    setIsResending(true)
    setOtpError("")

    try {
      // Use Custom OTP Resend
      const { success, error } = await sendCustomOtp(email)

      if (!success) throw new Error(error || "Failed to resend code")

      setSuccessMessage("📧 New verification code sent!")
      setOtp("") // Clear current OTP
      setResendTimer(60) // Start cooldown
    } catch (error: any) {
      console.error('Resend OTP error:', error)
      setOtpError("Failed to resend code. Please try again.")
    } finally {
      setIsResending(false)
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

    // Step 2: Create account
    setIsLoading(true)
    setGeneralError("")

    try {
      // Sign up with Supabase using Server Action to avoid default email sending issues
      const { success, user, error } = await registerUser({
        email,
        password,
        data: {
          full_name: fullName,
          phone: phone,
          date_of_birth: dateOfBirth,
          role: accountType,
        },
      })

      if (!success) throw new Error(error)

      const data = { user, session: null } // Mimic response structure for below logic

      if (data.session) {
        setSuccessMessage("Account created successfully! Redirecting...")
        setTimeout(() => {
          if (accountType === "renter") router.push("/categories")
          else if (accountType === "owner") router.push("/dashboard/owner")
          else if (accountType === "affiliate") router.push("/dashboard/affiliate")
        }, 1500)
        return
      }

      if (data.user) {
        // User profile creation is now handled by a Database Trigger on auth.users
        // This prevents RLS issues and ensures atomicity.

        // Store user ID for OTP verification
        setUserId(data.user.id)

        // Send Custom OTP immediately
        await sendCustomOtp(email)

        // Show OTP verification step
        setShowOtpStep(true)
        setSuccessMessage(`📧 Verification code sent to ${email}`)
      }
    } catch (error: any) {
      // Better error messages
      console.error('Signup error:', error)
      if (typeof error === 'object') {
        console.error('Error details:', JSON.stringify(error, null, 2))
        console.error('Error message:', (error as any)?.message)
      }
      let errorMessage = "Failed to create account"

      if (error.message?.includes("429") || error.message?.includes("Too Many Requests") || error.message?.includes("after 30 seconds")) {
        errorMessage = "⏱️ Too many signup attempts. Please wait 30 seconds and try again."
      } else if (error.message?.includes("row-level security policy") || error.message?.includes("violates row-level security")) {
        errorMessage = "⚠️ Database configuration error. Please contact support."
      } else if (error.message?.includes("already registered") || error.message?.includes("already exists")) {
        errorMessage = "📧 This email is already registered. Please sign in instead."
      } else if (error.message) {
        errorMessage = error.message
      }

      setGeneralError(errorMessage)
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
            <Image src="/logo.png" alt="Leli Rentals" width={150} height={40} className="h-10 w-auto dark:invert" />
          </Link>
          <h1 className="text-2xl font-bold mb-2">
            {showOtpStep ? "Verify Your Email" : "Create Account"}
          </h1>
          <p className="text-muted-foreground">
            {showOtpStep
              ? "Enter the 6-digit code sent to your email"
              : step === 1
                ? "Enter your details to get started"
                : "Choose your account type"}
          </p>
        </div>

        {/* Step Indicator - Only show if not in OTP step */}
        {!showOtpStep && (
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`h-2 w-12 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
            <div className={`h-2 w-12 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <Message type="success" message={successMessage} className="mb-6" />
        )}

        {/* General Error */}
        {generalError && (
          <Message type="error" message={generalError} className="mb-6" />
        )}

        {/* OTP Verification Step */}
        {showOtpStep ? (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                We sent a code to <span className="font-medium text-foreground">{email}</span>
              </p>
            </div>

            <div className="py-4">
              <OTPInput
                value={otp}
                onChange={setOtp}
                length={6}
                disabled={isVerifying}
                error={!!otpError}
              />
              {otpError && (
                <p className="text-sm text-destructive text-center mt-2">{otpError}</p>
              )}
            </div>

            <Button
              className="w-full h-12 bg-primary text-primary-foreground"
              onClick={verifyOtp}
              disabled={isVerifying || otp.length !== 6}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline font-medium disabled:opacity-50"
                  onClick={resendOtp}
                  disabled={isResending || resendTimer > 0}
                >
                  {isResending ? "Sending..." : resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                </button>
              </p>

              <div className="pt-2 border-t border-border/50">
                <Button
                  variant="link"
                  className="text-sm text-muted-foreground hover:text-foreground h-auto p-0"
                  onClick={async () => {
                    // Try to log in immediately (in case 'Allow unverified logins' is enabled)
                    setIsLoading(true)
                    try {
                      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                      })

                      if (signInData.session) {
                        // Login successful - redirect to dashboard
                        if (accountType === "renter") router.push("/categories")
                        else if (accountType === "owner") router.push("/dashboard/owner")
                        else if (accountType === "affiliate") router.push("/dashboard/affiliate")
                      } else {
                        // Login failed (likely due to verification) - send to sign in
                        throw new Error("Verification required")
                      }
                    } catch (err) {
                      // If login fails (standard behavior for unverified accounts), redirect to Sign In
                      router.push('/sign-in')
                    } finally {
                      setIsLoading(false)
                    }
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify later via email"}
                </Button>
              </div>
            </div>
          </div>
        ) : step === 1 ? (
          <>
            {/* Google Signup */}
            <Button
              variant="outline"
              className="w-full h-12 mb-6 bg-transparent"
              onClick={handleGoogleSignup}
              disabled={isGoogleLoading}
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

            {/* Divider */}
            <div className="relative mb-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-4 text-sm text-muted-foreground">
                or
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={errors.fullName ? 'border-destructive' : ''}
                />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
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

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={errors.confirmPassword ? 'border-destructive' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    className={errors.terms ? 'border-destructive mt-1' : 'mt-1'}
                  />
                  <div className="flex-1">
                    <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                      I agree to Leli Rentals'
                    </Label>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1">
                      <Link
                        href="/terms"
                        className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1"
                        target="_blank"
                      >
                        Terms of Service
                      </Link>
                      <span className="text-sm text-muted-foreground">•</span>
                      <Link
                        href="/privacy"
                        className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1"
                        target="_blank"
                      >
                        Privacy Policy
                      </Link>
                      <span className="text-sm text-muted-foreground">•</span>
                      <Link
                        href="/cookies"
                        className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1"
                        target="_blank"
                      >
                        Cookie Policy
                      </Link>
                    </div>
                  </div>
                </div>
                {errors.terms && <p className="text-sm text-destructive pl-9">{errors.terms}</p>}
              </div>

              <Button type="submit" className="w-full h-12 bg-primary text-primary-foreground">
                Continue
              </Button>
            </form>
          </>
        ) : (
          <>
            {/* Account Type Selection */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-base mb-4 block">Select Account Type</Label>
                <RadioGroup value={accountType} onValueChange={(value) => setAccountType(value as AccountType)}>
                  <div className="space-y-3">
                    <Label
                      htmlFor="renter"
                      className="flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer hover:bg-accent transition-colors"
                    >
                      <RadioGroupItem value="renter" id="renter" />
                      <User className="h-6 w-6 text-primary" />
                      <div className="flex-1">
                        <p className="font-semibold">Renter</p>
                        <p className="text-sm text-muted-foreground">Browse and rent items</p>
                      </div>
                    </Label>

                    <Label
                      htmlFor="owner"
                      className="flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer hover:bg-accent transition-colors"
                    >
                      <RadioGroupItem value="owner" id="owner" />
                      <Store className="h-6 w-6 text-primary" />
                      <div className="flex-1">
                        <p className="font-semibold">Owner</p>
                        <p className="text-sm text-muted-foreground">List and rent out your items</p>
                      </div>
                    </Label>

                    <Label
                      htmlFor="affiliate"
                      className="flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer hover:bg-accent transition-colors"
                    >
                      <RadioGroupItem value="affiliate" id="affiliate" />
                      <Users className="h-6 w-6 text-primary" />
                      <div className="flex-1">
                        <p className="font-semibold">Affiliate</p>
                        <p className="text-sm text-muted-foreground">Earn commissions by referring users</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Account"}
                </Button>
              </div>
            </form>
          </>
        )}

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
