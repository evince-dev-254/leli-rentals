'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import {
  Shield,
  Users,
  FileText,
  BarChart3,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  TrendingUp,
  DollarSign,
  Home,
  Eye,
  Mail,
  Phone,
  Calendar
} from 'lucide-react'

interface UserStats {
  totalUsers: number
  owners: number
  renters: number
  verifiedUsers: number
  pendingVerifications: number
  rejectedVerifications: number
}

interface User {
  id: string
  firstName: string
  lastName: string
  emailAddresses: any[]
  phoneNumbers: any[]
  createdAt: number
  unsafeMetadata: any
  publicMetadata: any
}

export default function AdminPanelPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    owners: 0,
    renters: 0,
    verifiedUsers: 0,
    pendingVerifications: 0,
    rejectedVerifications: 0
  })
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'owner' | 'renter' | 'verified' | 'pending'>('all')

  // Check admin access
  useEffect(() => {
    if (isLoaded && user) {
      // TEMPORARILY DISABLED FOR DEVELOPMENT - Allow all authenticated users
      setIsAdmin(true)
      fetchAllUsers()
      
      // const adminCheck = user.publicMetadata?.role === 'admin' || (user.unsafeMetadata as any)?.role === 'admin'
      // setIsAdmin(adminCheck)
      
      // if (!adminCheck) {
      //   toast({
      //     title: '⚠️ Access Denied',
      //     description: 'You do not have admin privileges',
      //     variant: 'destructive'
      //   })
      //   router.push('/')
      // } else {
      //   fetchAllUsers()
      // }
    }
  }, [isLoaded, user, router, toast])

  const fetchAllUsers = async () => {
    setIsLoadingStats(true)
    try {
      const response = await fetch('/api/admin/users/list')
      const data = await response.json()
      
      if (response.ok && data.users) {
        setAllUsers(data.users)
        setFilteredUsers(data.users)
        calculateStats(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: '❌ Error',
        description: 'Failed to load user data',
        variant: 'destructive'
      })
    } finally {
      setIsLoadingStats(false)
    }
  }

  const calculateStats = (users: User[]) => {
    const stats: UserStats = {
      totalUsers: users.length,
      owners: users.filter(u => u.unsafeMetadata?.accountType === 'owner').length,
      renters: users.filter(u => u.unsafeMetadata?.accountType === 'renter').length,
      verifiedUsers: users.filter(u => u.unsafeMetadata?.verificationStatus === 'approved').length,
      pendingVerifications: users.filter(u => u.unsafeMetadata?.verificationStatus === 'pending').length,
      rejectedVerifications: users.filter(u => u.unsafeMetadata?.verificationStatus === 'rejected').length,
    }
    setUserStats(stats)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterUsers(query, filterType)
  }

  const handleFilterChange = (type: typeof filterType) => {
    setFilterType(type)
    filterUsers(searchQuery, type)
  }

  const filterUsers = (query: string, type: typeof filterType) => {
    let filtered = allUsers

    // Apply type filter
    if (type === 'owner') {
      filtered = filtered.filter(u => u.unsafeMetadata?.accountType === 'owner')
    } else if (type === 'renter') {
      filtered = filtered.filter(u => u.unsafeMetadata?.accountType === 'renter')
    } else if (type === 'verified') {
      filtered = filtered.filter(u => u.unsafeMetadata?.verificationStatus === 'approved')
    } else if (type === 'pending') {
      filtered = filtered.filter(u => u.unsafeMetadata?.verificationStatus === 'pending')
    }

    // Apply search query
    if (query.trim()) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(u => 
        u.firstName?.toLowerCase().includes(lowerQuery) ||
        u.lastName?.toLowerCase().includes(lowerQuery) ||
        u.emailAddresses?.[0]?.emailAddress?.toLowerCase().includes(lowerQuery)
      )
    }

    setFilteredUsers(filtered)
  }

  if (!isLoaded || isLoadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Admin Panel...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <Shield className="h-10 w-10 text-blue-600" />
                Admin Control Panel
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Manage users, verifications, and platform settings
              </p>
            </div>
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm">
              Super Admin
            </Badge>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userStats.totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Registered on platform
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 dark:border-green-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Owners</CardTitle>
                <Home className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userStats.owners}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {((userStats.owners / userStats.totalUsers) * 100 || 0).toFixed(1)}% of total users
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Renters</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userStats.renters}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {((userStats.renters / userStats.totalUsers) * 100 || 0).toFixed(1)}% of total users
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 dark:border-green-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userStats.verifiedUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  ID verification approved
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200 dark:border-yellow-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userStats.pendingVerifications}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Awaiting admin review
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-200 dark:border-red-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userStats.rejectedVerifications}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Verification rejected
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
              <TabsTrigger value="users">All Users</TabsTrigger>
              <TabsTrigger value="verify">Verify Users</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="listings">Listings</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* All Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>View and manage all registered users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search and Filter */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant={filterType === 'all' ? 'default' : 'outline'}
                        onClick={() => handleFilterChange('all')}
                        size="sm"
                      >
                        All
                      </Button>
                      <Button 
                        variant={filterType === 'owner' ? 'default' : 'outline'}
                        onClick={() => handleFilterChange('owner')}
                        size="sm"
                      >
                        Owners
                      </Button>
                      <Button 
                        variant={filterType === 'renter' ? 'default' : 'outline'}
                        onClick={() => handleFilterChange('renter')}
                        size="sm"
                      >
                        Renters
                      </Button>
                      <Button 
                        variant={filterType === 'verified' ? 'default' : 'outline'}
                        onClick={() => handleFilterChange('verified')}
                        size="sm"
                      >
                        Verified
                      </Button>
                      <Button 
                        variant={filterType === 'pending' ? 'default' : 'outline'}
                        onClick={() => handleFilterChange('pending')}
                        size="sm"
                      >
                        Pending
                      </Button>
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="rounded-md border overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-3 font-semibold">Name</th>
                          <th className="text-left p-3 font-semibold">Email</th>
                          <th className="text-left p-3 font-semibold">Type</th>
                          <th className="text-left p-3 font-semibold">Status</th>
                          <th className="text-left p-3 font-semibold">Joined</th>
                          <th className="text-left p-3 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-t hover:bg-muted/50">
                            <td className="p-3">
                              {user.firstName} {user.lastName}
                            </td>
                            <td className="p-3 text-sm text-muted-foreground">
                              {user.emailAddresses?.[0]?.emailAddress || 'No email'}
                            </td>
                            <td className="p-3">
                              <Badge variant="outline" className="capitalize">
                                {user.unsafeMetadata?.accountType || 'Not set'}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Badge 
                                variant={
                                  user.unsafeMetadata?.verificationStatus === 'approved' ? 'default' :
                                  user.unsafeMetadata?.verificationStatus === 'pending' ? 'secondary' :
                                  user.unsafeMetadata?.verificationStatus === 'rejected' ? 'destructive' :
                                  'outline'
                                }
                              >
                                {user.unsafeMetadata?.verificationStatus || 'None'}
                              </Badge>
                            </td>
                            <td className="p-3 text-sm text-muted-foreground">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  // Navigate to user detail or verification page
                                  if (user.unsafeMetadata?.verificationStatus === 'pending') {
                                    router.push(`/admin-panel?tab=verify&email=${user.emailAddresses?.[0]?.emailAddress}`)
                                  }
                                }}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No users found
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Verify Users Tab */}
            <TabsContent value="verify" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Verification</CardTitle>
                  <CardDescription>Verify user identity documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push('/admin/verify-users')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Open Verification Tool
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    {userStats.pendingVerifications} verification{userStats.pendingVerifications !== 1 ? 's' : ''} pending review
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                  <CardDescription>View platform statistics and insights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p>Detailed analytics dashboard coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Listings Tab */}
            <TabsContent value="listings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Listings Management</CardTitle>
                  <CardDescription>View and moderate platform listings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center text-muted-foreground">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p>Listings moderation tools coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>Configure platform settings and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center text-muted-foreground">
                    <Settings className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p>Platform settings coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

