"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Message } from "@/components/ui/message"
import { Loader2, Mail, CheckCircle } from "lucide-react"
import { sendCustomOtp, verifyCustomOtp } from "@/lib/actions/verify-actions"

export default function TestOtpPage() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"send" | "verify" | "success">("send")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Use the custom OTP system (handles user creation internally)
      const result = await sendCustomOtp(email)
      
      if (!result.success) {
        throw new Error(result.error || "Failed to send OTP")
      }

      console.log("🧪 OTP sent to:", email)
      console.log("📧 Check your email for the verification code")
      
      setSuccess("OTP sent successfully! Check your email and console (dev mode)")
      setStep("verify")
      
    } catch (err: any) {
      setError(err.message || "Failed to send OTP")
      console.error("OTP send error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const result = await verifyCustomOtp(email, otp)
      
      if (!result.success) {
        throw new Error(result.error || "Invalid OTP")
      }

      setSuccess("OTP verified successfully! ✅ You are now logged in.")
      setStep("success")
      console.log("✅ OTP verified for:", email)
      
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP")
      console.error("OTP verification error:", err)
    } finally {
      setLoading(false)
    }
  }

  const resetTest = () => {
    setStep("send")
    setEmail("")
    setOtp("")
    setError("")
    setSuccess("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 gradient-mesh">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">OTP Test Page</CardTitle>
          <CardDescription>
            Test the custom email verification system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "send" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="test@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              {error && (
                <Message type="error" message={error} />
              )}
              
              {success && (
                <Message type="success" message={success} />
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          )}

          {step === "verify" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter 6-digit code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Check your email for the verification code
                </p>
              </div>
              
              {error && (
                <Message type="error" message={error} />
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground"
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={resetTest}
              >
                Start Over
              </Button>
            </form>
          )}

          {step === "success" && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                  OTP Verification Successful!
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  The email verification flow is working correctly.
                </p>
              </div>
              
              <Button 
                onClick={resetTest}
                className="w-full bg-primary text-primary-foreground"
              >
                Test Again
              </Button>
            </div>
          )}

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold text-sm mb-2">💡 How This Works:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Uses existing custom OTP system</li>
              <li>• Sends emails through Resend service</li>
              <li>• Stores OTP codes in user metadata</li>
              <li>• In development, OTP is logged to console</li>
              <li>• Check your email for the 6-digit code</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}