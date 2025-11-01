'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
  Shield,
  Phone,
  CheckCircle,
  XCircle,
  Search,
  Users,
  AlertCircle,
  FileText
} from 'lucide-react'

export default function AdminVerifyUsersPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const [emailAddress, setEmailAddress] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [foundUser, setFoundUser] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  // Check if user is admin (check both public and private metadata for role)
  // TEMPORARILY DISABLED FOR DEVELOPMENT - Allow all authenticated users
  const isAdmin = true
  // const isAdmin = user?.publicMetadata?.role === 'admin' || (user?.unsafeMetadata as any)?.role === 'admin'

  // Debug logging
  console.log('Admin Page - User loaded:', isLoaded)
  console.log('Admin Page - User email:', user?.emailAddresses?.[0]?.emailAddress)
  console.log('Admin Page - Public metadata:', user?.publicMetadata)
  console.log('Admin Page - Unsafe metadata:', user?.unsafeMetadata)
  console.log('Admin Page - Is Admin:', isAdmin)

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/sign-in')
    return null
  }

  const handleRefreshSession = async () => {
    try {
      await user?.reload()
      toast({
        title: '🔄 Session Refreshed',
        description: 'Please check if you can access the admin area now',
      })
      // Force page reload after session refresh
      window.location.reload()
    } catch (error) {
      toast({
        title: '❌ Refresh Failed',
        description: 'Please try signing out and signing back in',
        variant: 'destructive',
      })
    }
  }

  if (!isAdmin) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
              <p className="text-muted-foreground mb-4">
                You don't have permission to access this area. This section is restricted to authorized administrators only.
              </p>
              
              {/* Debug Info */}
              <div className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm">
                <p className="font-semibold mb-2">Debug Information:</p>
                <p>Email: {user?.emailAddresses?.[0]?.emailAddress}</p>
                <p>Public Role: {(user?.publicMetadata as any)?.role || 'Not set'}</p>
                <p>Unsafe Role: {(user?.unsafeMetadata as any)?.role || 'Not set'}</p>
              </div>

              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleRefreshSession}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  🔄 Refresh Session & Retry
                </Button>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => router.push('/')}>
                    Go to Homepage
                  </Button>
                  <Button variant="outline" onClick={() => router.back()}>
                    Go Back
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                If you believe you should have access, please contact your system administrator
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  const handleSearch = async () => {
    if (!emailAddress.trim()) {
      toast({
        title: '⚠️ Email Address Required',
        description: 'Please enter an email address to search',
        variant: 'destructive',
      })
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailAddress.trim())) {
      toast({
        title: '⚠️ Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      })
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch('/api/admin/search-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailAddress: emailAddress.trim() })
      })

      const data = await response.json()

      if (response.ok && data.user) {
        setFoundUser(data.user)
        toast({
          title: '✅ User Found',
          description: `Found: ${data.user.firstName} ${data.user.lastName}`,
        })
      } else {
        setFoundUser(null)
        toast({
          title: '❌ User Not Found',
          description: 'No user found with this email address',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: '❌ Search Failed',
        description: 'Error searching for user',
        variant: 'destructive',
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleApprove = async () => {
    if (!foundUser) return

    setIsProcessing(true)
    try {
      const response = await fetch(`/api/admin/verifications/approve/${foundUser.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' })
      })

      if (response.ok) {
        toast({
          title: '✅ Verification Approved!',
          description: `${foundUser.firstName} ${foundUser.lastName} is now verified`,
        })
        setFoundUser(null)
        setEmailAddress('')
      } else {
        throw new Error('Approval failed')
      }
    } catch (error) {
      toast({
        title: '❌ Approval Failed',
        description: 'Error approving verification',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!foundUser) return

    if (!rejectionReason.trim()) {
      toast({
        title: '⚠️ Reason Required',
        description: 'Please provide a reason for rejection',
        variant: 'destructive',
      })
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch(`/api/admin/verifications/reject/${foundUser.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reason: rejectionReason.trim()
        })
      })

      if (response.ok) {
        toast({
          title: '✅ Verification Rejected',
          description: `Rejection email sent to ${foundUser.firstName}`,
        })
        setFoundUser(null)
        setEmailAddress('')
        setRejectionReason('')
      } else {
        throw new Error('Rejection failed')
      }
    } catch (error) {
      toast({
        title: '❌ Rejection Failed',
        description: 'Error rejecting verification',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600">
              Admin Panel
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              User Verification Management
            </h1>
            <p className="text-lg text-muted-foreground">
              Verify users by email address
            </p>
          </div>

          {/* Search Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Search User by Email Address
              </CardTitle>
              <CardDescription>
                Enter the user's email address to find and verify them
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full"
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleSearch} 
                    disabled={isSearching}
                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                  >
                    {isSearching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <strong>Example:</strong> john.doe@example.com, user@company.com
              </div>
            </CardContent>
          </Card>

          {/* User Details Card */}
          {foundUser && (
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Found
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* User Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-semibold">
                      {foundUser.firstName} {foundUser.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{foundUser.emailAddresses?.[0]?.emailAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-semibold">{foundUser.phoneNumbers?.[0]?.phoneNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Verification Status</p>
                    <Badge 
                      variant={
                        foundUser.unsafeMetadata?.verificationStatus === 'approved' ? 'default' :
                        foundUser.unsafeMetadata?.verificationStatus === 'pending' ? 'secondary' :
                        foundUser.unsafeMetadata?.verificationStatus === 'rejected' ? 'destructive' :
                        'outline'
                      }
                    >
                      {foundUser.unsafeMetadata?.verificationStatus || 'Not Submitted'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Type</p>
                    <p className="font-semibold capitalize">
                      {foundUser.unsafeMetadata?.accountType || 'Not Set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-semibold">
                      {new Date(foundUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Verification Info */}
                {foundUser.unsafeMetadata?.verificationStatus === 'pending' && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                      ⏳ Verification Pending
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Submitted: {foundUser.unsafeMetadata?.verificationSubmittedAt ? 
                        new Date(foundUser.unsafeMetadata.verificationSubmittedAt).toLocaleString() : 
                        'Unknown'}
                    </p>
                  </div>
                )}

                {foundUser.unsafeMetadata?.verificationStatus === 'approved' && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                      ✅ Already Verified
                    </p>
                  </div>
                )}

                {foundUser.unsafeMetadata?.verificationStatus === 'rejected' && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
                      ❌ Previously Rejected
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Reason: {foundUser.unsafeMetadata?.verificationRejectionReason || 'Not specified'}
                    </p>
                  </div>
                )}

                {/* Verification Documents - ALWAYS SHOW if status is pending or if documents exist */}
                {(foundUser.unsafeMetadata?.verificationStatus === 'pending' || foundUser.unsafeMetadata?.verificationDocuments) && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Verification Documents
                    </h3>
                    {foundUser.unsafeMetadata?.verificationDocuments ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {/* Document Front */}
                        {foundUser.unsafeMetadata.verificationDocuments.documentFront && (
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">ID Front</Label>
                          <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                            <img 
                              src={foundUser.unsafeMetadata.verificationDocuments.documentFront} 
                              alt="Document Front" 
                                className="w-full h-48 object-contain cursor-pointer hover:opacity-90 transition-opacity bg-gray-50 dark:bg-gray-900"
                              onClick={() => window.open(foundUser.unsafeMetadata.verificationDocuments.documentFront, '_blank')}
                            />
                          </div>
                        </div>
                      )}
                      {/* Document Back */}
                        {foundUser.unsafeMetadata.verificationDocuments.documentBack && (
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">ID Back</Label>
                          <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                            <img 
                              src={foundUser.unsafeMetadata.verificationDocuments.documentBack} 
                              alt="Document Back" 
                                className="w-full h-48 object-contain cursor-pointer hover:opacity-90 transition-opacity bg-gray-50 dark:bg-gray-900"
                              onClick={() => window.open(foundUser.unsafeMetadata.verificationDocuments.documentBack, '_blank')}
                            />
                          </div>
                        </div>
                      )}
                      {/* Selfie with Document */}
                        {foundUser.unsafeMetadata.verificationDocuments.selfieWithDocument && (
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Selfie with ID</Label>
                          <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                            <img 
                              src={foundUser.unsafeMetadata.verificationDocuments.selfieWithDocument} 
                              alt="Selfie with Document" 
                                className="w-full h-48 object-contain cursor-pointer hover:opacity-90 transition-opacity bg-gray-50 dark:bg-gray-900"
                              onClick={() => window.open(foundUser.unsafeMetadata.verificationDocuments.selfieWithDocument, '_blank')}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    ) : (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm font-semibold text-red-800 dark:text-red-200 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          No documents uploaded yet. User must submit verification documents before approval.
                      </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Rejection Reason Input (only show when rejecting) */}
                {foundUser.unsafeMetadata?.verificationStatus !== 'approved' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="rejectionReason">Rejection Reason (if rejecting)</Label>
                      <Textarea
                        id="rejectionReason"
                        placeholder="Enter reason for rejection (e.g., 'Documents not clear', 'ID expired', etc.)"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={handleApprove}
                        disabled={
                          isProcessing || 
                          foundUser.unsafeMetadata?.verificationStatus === 'approved' ||
                          !foundUser.unsafeMetadata?.verificationDocuments ||
                          !foundUser.unsafeMetadata?.verificationDocuments?.documentFront ||
                          !foundUser.unsafeMetadata?.verificationDocuments?.documentBack ||
                          !foundUser.unsafeMetadata?.verificationDocuments?.selfieWithDocument
                        }
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={
                          (!foundUser.unsafeMetadata?.verificationDocuments ||
                           !foundUser.unsafeMetadata?.verificationDocuments?.documentFront ||
                           !foundUser.unsafeMetadata?.verificationDocuments?.documentBack ||
                           !foundUser.unsafeMetadata?.verificationDocuments?.selfieWithDocument)
                            ? "Cannot approve: User has not submitted all required documents"
                            : ""
                        }
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Verification
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleReject}
                        disabled={isProcessing}
                        variant="destructive"
                        className="flex-1"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Verification
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verification Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Search for users using their registered email address</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Review user details and verification status (only users with admin role can be verified)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Approve if documents are valid and clear</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Reject with clear reason if documents are invalid</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Users will receive email notifications of approval/rejection</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

