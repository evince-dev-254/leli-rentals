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
import { FileCheck, Search, Download, Filter, Eye, CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Verification {
    id: string
    user_id: string
    user_name: string
    user_email: string
    status: string
    submitted_at: string
    documents: string[]
    id_type: string
    id_number: string
}

export default function VerificationsPage() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const { toast } = useToast()
    const [isAdmin, setIsAdmin] = useState(false)
    const [isChecking, setIsChecking] = useState(true)
    const [verifications, setVerifications] = useState<Verification[]>([])
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
            fetchVerifications()
        }
    }, [isAdmin])

    const fetchVerifications = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/verifications')
            const data = await response.json()

            if (data.verifications) {
                setVerifications(data.verifications)
            }
        } catch (error) {
            console.error('Error fetching verifications:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (userId: string) => {
        try {
            const response = await fetch(`/api/admin/verifications/approve/${userId}`, {
                method: 'POST'
            })

            if (response.ok) {
                toast({ title: 'Verification approved successfully' })
                fetchVerifications()
            }
        } catch (error) {
            toast({ title: 'Error approving verification', variant: 'destructive' })
        }
    }

    const handleReject = async (userId: string) => {
        try {
            const response = await fetch(`/api/admin/verifications/reject/${userId}`, {
                method: 'POST'
            })

            if (response.ok) {
                toast({ title: 'Verification rejected' })
                fetchVerifications()
            }
        } catch (error) {
            toast({ title: 'Error rejecting verification', variant: 'destructive' })
        }
    }

    if (isChecking || !isLoaded) {
        return <LoadingSpinner message="Verifying admin access..." variant="default" fullScreen={true} showHeader={false} />
    }

    if (!isAdmin) {
        return null
    }

    const filteredVerifications = verifications.filter(v =>
        v.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.id_number?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const stats = {
        total: verifications.length,
        pending: verifications.filter(v => v.status === 'pending').length,
        approved: verifications.filter(v => v.status === 'approved').length,
        rejected: verifications.filter(v => v.status === 'rejected').length
    }

    return (
        <AdminLayout>
            <div className="p-6 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Owner Verifications</h1>
                    <p className="text-gray-600 dark:text-gray-400">Review and approve owner verification requests</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Total Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
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
                            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Approved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Rejected</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Verifications Table */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <CardTitle>Verification Requests</CardTitle>
                                <CardDescription>Review owner verification submissions</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative flex-1 md:w-64">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Search verifications..."
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
                                <LoadingSpinner message="Loading verifications..." variant="default" fullScreen={false} showHeader={false} />
                            </div>
                        ) : filteredVerifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FileCheck className="h-16 w-16 text-gray-400 mb-4" />
                                <p className="text-gray-500">No verification requests found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>User</TableHead>
                                            <TableHead>ID Type</TableHead>
                                            <TableHead>ID Number</TableHead>
                                            <TableHead>Documents</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Submitted</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredVerifications.map((verification) => (
                                            <TableRow key={verification.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{verification.user_name || 'Unknown'}</div>
                                                        <div className="text-sm text-gray-500">{verification.user_email}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{verification.id_type || 'N/A'}</TableCell>
                                                <TableCell>{verification.id_number || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <ImageIcon className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm">{verification.documents?.length || 0} files</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        verification.status === 'approved' ? 'default' :
                                                            verification.status === 'pending' ? 'secondary' :
                                                                'destructive'
                                                    }>
                                                        {verification.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(verification.submitted_at).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant="outline">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        {verification.status === 'pending' && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="default"
                                                                    onClick={() => handleApprove(verification.user_id)}
                                                                >
                                                                    <CheckCircle className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={() => handleReject(verification.user_id)}
                                                                >
                                                                    <XCircle className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        )}
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
