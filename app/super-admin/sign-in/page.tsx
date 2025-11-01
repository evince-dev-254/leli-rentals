'use client'

import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SignIn } from '@clerk/nextjs'
import { Shield, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SuperAdminSignInPage() {
  const router = useRouter()

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Super Admin Sign In
            </h1>
            <p className="text-lg text-muted-foreground">
              Sign in to your super admin account
            </p>
          </div>

          {/* Sign In Card */}
          <Card className="shadow-lg border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Super Admin Authentication
              </CardTitle>
              <CardDescription>
                Sign in with your super admin credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <SignIn
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none border-0",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "bg-blue-600 hover:bg-blue-700",
                      formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                      footerActionLink: "text-blue-600 hover:text-blue-700",
                    }
                  }}
                  routing="hash"
                  signUpUrl="/super-admin"
                  afterSignInUrl="/super-admin/dashboard"
                  redirectUrl="/super-admin/dashboard"
                />
              </div>

              {/* Back to Admin Panel */}
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => router.push('/admin-panel')}
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin Panel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Information */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Super admin access is by invitation only.{' '}
              <Link href="/super-admin" className="text-blue-600 hover:text-blue-700 font-medium">
                Learn more
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

