'use client'

import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, AlertCircle, CheckCircle, Lock, Info } from 'lucide-react'
import Link from 'next/link'

export default function SuperAdminPage() {
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
              Super Admin Access
            </h1>
            <p className="text-lg text-muted-foreground">
              Super admin accounts are managed by platform administrators
            </p>
          </div>

          {/* Information Card */}
          <Card className="shadow-lg border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Super Admin Information
              </CardTitle>
              <CardDescription>
                Information about super admin access and privileges
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Important Notice */}
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                      Access by Invitation Only
                    </h4>
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      Super admin accounts cannot be created through self-registration. 
                      If you need super admin access, please contact the platform administrator 
                      or your system administrator to request an account.
                    </p>
                  </div>
                </div>
              </div>

              {/* Super Admin Privileges */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Super Admin Privileges
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Full access to all platform features and settings</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Complete user management and verification control</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Platform-wide settings and configuration management</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Advanced analytics, reporting, and data access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Content moderation and platform governance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Database and system administration capabilities</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sign In Option */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">
                      Already Have Access?
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      If you already have a super admin account, you can sign in to access the dashboard.
                    </p>
                    <Button
                      onClick={() => router.push('/super-admin/sign-in')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      Sign In to Super Admin
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to Admin Panel */}
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => router.push('/admin-panel')}
              className="w-full sm:w-auto"
            >
              Back to Admin Panel
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

