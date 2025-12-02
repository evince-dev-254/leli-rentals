"use client"

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { FileText, CheckCircle, XCircle, Clock, Eye, User, Calendar, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { OptimizedImage } from '@/components/imagekit'

interface VerificationDocument {
    id: string
    userId: string
    userName: string
    userEmail: string
    status: 'pending' | 'approved' | 'rejected'
    submittedAt: string
    reviewedAt?: string
    reviewedBy?: string
    rejectionReason?: string
    documents: {
        idFront: { url: string; path: string; fileId: string }
        idBack: { url: string; path: string; fileId: string }
        selfie: { url: string; path: string; fileId: string }
    }
}

export default function VerificationDocsPage() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const { toast } = useToast()
    const [isAdmin, setIsAdmin] = useState(false)
    const [isChecking, setIsChecking] = useState(true)
    const [verifications, setVerifications] = useState<VerificationDocument[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedDoc, setSelectedDoc] = useState<VerificationDocument | null>(null)
    const [rejectionReason, setRejectionReason] = useState('')
    const [processing, setProcessing] = useState(false)

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
            fetchVerifications()
        }
    }, [user, isLoaded, router])

    const fetchVerifications = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/verifications')
            if (response.ok) {
                const data = await response.json()
                // Map Supabase structure to component structure
                const mapped = (data.verifications || []).map((v: any) => ({
                    id: v.id,
                    userId: v.user_id,
                    userName: v.user_name || 'Unknown',
                    userEmail: v.user_email || 'N/A',
                    status: v.status,
                    submittedAt: v.created_at,
                    reviewedAt: v.reviewed_at,
                    reviewedBy: v.reviewed_by,
                    rejectionReason: v.rejection_reason,
                    documents: {
                        idFront: {
                            url: v.document_front_url || '',
                            path: v.document_front_path || '',
                            fileId: v.document_front_file_id || ''
                        },
                        idBack: {
                            url: v.document_back_url || '',
                            path: v.document_back_path || '',
                            fileId: v.document_back_file_id || ''
                        },
                        selfie: {
                            url: v.selfie_url || '',
                            path: v.selfie_path || '',
                            fileId: v.selfie_file_id || ''
                        }
                    }
                }))
                setVerifications(mapped)
            }
        } catch (error) {
            console.error('Error fetching verifications:', error)
            toast({
                title: 'Error',
                description: 'Failed to load verification documents',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (docId: string) => {
        setProcessing(true)
        try {
            const response = await fetch('/api/admin/verifications/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ verificationId: docId })
            })

            if (response.ok) {
                toast({
                    title: 'Approved',
                    description: 'Verification has been approved successfully'
                })
                fetchVerifications()
                setSelectedDoc(null)
            } else {
                throw new Error('Approval failed')
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to approve verification',
                variant: 'destructive'
            })
        } finally {
            setProcessing(false)
        }
    }

    const handleReject = async (docId: string) => {
        if (!rejectionReason.trim()) {
            toast({
                title: 'Rejection reason required',
                description: 'Please provide a reason for rejection',
                variant: 'destructive'
            })
            return
        }

        setProcessing(true)
        try {
            const response = await fetch('/api/admin/verifications/reject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    verificationId: docId,
                    reason: rejectionReason
                })
            })

            if (response.ok) {
                toast({
                    title: 'Rejected',
                    description: 'Verification has been rejected'
                })
                fetchVerifications()
                setSelectedDoc(null)
                setRejectionReason('')
            } else {
                throw new Error('Rejection failed')
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to reject verification',
                variant: 'destructive'
            })
        } finally {
            setProcessing(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
            case 'approved':
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
            case 'rejected':
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
            default:
                return null
        }
    }

    const VerificationCard = ({ doc }: { doc: VerificationDocument }) => (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{doc.userName}</CardTitle>
                            <CardDescription>{doc.userEmail}</CardDescription>
                        </div>
                    </div>
                    {getStatusBadge(doc.status)}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        Submitted: {new Date(doc.submittedAt).toLocaleDateString()}
                    </div>

                    {doc.status === 'rejected' && doc.rejectionReason && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                            <div className="text-sm text-red-700 dark:text-red-300">
                                <strong>Rejection Reason:</strong> {doc.rejectionReason}
                            </div>
                        </div>
                    )}

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setSelectedDoc(doc)}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                Review Documents
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Verification Documents - {doc.userName}</DialogTitle>
                                <DialogDescription>
                                    Review submitted documents and approve or reject
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 mt-4">
                                {/* ID Front */}
                                <div>
                                    <h3 className="font-semibold mb-2">Government ID (Front)</h3>
                                    <div className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
                                        {doc.documents.idFront.path ? (
                                            <OptimizedImage
                                                path={doc.documents.idFront.path}
                                                alt="ID Front"
                                                width={800}
                                                height={600}
                                                className="w-full h-auto"
                                                transformation={[{
                                                    width: '800',
                                                    quality: '90'
                                                }]}
                                            />
                                        ) : (
                                            <img
                                                src={doc.documents.idFront.url}
                                                alt="ID Front"
                                                className="w-full h-auto"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* ID Back */}
                                <div>
                                    <h3 className="font-semibold mb-2">Government ID (Back)</h3>
                                    <div className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
                                        {doc.documents.idBack.path ? (
                                            <OptimizedImage
                                                path={doc.documents.idBack.path}
                                                alt="ID Back"
                                                width={800}
                                                height={600}
                                                className="w-full h-auto"
                                                transformation={[{
                                                    width: '800',
                                                    quality: '90'
                                                }]}
                                            />
                                        ) : (
                                            <img
                                                src={doc.documents.idBack.url}
                                                alt="ID Back"
                                                className="w-full h-auto"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Selfie */}
                                <div>
                                    <h3 className="font-semibold mb-2">Selfie Verification</h3>
                                    <div className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
                                        {doc.documents.selfie.path ? (
                                            <OptimizedImage
                                                path={doc.documents.selfie.path}
                                                alt="Selfie"
                                                width={800}
                                                height={600}
                                                className="w-full h-auto"
                                                transformation={[{
                                                    width: '800',
                                                    quality: '90'
                                                }]}
                                            />
                                        ) : (
                                            <img
                                                src={doc.documents.selfie.url}
                                                alt="Selfie"
                                                className="w-full h-auto"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                {doc.status === 'pending' && (
                                    <div className="space-y-4 pt-4 border-t">
                                        <div className="space-y-2">
                                            <Label htmlFor="rejection-reason">Rejection Reason (if rejecting)</Label>
                                            <Textarea
                                                id="rejection-reason"
                                                placeholder="Provide a clear reason for rejection..."
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                rows={3}
                                            />
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                variant="default"
                                                className="flex-1 bg-green-600 hover:bg-green-700"
                                                onClick={() => handleApprove(doc.id)}
                                                disabled={processing}
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Approve
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                className="flex-1"
                                                onClick={() => handleReject(doc.id)}
                                                disabled={processing}
                                            >
                                                <XCircle className="h-4 w-4 mr-2" />
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    )

    if (isChecking || !isLoaded) {
        return <LoadingSpinner message="Verifying admin access..." variant="default" fullScreen={true} showHeader={false} />
    }

    if (!isAdmin) {
        return null
    }

    const pendingDocs = verifications.filter(v => v.status === 'pending')
    const approvedDocs = verifications.filter(v => v.status === 'approved')
    const rejectedDocs = verifications.filter(v => v.status === 'rejected')

    return (
        <AdminLayout>
            <div className="p-6 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Verification Documents</h1>
                    <p className="text-gray-600 dark:text-gray-400">Review and manage owner verification submissions</p>
                </div>

                <Tabs defaultValue="pending" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 max-w-md">
                        <TabsTrigger value="pending" className="relative">
                            Pending
                            {pendingDocs.length > 0 && (
                                <Badge className="ml-2 bg-yellow-500">{pendingDocs.length}</Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="approved">
                            Approved
                            {approvedDocs.length > 0 && (
                                <Badge className="ml-2 bg-green-500">{approvedDocs.length}</Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="rejected">
                            Rejected
                            {rejectedDocs.length > 0 && (
                                <Badge className="ml-2 bg-red-500">{rejectedDocs.length}</Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="space-y-4">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <LoadingSpinner message="Loading verifications..." />
                            </div>
                        ) : pendingDocs.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Clock className="h-16 w-16 text-gray-400 mb-4" />
                                    <p className="text-gray-500">No pending verifications</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {pendingDocs.map(doc => (
                                    <VerificationCard key={doc.id} doc={doc} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="approved" className="space-y-4">
                        {approvedDocs.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <CheckCircle className="h-16 w-16 text-gray-400 mb-4" />
                                    <p className="text-gray-500">No approved verifications</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {approvedDocs.map(doc => (
                                    <VerificationCard key={doc.id} doc={doc} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="rejected" className="space-y-4">
                        {rejectedDocs.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <XCircle className="h-16 w-16 text-gray-400 mb-4" />
                                    <p className="text-gray-500">No rejected verifications</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {rejectedDocs.map(doc => (
                                    <VerificationCard key={doc.id} doc={doc} />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    )
}
