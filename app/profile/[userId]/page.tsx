"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Shield, 
  CheckCircle,
  Star,
  MessageCircle
} from "lucide-react"
import { userProfileService, UserProfile } from "@/lib/user-profile-service"
import Link from "next/link"

export default function PublicProfilePage() {
  const params = useParams()
  const userId = params.userId as string
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      if (userId) {
        const data = await userProfileService.getPublicProfile(userId)
        setProfile(data)
      }
      setLoading(false)
    }

    loadProfile()
  }, [userId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Profile Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This user profile doesn't exist or has been removed.
              </p>
              <Link href="/">
                <Button>Go Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <Avatar className="h-32 w-32 border-4 border-orange-500">
                <AvatarImage src={profile.avatar || ""} />
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white text-4xl font-bold">
                  {profile.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {profile.name}
                  </h1>
                  {profile.is_verified && (
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Account Type & Subscription */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  {profile.account_type && (
                    <Badge variant="outline" className="capitalize">
                      {profile.account_type}
                    </Badge>
                  )}
                  {profile.subscription_status && profile.subscription_status !== 'free' && (
                    <Badge className="bg-purple-500 text-white capitalize">
                      <Star className="h-3 w-3 mr-1" />
                      {profile.subscription_status}
                    </Badge>
                  )}
                </div>

                {/* Bio */}
                {profile.bio && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {profile.bio}
                  </p>
                )}

                {/* Location */}
                {profile.location && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 dark:text-gray-400 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                )}

                {/* Contact Button */}
                <Link href={`/messages?user=${userId}`}>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Account Type */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Shield className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Account Type</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                    {profile.account_type || 'Not Set'}
                  </p>
                </div>
              </div>

              {/* Subscription Status */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Star className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Subscription</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                    {profile.subscription_status || 'Free'}
                  </p>
                </div>
              </div>

              {/* Verification Status */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <CheckCircle className={`h-5 w-5 ${profile.is_verified ? 'text-green-500' : 'text-gray-400'}`} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Verification</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {profile.is_verified ? 'Verified' : 'Not Verified'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Listings Preview (if owner) */}
        {profile.account_type === 'owner' && (
          <Card>
            <CardHeader>
              <CardTitle>Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                No listings to display
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

