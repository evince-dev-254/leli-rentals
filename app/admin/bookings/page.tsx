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
import { Calendar, Search, Download, Filter, Eye } from 'lucide-react'

interface Booking {
    id: string
    listing_title: string
    renter_name: string
    owner_name: string
    start_date: string
    end_date: string
    total_price: number
    status: string
    created_at: string
}

export default function BookingsPage() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const [isAdmin, setIsAdmin] = useState(false)
    const [isChecking, setIsChecking] = useState(true)
    const [bookings, setBookings] = useState<Booking[]>([])
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
            fetchBookings()
        }
    }, [isAdmin])

    const fetchBookings = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/bookings')
            const data = await response.json()

            if (data.bookings) {
                setBookings(data.bookings)
            }
        } catch (error) {
            console.error('Error fetching bookings:', error)
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

    const filteredBookings = bookings.filter(booking =>
        booking.listing_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.renter_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.owner_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const stats = {
        total: bookings.length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        pending: bookings.filter(b => b.status === 'pending').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length
    }

    return (
        <AdminLayout>
            <div className="p-6 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bookings Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">View and manage all platform bookings</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Confirmed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
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
                            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Cancelled</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bookings Table */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <CardTitle>All Bookings</CardTitle>
                                <CardDescription>View and manage platform bookings</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative flex-1 md:w-64">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Search bookings..."
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
                                <LoadingSpinner message="Loading bookings..." variant="default" fullScreen={false} showHeader={false} />
                            </div>
                        ) : filteredBookings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Calendar className="h-16 w-16 text-gray-400 mb-4" />
                                <p className="text-gray-500">No bookings found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Listing</TableHead>
                                            <TableHead>Renter</TableHead>
                                            <TableHead>Owner</TableHead>
                                            <TableHead>Start Date</TableHead>
                                            <TableHead>End Date</TableHead>
                                            <TableHead>Total Price</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredBookings.map((booking) => (
                                            <TableRow key={booking.id}>
                                                <TableCell className="font-medium">{booking.listing_title || 'N/A'}</TableCell>
                                                <TableCell>{booking.renter_name || 'Unknown'}</TableCell>
                                                <TableCell>{booking.owner_name || 'Unknown'}</TableCell>
                                                <TableCell>{new Date(booking.start_date).toLocaleDateString()}</TableCell>
                                                <TableCell>{new Date(booking.end_date).toLocaleDateString()}</TableCell>
                                                <TableCell>KSh {booking.total_price?.toLocaleString() || '0'}</TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        booking.status === 'confirmed' ? 'default' :
                                                            booking.status === 'pending' ? 'secondary' :
                                                                booking.status === 'completed' ? 'outline' :
                                                                    'destructive'
                                                    }>
                                                        {booking.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button size="sm" variant="outline">
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
