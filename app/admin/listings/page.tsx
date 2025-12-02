"use client"

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Package, Search, Download, Filter, Eye, Trash2, Edit } from 'lucide-react'

interface Listing {
    id: string
    title: string
    category: string
    price: number
    status: string
    created_at: string
    owner_name: string
}

export default function ListingsPage() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const [isAdmin, setIsAdmin] = useState(false)
    const [isChecking, setIsChecking] = useState(true)
    const [listings, setListings] = useState<Listing[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        if (isLoaded) {
            const adminRole = (user?.publicMetadata?.role as string) || (user?.unsafeMetadata as any)?.role

            if (!user) {
                router.push('/sign-in?redirect=/admin')
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
            fetchListings()
        }
    }, [isAdmin])

    const fetchListings = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/listings')
            const data = await response.json()

            if (data.success && data.listings) {
                setListings(data.listings)
            }
        } catch (error) {
            console.error('Error fetching listings:', error)
        } finally {
            setLoading(false)
        }
    }

    if (isChecking || !isLoaded) {
        return <LoadingSpinner message="Verifying admin access..." variant="default" fullScreen={true} showHeader={false} />
    }

    if (!isAdmin) {
        return null
    }

    const filteredListings = listings.filter(listing =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.owner_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const stats = {
        total: listings.length,
        active: listings.filter(l => l.status === 'active').length,
        pending: listings.filter(l => l.status === 'pending').length,
        inactive: listings.filter(l => l.status === 'inactive').length
    }

    return (
        <AdminLayout>
            <div className="p-6 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Listings Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage all platform listings</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Total Listings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Active</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Inactive</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Listings Table */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <CardTitle>All Listings</CardTitle>
                                <CardDescription>View and manage platform listings</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative flex-1 md:w-64">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Search listings..."
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
                                <LoadingSpinner message="Loading listings..." variant="default" fullScreen={false} showHeader={false} />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Owner</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredListings.map((listing) => (
                                            <TableRow key={listing.id}>
                                                <TableCell className="font-medium">{listing.title}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{listing.category}</Badge>
                                                </TableCell>
                                                <TableCell>{listing.owner_name}</TableCell>
                                                <TableCell>KSh {listing.price?.toLocaleString() || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        listing.status === 'active' ? 'default' :
                                                            listing.status === 'pending' ? 'secondary' :
                                                                'destructive'
                                                    }>
                                                        {listing.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(listing.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant="outline">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="sm" variant="outline">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="sm" variant="destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
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
