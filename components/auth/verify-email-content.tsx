"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Mail, Clock, Upload, FileText, AlertTriangle, ArrowRight, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function VerifyEmailContent() {
  const router = useRouter()
  const [step, setStep] = useState<"email" | "documents">("email")
  const [isVerifying, setIsVerifying] = useState(false)
  const [documentsUploaded, setDocumentsUploaded] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleResendEmail = async () => {
    setIsVerifying(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsVerifying(false)
  }

  const handleEmailVerified = () => {
    setStep("documents")
  }

  const handleSubmitDocuments = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    router.push("/dashboard")
  }

  const deadlineDate = new Date()
  deadlineDate.setDate(deadlineDate.getDate() + 5)

  if (step === "email") {
    return (
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
            <p className="text-muted-foreground">
              We have sent a verification link to your email address. Please check your inbox and click the link to
              verify.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={handleResendEmail}
              disabled={isVerifying}
            >
              {isVerifying ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
              Resend Verification Email
            </Button>

            <Button className="w-full bg-primary text-primary-foreground" onClick={handleEmailVerified}>
              I have Verified My Email
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">Check your spam folder if you do not see the email</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="glass-card rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Image src="/logo.svg" alt="Leli Rentals" width={150} height={40} className="h-10 w-auto dark:invert" />
          </Link>
          <h1 className="text-2xl font-bold mb-2">Complete Verification</h1>
          <p className="text-muted-foreground">Submit your verification documents to activate your account</p>
        </div>

        {/* Deadline Warning */}
        <Card className="mb-8 border-orange-500/30 bg-orange-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-orange-500/10">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-600 mb-1">Verification Required</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  You must submit verification documents within 5 days to avoid account suspension.
                </p>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">
                    Deadline:{" "}
                    {deadlineDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Documents Uploaded</span>
            <span className="text-sm text-muted-foreground">{documentsUploaded}/2</span>
          </div>
          <Progress value={(documentsUploaded / 2) * 100} className="h-2" />
        </div>

        {/* Document Upload Forms */}
        <div className="space-y-6">
          {/* Document 1: ID */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Government-Issued ID
              </CardTitle>
              <CardDescription>
                Upload a clear photo of your National ID, Passport, or Driver&apos;s License
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id-type">Document Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="national_id">National ID</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="drivers_license">Driver&apos;s License</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="id-upload">Upload Document</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Input
                    id="id-upload"
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={() => setDocumentsUploaded((prev) => Math.min(prev + 1, 2))}
                  />
                  <label htmlFor="id-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG or PDF (max 5MB)</p>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document 2: Business Registration (for owners) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Business Registration (Optional)
              </CardTitle>
              <CardDescription>
                If you have a registered business, upload your business registration certificate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Input
                  id="business-upload"
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={() => setDocumentsUploaded((prev) => Math.min(prev + 1, 2))}
                />
                <label htmlFor="business-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG or PDF (max 5MB)</p>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex gap-4">
          <Button variant="outline" className="flex-1 bg-transparent" asChild>
            <Link href="/dashboard">Skip for Now</Link>
          </Button>
          <Button
            className="flex-1 bg-primary text-primary-foreground"
            onClick={handleSubmitDocuments}
            disabled={documentsUploaded === 0 || isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Submit for Verification
          </Button>
        </div>

        {/* Info */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          Your documents will be reviewed within 24-48 hours. You will receive an email once verified.
        </p>
      </div>
    </div>
  )
}
