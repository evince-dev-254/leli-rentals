"use client"

import React, { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuthContext } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { 
  Shield, 
  Upload, 
  Camera, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  ArrowLeft,
  Save,
  Eye,
  X
} from "lucide-react"
import Link from "next/link"

export default function VerificationPage() {
  const { user, isLoading } = useAuthContext()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  // Redirect if not authenticated
  if (!isLoading && !user) {
    router.push("/login")
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const [formData, setFormData] = useState({
    documentType: "",
    documentNumber: "",
    fullName: "",
    dateOfBirth: "",
    nationality: "",
    address: "",
    phoneNumber: "",
    emergencyContact: "",
    emergencyPhone: "",
    
    // Document uploads
    documentFront: null as File | null,
    documentBack: null as File | null,
    selfieWithDocument: null as File | null,
    
    // Additional info
    additionalInfo: "",
    agreeToTerms: false
  })

  const documentTypes = [
    "National ID",
    "Passport",
    "Driver's License"
  ]

  const nationalities = [
    "Kenyan",
    "Ugandan", 
    "Tanzanian",
    "Rwandan",
    "Burundian",
    "Other"
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    router.push("/dashboard")
  }

  const isFormValid = formData.documentType && formData.documentNumber && formData.fullName && 
                     formData.dateOfBirth && formData.nationality && formData.documentFront && 
                     formData.documentBack && formData.selfieWithDocument && formData.agreeToTerms

  const steps = [
    { id: 1, title: "Personal Info", description: "Basic information" },
    { id: 2, title: "Document Upload", description: "ID verification" },
    { id: 3, title: "Review", description: "Confirm details" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Identity Verification</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Verify your identity to access owner features and list items for rent
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.id}
                </div>
                <div className="ml-2">
                  <span className="text-sm font-medium text-gray-900">{step.title}</span>
                  <p className="text-xs text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && <div className="w-8 h-0.5 bg-gray-200 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Provide your basic details for verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="documentType">Document Type *</Label>
                  <Select value={formData.documentType} onValueChange={(value) => handleInputChange("documentType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentNumber">Document Number *</Label>
                  <Input
                    id="documentNumber"
                    placeholder="Enter document number"
                    value={formData.documentNumber}
                    onChange={(e) => handleInputChange("documentNumber", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name (as on document) *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality *</Label>
                  <Select value={formData.nationality} onValueChange={(value) => handleInputChange("nationality", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      {nationalities.map((nationality) => (
                        <SelectItem key={nationality} value={nationality}>{nationality}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Current Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your current address"
                  rows={3}
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="+254700000000"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    placeholder="Emergency contact name"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  placeholder="+254700000000"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Document Upload */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Document Upload</CardTitle>
              <CardDescription>Upload clear photos of your identity document</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Document Front */}
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Front</h3>
                    <p className="text-gray-600 mb-4">Upload the front side of your document</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload("documentFront", e.target.files?.[0] || null)}
                      className="hidden"
                      id="document-front"
                    />
                    <Button asChild>
                      <label htmlFor="document-front" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Front
                      </label>
                    </Button>
                    {formData.documentFront && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          {formData.documentFront.name}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Document Back */}
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Back</h3>
                    <p className="text-gray-600 mb-4">Upload the back side of your document</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload("documentBack", e.target.files?.[0] || null)}
                      className="hidden"
                      id="document-back"
                    />
                    <Button asChild>
                      <label htmlFor="document-back" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Back
                      </label>
                    </Button>
                    {formData.documentBack && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          {formData.documentBack.name}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Selfie with Document */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Selfie with Document</h3>
                  <p className="text-gray-600 mb-4">Take a selfie holding your document next to your face</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload("selfieWithDocument", e.target.files?.[0] || null)}
                    className="hidden"
                    id="selfie-document"
                  />
                  <Button asChild>
                    <label htmlFor="selfie-document" className="cursor-pointer">
                      <Camera className="h-4 w-4 mr-2" />
                      Take Selfie
                    </label>
                  </Button>
                  {formData.selfieWithDocument && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        {formData.selfieWithDocument.name}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Upload Guidelines</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Ensure all text is clearly readable</li>
                      <li>• Avoid glare, shadows, or blur</li>
                      <li>• Include all corners of the document</li>
                      <li>• Use good lighting for photos</li>
                      <li>• File size should be under 10MB</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Review Your Information</CardTitle>
              <CardDescription>Please review all details before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><strong>Document Type:</strong> {formData.documentType || "Not provided"}</p>
                    <p><strong>Document Number:</strong> {formData.documentNumber || "Not provided"}</p>
                    <p><strong>Full Name:</strong> {formData.fullName || "Not provided"}</p>
                    <p><strong>Date of Birth:</strong> {formData.dateOfBirth || "Not provided"}</p>
                    <p><strong>Nationality:</strong> {formData.nationality || "Not provided"}</p>
                    <p><strong>Address:</strong> {formData.address || "Not provided"}</p>
                    <p><strong>Phone:</strong> {formData.phoneNumber || "Not provided"}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Uploaded Documents</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><strong>Document Front:</strong> {formData.documentFront?.name || "Not uploaded"}</p>
                    <p><strong>Document Back:</strong> {formData.documentBack?.name || "Not uploaded"}</p>
                    <p><strong>Selfie with Document:</strong> {formData.selfieWithDocument?.name || "Not uploaded"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                      I agree to the verification process and confirm that all information provided is accurate. 
                      I understand that providing false information may result in account suspension.
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-1">Verification Process</h4>
                    <p className="text-sm text-yellow-800">
                      Your documents will be reviewed within 1-3 business days. You'll receive an email notification 
                      once the verification is complete. During this time, you can still browse and book items, 
                      but you won't be able to list items for rent.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1)
              } else {
                router.push("/dashboard")
              }
            }}
          >
            {currentStep === 1 ? "Cancel" : "Previous"}
          </Button>
          
          <div className="flex gap-4">
            {currentStep < 3 ? (
              <Button 
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!isFormValid}
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Submit Verification
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
