"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User, MapPin, Phone, Globe, Twitter, Facebook, Linkedin,
  Calendar, Star, MessageSquare, List, Settings, CreditCard,
  Bell, Shield, CheckCircle2, AlertCircle
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isLoaded || !mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-800 rounded-full mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  // Get user metadata
  const accountType = (user.unsafeMetadata?.accountType as string) || 'renter'
  const subscription = (user.unsafeMetadata?.subscription as string) || 'free'
  const isVerified = (user.unsafeMetadata?.verified as boolean) || false
  const joinedDate = user.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : 'Unknown'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Sidebar - Profile Overview */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="overflow-hidden border-none shadow-lg">
              <div className="h-32 bg-linear-to-r from-pink-500 to-purple-600"></div>
              <CardContent className="pt-0 relative">
                <div className="flex justify-center -mt-16 mb-4">
                  <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-800 shadow-md">
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback className="text-4xl bg-purple-100 text-purple-600">
                      {user.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="capitalize">
                      {accountType}
                    </Badge>
                    {isVerified && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Member Since</span>
                    <span className="font-medium">{joinedDate}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Account Status</span>
                    <span className="flex items-center text-green-600 dark:text-green-400 font-medium">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      Active
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Subscription</span>
                    <span className="capitalize font-medium">{subscription} Plan</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Management Menu */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Account Management</CardTitle>
                <CardDescription>Manage your settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col">
                  <Link href="/profile/settings" className="flex items-center px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-l-2 border-transparent hover:border-pink-500">
                    <Settings className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="font-medium text-sm">Account Settings</p>
                      <p className="text-xs text-gray-500">Security, Privacy & More</p>
                    </div>
                  </Link>
                  <Separator />
                  <Link href="/profile/billing" className="flex items-center px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-l-2 border-transparent hover:border-pink-500">
                    <CreditCard className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="font-medium text-sm">Billing & Plans</p>
                      <p className="text-xs text-gray-500">Manage subscription</p>
                    </div>
                  </Link>
                  <Separator />
                  <Link href="/profile/notifications" className="flex items-center px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-l-2 border-transparent hover:border-pink-500">
                    <Bell className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="font-medium text-sm">Notifications</p>
                      <p className="text-xs text-gray-500">Configure alerts</p>
                    </div>
                  </Link>

                  {accountType === 'affiliate' && (
                    <>
                      <Separator />
                      <Link href="/dashboard/affiliate" className="flex items-center px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-l-2 border-transparent hover:border-pink-500">
                        <Shield className="w-5 h-5 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium text-sm">Affiliate Dashboard</p>
                          <p className="text-xs text-gray-500">Track earnings & referrals</p>
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Forms & Stats */}
          <div className="lg:col-span-8 space-y-6">

            {/* Activity Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white dark:bg-gray-800 border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2 text-blue-600 dark:text-blue-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">15</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Total Bookings</span>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="h-10 w-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-2 text-pink-600 dark:text-pink-400">
                    <Star className="h-5 w-5" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">32</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Favorites</span>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2 text-purple-600 dark:text-purple-400">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">24</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Reviews</span>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-2 text-orange-600 dark:text-orange-400">
                    <List className="h-5 w-5" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">0</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Listings</span>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="w-full justify-start bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                <TabsTrigger value="personal" className="flex-1 md:flex-none">Personal Information</TabsTrigger>
                <TabsTrigger value="social" className="flex-1 md:flex-none">Social Media</TabsTrigger>
                <TabsTrigger value="preferences" className="flex-1 md:flex-none">Preferences</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and profile information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="firstName" defaultValue={user.firstName || ""} className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="lastName" defaultValue={user.lastName || ""} className="pl-10" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" defaultValue={user.primaryEmailAddress?.emailAddress || ""} disabled className="bg-gray-50 dark:bg-gray-800 text-gray-500" />
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" /> Email cannot be changed
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="phone" defaultValue="+254700000000" className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="location" defaultValue="Nairobi, Kenya" className="pl-10" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        defaultValue="I love renting items and sharing my own!"
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t pt-6">
                    <Button className="bg-pink-600 hover:bg-pink-700 text-white">Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="social">
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle>Social Media & Website</CardTitle>
                    <CardDescription>Add links to your social profiles and personal website</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="website" defaultValue="https://yourwebsite.com" className="pl-10" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter (X)</Label>
                      <div className="relative">
                        <Twitter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="twitter" defaultValue="@yourusername" className="pl-10" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook</Label>
                      <div className="relative">
                        <Facebook className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="facebook" defaultValue="facebook.com/yourprofile" className="pl-10" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="linkedin" defaultValue="linkedin.com/in/yourprofile" className="pl-10" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t pt-6">
                    <Button className="bg-pink-600 hover:bg-pink-700 text-white">Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="preferences">
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Manage your notification and display preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <Settings className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>Preference settings coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
