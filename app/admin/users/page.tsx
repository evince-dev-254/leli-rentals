"use client"

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Search, Download, Filter, User, Building2, TrendingUp, Eye, Shield, RefreshCw, Database } from 'lucide-react'

interface UserData {
    id: string
    name: string
    email: string
    accountType: string
    createdAt: string
    status: string
    verificationStatus?: string
    role?: string
}

export default function AdminUsersPage() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const [isAdmin, setIsAdmin] = useState(false)
    const [isChecking, setIsChecking] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [users, setUsers] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)
    const [syncing, setSyncing] = useState(false)

    useEffect(() => {
        if (isLoaded) {
            const adminRole = (user?.publicMetadata?.role as string) || (user?.unsafeMetadata as any)?.role

            if (!user) {
                router.push('/sign-in?redirect=/admin/users')
                return
            }

            if (adminRole !== 'admin') {
                router.push('/')
                return
            }

            setIsAdmin(true)
            setIsChecking(false)
        }
    }, [user, isLoaded, router])

    useEffect(() => {
        if (isAdmin) {
            fetchUsers()
        }
    }, [isAdmin])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/users/list')
            const data = await response.json()

            if (data.users) {
                setUsers(data.users)
            }
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSync = async () => {
        try {
            setSyncing(true)
            const response = await fetch('/api/admin/users/sync', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user?.id}`
                }
            })
            const data = await response.json()

            if (data.success) {
                // Refresh users after sync
                await fetchUsers()
                alert(`Synced ${data.synced} users to database!`)
            } else {
                alert('Sync failed: ' + (data.error || 'Unknown error'))
            }
        } catch (error) {
            console.error('Error syncing users:', error)
            alert('Error syncing users')
        } finally {
            setSyncing(false)
        }
    }

    if (isChecking || !isLoaded) {
        return <LoadingSpinner message="Verifying admin access..." variant="default" fullScreen={true} showHeader={false} />
    }

    if (!isAdmin) {
        return null
    }

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const stats = {
        total: users.length,
        renters: users.filter(u => u.accountType === 'renter').length,
        owners: users.filter(u => u.accountType === 'owner').length,
        affiliates: users.filter(u => u.accountType === 'affiliate').length,
        admins: users.filter(u => u.role === 'admin').length
    }

    const getAccountTypeIcon = (type: string) => {
        switch (type) {
            case 'owner':
                return <Building2 className="h-4 w-4" />
            case 'affiliate':
                return <TrendingUp className="h-4 w-4" />
            default:
                return <User className="h-4 w-4" />
        }
    }

    const getAccountTypeBadge = (type: string) => {
        const colors = {
            renter: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            owner: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
            affiliate: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        }

        return (
            <Badge className={`${colors[type as keyof typeof colors] || colors.renter} border-0`}>
                <span className="flex items-center gap-1">
                    {getAccountTypeIcon(type)}
                    {type?.charAt(0).toUpperCase() + type?.slice(1) || 'Renter'}
                </span>
            </Badge>
        )
    }

    return (
        <AdminLayout>
            <div className="p-6 md:p-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">User Management</h1>
                        <p className="text-gray-600 dark:text-gray-400">View and manage all platform users from Clerk and Supabase</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={fetchUsers} disabled={loading} variant="outline">
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button onClick={handleSync} disabled={syncing} variant="default">
                            <Database className={`h-4 w-4 mr-2 ${syncing ? 'animate-pulse' : ''}`} />
                            {syncing ? 'Syncing...' : 'Sync to DB'}
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Total Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Renters</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.renters}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Owners</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{stats.owners}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Affiliates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.affiliates}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Admins</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.admins}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <CardTitle>All Users</CardTitle>
                                <CardDescription>Users from Clerk authentication and Supabase profiles</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative flex-1 md:w-64">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Search users..."
                                        className="pl-9"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button variant="outline" size="icon">
                                    <Filter className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon">
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <LoadingSpinner message="Loading users..." variant="default" fullScreen={false} showHeader={false} />
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <User className="h-16 w-16 text-gray-400 mb-4" />
                                <p className="text-gray-500 mb-4">No users found</p>
                                <Button onClick={handleSync} disabled={syncing}>
                                    <Database className="h-4 w-4 mr-2" />
                                    Sync Clerk Users to Database
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Account Type</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Joined</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((u) => (
                                            <TableRow key={u.id}>
                                                <TableCell className="font-medium">{u.name || 'N/A'}</TableCell>
                                                <TableCell>{u.email}</TableCell>
                                                <TableCell>{getAccountTypeBadge(u.accountType)}</TableCell>
                                                <TableCell>
                                                    {u.role === 'admin' ? (
                                                        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0">
                                                            <Shield className="h-3 w-3 mr-1" />
                                                            Admin
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">User</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
                                                        {u.status || 'active'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    )
}
