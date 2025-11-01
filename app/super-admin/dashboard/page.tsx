'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
  Shield,
  Users,
  Settings,
  BarChart3,
  Database,
  Server,
  Key,
  Lock,
  Globe,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

export default function SuperAdminDashboard() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  useEffect(() => {
    if (isLoaded && user) {
      // Check if user has super admin role
      const role = (user.publicMetadata?.role as string) || (user.unsafeMetadata?.role as string)
      const isSuperAdminUser = role === 'super_admin' || role === 'admin'
      
      setIsSuperAdmin(isSuperAdminUser)

      if (!isSuperAdminUser) {
        toast({
          title: 'Access Denied',
          description: 'You do not have super admin privileges',
          variant: 'destructive',
        })
        router.push('/admin-panel')
      }
    } else if (isLoaded && !user) {
      router.push('/super-admin/sign-in')
    }
  }, [isLoaded, user, router, toast])

  if (!isLoaded) {
    return <LoadingSpinner message="Loading Super Admin Dashboard..." variant="admin" />
  }

  if (!isSuperAdmin) {
    return null
  }

  const features = [
    {
      icon: Users,
      title: 'User Management',
      description: 'Full control over all user accounts, permissions, and roles',
      color: 'from-blue-500 to-blue-600',
      href: '/admin-panel?tab=users'
    },
    {
      icon: Settings,
      title: 'Platform Settings',
      description: 'Configure system-wide settings and preferences',
      color: 'from-purple-500 to-purple-600',
      href: '/admin-panel?tab=settings'
    },
    {
      icon: Database,
      title: 'Database Management',
      description: 'Direct access to database operations and maintenance',
      color: 'from-green-500 to-green-600',
      href: '#'
    },
    {
      icon: Server,
      title: 'Server Configuration',
      description: 'Manage server settings, APIs, and integrations',
      color: 'from-orange-500 to-orange-600',
      href: '#'
    },
    {
      icon: Key,
      title: 'API Keys & Secrets',
      description: 'Manage API credentials and security keys',
      color: 'from-red-500 to-red-600',
      href: '#'
    },
    {
      icon: Globe,
      title: 'Global Settings',
      description: 'Configure global platform features and policies',
      color: 'from-cyan-500 to-cyan-600',
      href: '#'
    },
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Super Admin Dashboard
                  </h1>
                  <p className="text-muted-foreground">
                    Full platform control and management
                  </p>
                </div>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 text-sm">
              <Lock className="h-4 w-4 mr-2" />
              Super Admin
            </Badge>
          </div>

          {/* Welcome Card */}
          <Card className="mb-8 border-2 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    Welcome, {user?.firstName || 'Super Admin'}!
                  </h3>
                  <p className="text-muted-foreground">
                    You have full administrative privileges. Use this dashboard to manage all aspects of the platform,
                    including users, settings, database operations, and system configuration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-300 dark:hover:border-blue-700"
                  onClick={() => feature.href !== '#' && router.push(feature.href)}
                >
                  <CardHeader>
                    <div className={`inline-flex p-3 bg-gradient-to-r ${feature.color} rounded-lg mb-2`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (feature.href !== '#') {
                          router.push(feature.href)
                        } else {
                          toast({
                            title: 'Coming Soon',
                            description: 'This feature is under development',
                          })
                        }
                      }}
                    >
                      Access Feature
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Quick Actions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => router.push('/admin-panel?tab=users')}
                >
                  <Users className="h-5 w-5" />
                  Manage Users
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => router.push('/admin/verify-users')}
                >
                  <Shield className="h-5 w-5" />
                  Verify Users
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => router.push('/admin-panel?tab=settings')}
                >
                  <Settings className="h-5 w-5" />
                  Platform Settings
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => router.push('/admin-panel?tab=analytics')}
                >
                  <BarChart3 className="h-5 w-5" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

