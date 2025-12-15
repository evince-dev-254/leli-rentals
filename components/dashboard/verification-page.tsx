"use client"

import { useRef, useCallback, useState, useEffect } from "react"
import Webcam from "react-webcam"
import { ShieldCheck, Upload, FileText, Clock, CheckCircle, AlertTriangle, X, Loader2, Camera, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { getVerifications, uploadVerification, updateProfile } from "@/lib/actions/dashboard-actions"
import { toast } from "sonner"
import { ImageUpload } from "@/components/ui/image-upload"

const IMAGEKIT_PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
const IMAGEKIT_URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT

export function VerificationPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedType, setSelectedType] = useState("id_card")
  const [frontUrl, setFrontUrl] = useState("")
  const [backUrl, setBackUrl] = useState("")
  const [selfieUrl, setSelfieUrl] = useState("")

  // New Fields
  const [docNumber, setDocNumber] = useState("")
  const [dob, setDob] = useState("")
  const [nokName, setNokName] = useState("")
  const [nokRelation, setNokRelation] = useState("")
  const [nokPhone, setNokPhone] = useState("")

  const [showCamera, setShowCamera] = useState(false)
  const webcamRef = useRef<Webcam>(null)
  const [selfieUploading, setSelfieUploading] = useState(false)

  const fetchDocuments = async () => {
    try {
      console.log("fetchDocuments: Starting...")
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      console.log("fetchDocuments: Auth User:", user?.id, "Error:", authError)

      if (user) {
        // Use API route instead of Server Action for reliability
        const res = await fetch('/api/verifications')
        if (res.ok) {
          const data = await res.json()
          setDocuments(data || [])
        } else {
          console.error("Failed to fetch verifications API")
        }

        // Fetch Profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        if (profile) {
          setDob(profile.date_of_birth || "")
          setNokName(profile.next_of_kin_name || "")
          setNokRelation(profile.next_of_kin_relationship || "")
          setNokPhone(profile.next_of_kin_phone || "")
        }
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleUpload = async () => {
    if (!frontUrl || !backUrl || !selfieUrl) return

    setUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Update Profile first
      await updateProfile(user.id, {
        date_of_birth: dob,
        next_of_kin_name: nokName,
        next_of_kin_relationship: nokRelation,
        next_of_kin_phone: nokPhone
      })

      await uploadVerification(user.id, frontUrl, backUrl, selfieUrl, selectedType, docNumber)

      toast.success("Verification submitted successfully")

      // Refresh list
      await fetchDocuments()
      setFrontUrl("")
      setBackUrl("")
      setSelfieUrl("")
      setDocNumber("")

    } catch (error) {
      console.error("Error uploading:", error)
    } finally {
      setUploading(false)
    }
  }

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setSelfieUploading(true)
      try {
        // Get Auth Params
        const authRes = await fetch("/api/imagekit/auth")
        if (!authRes.ok) throw new Error("Failed to get auth params")
        const { signature, expire, token } = await authRes.json()

        // Convert Base64 to Blob
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });

        // Upload to ImageKit
        const formData = new FormData()
        formData.append("file", file)
        formData.append("fileName", "selfie.jpg")
        formData.append("publicKey", IMAGEKIT_PUBLIC_KEY || "")
        formData.append("signature", signature)
        formData.append("expire", expire)
        formData.append("token", token)
        formData.append("folder", "/verification-docs")

        const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
          method: "POST",
          body: formData
        })

        if (!uploadRes.ok) {
          const errorText = await uploadRes.text()
          throw new Error(`Upload failed: ${errorText}`)
        }

        const data = await uploadRes.json()
        setSelfieUrl(data.url)
        setShowCamera(false)

      } catch (error) {
        console.error("Selfie upload error:", error)
      } finally {
        setSelfieUploading(false)
      }
    }
  }, [webcamRef])

  const deadlineDate = new Date()
  deadlineDate.setDate(deadlineDate.getDate() + 3)

  const isVerified = documents.some(d => d.status === 'approved')
  const isPending = documents.some(d => d.status === 'pending')
  const isRejected = documents.some(d => d.status === 'rejected')
  const hasDocuments = documents.length > 0

  let statusTitle = "Verification Required"
  let statusDesc = "Please submit your documents to verify your identity."
  let statusColor = "orange"
  let StatusIcon = AlertTriangle

  if (isVerified) {
    statusTitle = "Verification Complete"
    statusDesc = "Your account is fully verified. You can now list items and accept bookings."
    statusColor = "green"
    StatusIcon = CheckCircle
  } else if (isPending) {
    statusTitle = "Verification in Progress"
    statusDesc = "Your documents have been received and are currently under review. This process usually takes up to 5 business days."
    statusColor = "blue"
    StatusIcon = Clock
  } else if (isRejected) {
    statusTitle = "Verification Failed"
    statusDesc = "Please check the rejection reason below and re-submit your documents."
    statusColor = "red"
    StatusIcon = X
  }

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Verification</h1>
        <p className="text-muted-foreground">Complete your account verification to start listing</p>
      </div>

      {/* Status Card */}
      <Card className={`border-l-4 border-l-${statusColor}-500 bg-${statusColor}-500/5`}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full bg-${statusColor}-500/10`}>
              <StatusIcon className={`h-6 w-6 text-${statusColor}-500`} />
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold mb-1 text-${statusColor}-600`}>
                {statusTitle}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {statusDesc}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Personal Info & Next of Kin */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your details as per ID</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Next of Kin</CardTitle>
            <CardDescription>Emergency contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                placeholder="e.g. Jane Doe"
                value={nokName}
                onChange={(e) => setNokName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Relationship</Label>
                <Input
                  placeholder="e.g. Spouse"
                  value={nokRelation}
                  onChange={(e) => setNokRelation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  placeholder="e.g. +254 712 345 678"
                  value={nokPhone}
                  onChange={(e) => setNokPhone(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submitted Documents */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Submitted Documents</CardTitle>
          <CardDescription>Documents you have uploaded for verification</CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No documents submitted yet.</p>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="space-y-2">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium capitalize">{doc.document_type.replace('_', ' ')}</p>
                        <div className="flex flex-col gap-1">
                          <a href={doc.document_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">View Front</a>
                          {doc.back_image_url && <a href={doc.back_image_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">View Back</a>}
                          {doc.selfie_image_url && <a href={doc.selfie_image_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">View Selfie</a>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`
                        ${doc.status === 'approved' ? 'bg-green-500' : ''}
                        ${doc.status === 'pending' ? 'bg-blue-500' : ''}
                        ${doc.status === 'rejected' ? 'bg-red-500' : ''}
                      `}>
                        {doc.status}
                      </Badge>
                    </div>
                  </div>
                  {doc.status === 'rejected' && doc.rejection_reason && (
                    <div className="p-3 bg-red-500/10 rounded-lg text-sm text-red-600 border border-red-500/20">
                      <span className="font-semibold">Reason:</span> {doc.rejection_reason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload New Document */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>submit Documents</CardTitle>
          <CardDescription>Submit required verification documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Document Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id_card">National ID</SelectItem>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="drivers_license">Driver&apos;s License</SelectItem>
                <SelectItem value="business_license">Business License</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Document Number</Label>
            <Input
              placeholder="Enter ID/Passport Number"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Front of Document</Label>
              <ImageUpload
                folder="/verification-docs"
                onSuccess={(res) => setFrontUrl(res.url)}
                onError={(err) => console.error("Front upload error", err)}
                className="w-full"
                buttonText="Upload Front"
                variant="outline"
                maxSizeMB={10}
              />
              {frontUrl && <p className="text-xs text-green-600">Front uploaded</p>}
            </div>

            <div className="space-y-2">
              <Label>Back of Document</Label>
              <ImageUpload
                folder="/verification-docs"
                onSuccess={(res) => setBackUrl(res.url)}
                onError={(err) => console.error("Back upload error", err)}
                className="w-full"
                buttonText="Upload Back"
                variant="outline"
                maxSizeMB={10}
              />
              {backUrl && <p className="text-xs text-green-600">Back uploaded</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <Label>Selfie Holding ID</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCamera(!showCamera)}
                  type="button"
                >
                  {showCamera ? <><Upload className="w-4 h-4 mr-2" /> Upload File</> : <><Camera className="w-4 h-4 mr-2" /> Use Camera</>}
                </Button>
              </div>

              {showCamera ? (
                <div className="relative rounded-lg overflow-hidden border bg-black aspect-video flex items-center justify-center">
                  {!selfieUrl ? (
                    <>
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                        videoConstraints={{ facingMode: "user" }}
                        mirrored={true}
                        playsInline={true}
                        muted={true}
                        onUserMediaError={(e) => console.error("Webcam error:", e)}
                      />
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <Button onClick={capture} disabled={selfieUploading}>
                          {selfieUploading ? <Loader2 className="animate-spin mr-2" /> : <Camera className="mr-2 h-4 w-4" />}
                          {selfieUploading ? "Uploading..." : "Take Photo"}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="relative w-full h-full">
                      <img src={selfieUrl} alt="Selfie" className="w-full h-full object-cover" />
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelfieUrl("")}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" /> Retake
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <ImageUpload
                    folder="/verification-docs"
                    onSuccess={(res) => setSelfieUrl(res.url)}
                    onError={(err) => console.error("Selfie upload error", err)}
                    className="w-full"
                    buttonText="Upload Selfie"
                    variant="outline"
                    maxSizeMB={10}
                  />
                  {selfieUrl && (
                    <div className="mt-2 relative aspect-video w-40 rounded-md overflow-hidden border">
                      <img src={selfieUrl} alt="Selfie" className="w-full h-full object-cover" />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => setSelfieUrl("")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </>
              )}
              {!selfieUrl && !showCamera && <p className="text-xs text-green-600 hidden">Selfie uploaded</p>}
              {selfieUrl && !showCamera && <p className="text-xs text-green-600">Selfie ready</p>}
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleUpload}
            disabled={uploading || !frontUrl || !backUrl || !selfieUrl || !docNumber || !dob}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Verification"
            )}
          </Button>

          <p className="text-xs text-muted-foreground mt-2 text-center">PNG, JPG, PDF (max 10MB each)</p>
        </CardContent>
      </Card>
    </div >
  )
}
