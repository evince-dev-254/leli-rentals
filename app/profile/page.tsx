"use client"

import React, { useState, useEffect } from "react"
import { DatabaseService } from '@/lib/database-service'
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthContext } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  CreditCard, 
  Bell, 
  Camera,
  Save,
  Edit,
  Check,
  X,
  AlertTriangle,
  CheckCircle,
  Upload,
  FileText
} from "lucide-react"
import Link from "next/link"
import CloudinaryProfileUpload from "@/components/cloudinary-profile-upload"

export default function ProfilePage() {
  const { user, userProfile, isLoading } = useAuthContext()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [profileData, setProfileData] = useState({
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '+254700000000',
    location: 'Nairobi, Kenya',
    bio: 'I love renting items and sharing my own!',
    dateJoined: 'January 2024',
    verified: true
  })
  const [profilePicture, setProfilePicture] = useState(user?.photoURL || "")

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
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Get user account type and verification status
  const userAccountType = userProfile?.accountType || 'renter'
  const verificationStatus = {
    isVerified: userProfile?.isVerified || false,
    documentsSubmitted: userProfile?.verificationStatus === 'submitted',
    pendingReview: userProfile?.verificationStatus === 'pending',
    rejectionReason: userProfile?.verificationRejectionReason
  }

  const handleSave = async () => {
    // Save profile to database
    await saveProfileToDatabase()
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleProfilePictureChange = async (imageUrl: string) => {
    setProfilePicture(imageUrl)
    
    // Auto-save profile picture to database
    if (user) {
      try {
        await DatabaseService.updateUser(user.uid, {
          avatar: imageUrl
        })
        console.log('Profile picture saved to database:', imageUrl)
      } catch (error) {
        console.error('Error saving profile picture:', error)
      }
    }
  }

  const handleProfilePictureRemove = () => {
    setProfilePicture("")
    // Here you would typically remove from your backend/database
    console.log('Profile picture removed')
  }

  // Database integration functions
  const saveProfileToDatabase = async () => {
    if (!user) return
    
    try {
      const userData = {
        id: user.uid,
        email: profileData.email,
        name: `${profileData.firstName} ${profileData.lastName}`,
        avatar: profilePicture
      }
      
      const savedUser = await DatabaseService.createUser(userData)
      console.log('Profile saved to database:', savedUser)
      
      // Show success message
      alert('Profile saved successfully!')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Error saving profile. Please try again.')
    }
  }

  const loadProfileFromDatabase = async () => {
    if (!user) return
    
    try {
      const userData = await DatabaseService.getUserById(user.uid)
      if (userData) {
        // Update profile data with database values
        setProfileData(prev => ({
          ...prev,
          firstName: userData.name?.split(' ')[0] || prev.firstName,
          lastName: userData.name?.split(' ')[1] || prev.lastName,
          email: userData.email || prev.email
        }))
        
        if (userData.avatar) {
          setProfilePicture(userData.avatar)
        }
        
        console.log('Profile loaded from database:', userData)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  // Load profile data when component mounts
  useEffect(() => {
    if (user && !isLoading) {
      loadProfileFromDatabase()
    }
  }, [user, isLoading])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex flex-col items-center gap-4">
                <CloudinaryProfileUpload
                  currentImageUrl={profilePicture}
                  userName={user?.displayName || "User"}
                  onImageChange={handleProfilePictureChange}
                  onImageRemove={handleProfilePictureRemove}
                  className="w-full max-w-xs"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profileData.firstName} {profileData.lastName}
                        </h1>
                  {profileData.verified && (
                    <Badge className="bg-green-100 text-green-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-2">{profileData.email}</p>
                <p className="text-sm text-gray-500">Member since {profileData.dateJoined}</p>
                      </div>
                      
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                      <Check className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={saveProfileToDatabase}
                      className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save to Database
                    </Button>
                  </div>
                )}
                        </div>
                      </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                    />
                            </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                    />
                          </div>
                    </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={profileData.email}
                    disabled
                    className="bg-gray-50"
                                />
                  <p className="text-sm text-gray-500">Email cannot be changed</p>
                              </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                  id="phone"
                                  value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                                />
                              </div>

                <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                  id="location"
                                  value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!isEditing}
                                />
                              </div>

                <div className="space-y-2">
                              <Label htmlFor="bio">Bio</Label>
                              <Textarea
                                id="bio"
                                value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                                rows={4}
                                placeholder="Tell us about yourself..."
                              />
              </div>
            </CardContent>
          </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            {/* Identity Verification Section for Owner Accounts */}
            {userAccountType === "owner" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-orange-600" />
                    Identity Verification
                  </CardTitle>
                  <CardDescription>Required for owner accounts to list items for rent</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!verificationStatus.isVerified ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                      </div>
                          <div>
                            <h3 className="font-semibold">Verification Required</h3>
                            <p className="text-sm text-gray-600">
                              {verificationStatus.pendingReview 
                                ? "Your documents are under review" 
                                : "Upload your ID or passport to verify your identity"
                              }
                            </p>
                      </div>
                    </div>
                        <Button asChild className="bg-orange-600 hover:bg-orange-700">
                          <Link href="/verification">
                            <Upload className="h-4 w-4 mr-2" />
                            {verificationStatus.documentsSubmitted ? "Update Documents" : "Verify Identity"}
                          </Link>
                        </Button>
                      </div>

                      {verificationStatus.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-red-900 mb-1">Verification Rejected</h4>
                              <p className="text-sm text-red-800">{verificationStatus.rejectionReason}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Required Documents:</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Valid National ID or Passport</li>
                          <li>• Clear photos of document (front and back)</li>
                          <li>• Selfie holding the document</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <h4 className="font-semibold text-green-900">Identity Verified</h4>
                          <p className="text-sm text-green-800">
                            Your identity has been verified. You can now list items for rent.
                          </p>
                        </div>
                    </div>
                  </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
                <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and privacy</CardDescription>
                </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Password</h3>
                      <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600">Add an extra layer of security</p>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = '/profile/security'}
                    >
                      Enable 2FA
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Login Activity</h3>
                      <p className="text-sm text-gray-600">View recent login attempts</p>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = '/profile/security'}
                    >
                      View Activity
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
                  </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-green-600" />
                      <div>
                        <h3 className="font-semibold">SMS Notifications</h3>
                        <p className="text-sm text-gray-600">Receive updates via SMS</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                      </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-purple-600" />
                      <div>
                        <h3 className="font-semibold">Push Notifications</h3>
                        <p className="text-sm text-gray-600">Receive browser notifications</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = '/profile/settings'}
                    >
                      Configure
                    </Button>
                    </div>
                    </div>
                  </CardContent>
                </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Payments</CardTitle>
                <CardDescription>Manage your payment methods and billing history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
            <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">Payment Methods</h3>
                        <p className="text-sm text-gray-600">Manage your payment options</p>
                      </div>
                              </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = '/profile/billing'}
                    >
                      Manage
                    </Button>
                          </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <div>
                        <h3 className="font-semibold">Billing History</h3>
                        <p className="text-sm text-gray-600">View your payment history</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = '/profile/billing'}
                    >
                      View History
                    </Button>
            </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <div>
                        <h3 className="font-semibold">Invoices</h3>
                        <p className="text-sm text-gray-600">Download your invoices</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = '/profile/billing'}
                    >
                      Download
                    </Button>
                  </div>
                  </div>
                </CardContent>
              </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}