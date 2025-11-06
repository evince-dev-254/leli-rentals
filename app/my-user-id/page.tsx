'use client'

import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function MyUserIdPage() {
  const { user, isLoaded } = useUser()
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isLoaded) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto p-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Not Authenticated</CardTitle>
            <CardDescription>
              Please sign in to view your user ID
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Your Clerk User ID</CardTitle>
          <CardDescription>
            Use this ID for testing API endpoints
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User ID */}
          <div className="space-y-2">
            <label className="text-sm font-medium">User ID:</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-3 bg-muted rounded-lg text-sm font-mono break-all">
                {user.id}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(user.id)}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email:</label>
            <div className="p-3 bg-muted rounded-lg text-sm">
              {user.primaryEmailAddress?.emailAddress || 'No email'}
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Name:</label>
            <div className="p-3 bg-muted rounded-lg text-sm">
              {user.fullName || user.firstName || 'No name'}
            </div>
          </div>

          {/* Account Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Account Type:</label>
            <div className="p-3 bg-muted rounded-lg text-sm">
              {(user.unsafeMetadata?.accountType as string) || 'Not set'}
            </div>
          </div>

          {/* API Test URLs */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Test API Endpoints:</label>
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-lg text-xs font-mono break-all">
                <a 
                  href={`/api/owner/stats?ownerId=${user.id}`}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  /api/owner/stats?ownerId={user.id}
                </a>
              </div>
              <div className="p-3 bg-muted rounded-lg text-xs font-mono break-all">
                <a 
                  href={`/api/owner/listings?ownerId=${user.id}`}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  /api/owner/listings?ownerId={user.id}
                </a>
              </div>
              <div className="p-3 bg-muted rounded-lg text-xs font-mono break-all">
                <a 
                  href={`/api/owner/bookings?ownerId=${user.id}`}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  /api/owner/bookings?ownerId={user.id}
                </a>
              </div>
              <div className="p-3 bg-muted rounded-lg text-xs font-mono break-all">
                <a 
                  href={`/api/owner/activity?ownerId=${user.id}&limit=10`}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  /api/owner/activity?ownerId={user.id}&limit=10
                </a>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t space-y-2">
            <Button
              className="w-full"
              onClick={() => window.open('/dashboard/owner', '_blank')}
            >
              Open Owner Dashboard
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open('/profile', '_blank')}
            >
              Open Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

