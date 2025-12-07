"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Download,
    FileText,
    User,
    Calendar,
    Shield,
    Loader2,
    Phone,
    Mail
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { updateDocumentStatus } from "@/lib/actions/dashboard-actions"
import type { User as UserType, VerificationDocument } from "@/lib/types"

interface VerificationDetailProps {
    verificationId: string
}

export function VerificationDetail({ verificationId }: VerificationDetailProps) {
    const router = useRouter()
    const [verificationDoc, setVerificationDoc] = useState<(VerificationDocument & { user: UserType }) | null>(null)
    const [loading, setLoading] = useState(true)
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
    const [rejectionReason, setRejectionReason] = useState("")
    const [processing, setProcessing] = useState(false)

    useEffect(() => {
        loadDocument()
    }, [verificationId])

    const loadDocument = async () => {
        try {
            setLoading(true)
            // Fetch document
            const { data: docData, error: docError } = await supabase
                .from("verification_documents")
                .select("*")
                .eq("id", verificationId)
                .single()

            if (docError) throw docError
            if (!docData) throw new Error("Document not found")

            // Fetch user
            const { data: userData, error: userError } = await supabase
                .from("user_profiles")
                .select("*")
                .eq("id", docData.user_id)
                .single()

            if (userError) throw userError

            // Map User
            const user: UserType = {
                id: userData.id,
                email: userData.email,
                fullName: userData.full_name ?? "",
                phone: userData.phone ?? "",
                avatarUrl: userData.avatar_url ?? null,
                role: userData.role ?? "renter",
                accountStatus: userData.account_status ?? "active",
                verificationStatus: userData.verification_status ?? "pending",
                verificationDeadline: userData.verification_deadline ? new Date(userData.verification_deadline) : null,
                verificationDocuments: [], // Not needed for this view
                subscriptionPlan: userData.subscription_plan ?? null,
                subscriptionExpiresAt: userData.subscription_expires_at ? new Date(userData.subscription_expires_at) : null,
                createdAt: userData.created_at ? new Date(userData.created_at) : new Date(),
                updatedAt: userData.updated_at ? new Date(userData.updated_at) : new Date(),
                lastLoginAt: userData.last_login_at ? new Date(userData.last_login_at) : null,
                affiliateCode: userData.affiliate_code ?? null,
                referredBy: userData.referred_by ?? null,
                totalReferrals: userData.total_referrals ?? 0,
                totalEarnings: userData.total_earnings ?? 0,
                // Helper fields
                dateOfBirth: userData.date_of_birth,
                nextOfKinName: userData.next_of_kin_name,
                nextOfKinPhone: userData.next_of_kin_phone,
                nextOfKinRelationship: userData.next_of_kin_relationship,
            } as any // Cast to any to include extra fields if type def is strict

            // Map Document
            const mappedDoc: VerificationDocument & { user: UserType } = {
                id: docData.id,
                userId: docData.user_id,
                type: docData.document_type,
                fileUrl: docData.document_url,
                fileName: docData.document_url?.split('/').pop() || 'document',
                backImageUrl: docData.back_image_url,
                selfieImageUrl: docData.selfie_image_url,
                uploadedAt: docData.created_at ? new Date(docData.created_at) : new Date(),
                status: docData.status,
                reviewedBy: docData.verified_by,
                reviewedAt: docData.verified_at ? new Date(docData.verified_at) : null,
                rejectionReason: docData.rejection_reason,
                user,
                // Extra
                document_number: docData.document_number
            } as any

            setVerificationDoc(mappedDoc)
        } catch (error) {
            console.error("Error loading verification detail:", error)
            toast.error("Failed to load verification document")
            router.push("/admin/verifications")
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (status: 'approved' | 'rejected', reason?: string) => {
        if (!verificationDoc) return;
        try {
            setProcessing(true)
            await updateDocumentStatus(verificationDoc.id, status, reason);
            toast.success(`Document ${status}`);
            setRejectDialogOpen(false)
            router.push("/admin/verifications") // Go back to list after action
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status");
        } finally {
            setProcessing(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!verificationDoc) return null

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push("/admin/verifications")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Review Verification</h1>
                    <p className="text-muted-foreground">Review document and approve or reject user verification</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Left Column: User & Doc Info */}
                <div className="space-y-6">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <User className="h-5 w-5 text-primary" />
                                User Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={verificationDoc.user.avatarUrl || undefined} />
                                    <AvatarFallback>{verificationDoc.user.fullName[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{verificationDoc.user.fullName}</p>
                                    <Badge variant="outline" className="mt-1 capitalize">{verificationDoc.user.role}</Badge>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{verificationDoc.user.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{verificationDoc.user.phone || 'No phone'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>Joined {verificationDoc.user.createdAt.toLocaleDateString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Shield className="h-5 w-5 text-primary" />
                                Document Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <span className="text-muted-foreground block mb-1">Type</span>
                                <p className="font-medium capitalize">{(verificationDoc.type || '').replace("_", " ")}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">Status</span>
                                <Badge variant={
                                    verificationDoc.status === 'approved' ? 'default' :
                                        verificationDoc.status === 'rejected' ? 'destructive' : 'secondary'
                                }>
                                    {verificationDoc.status}
                                </Badge>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">Document Number</span>
                                <p className="font-medium">{(verificationDoc as any).document_number || 'N/A'}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">Next of Kin</span>
                                <p className="font-medium">{(verificationDoc.user as any).nextOfKinName || 'N/A'}</p>
                                <p className="text-xs text-muted-foreground">{(verificationDoc.user as any).nextOfKinRelationship} • {(verificationDoc.user as any).nextOfKinPhone}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">Uploaded</span>
                                <p className="font-medium">{verificationDoc.uploadedAt.toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-base">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                className="w-full bg-green-600 hover:bg-green-700"
                                onClick={() => handleUpdateStatus('approved')}
                                disabled={processing || verificationDoc.status === 'approved'}
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve Document
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => setRejectDialogOpen(true)}
                                disabled={processing || verificationDoc.status === 'approved'}
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject Document
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Preview */}
                <div className="md:col-span-2 space-y-6">
                    {/* Front Image */}
                    <Card className="glass-card">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>Front Side</CardTitle>
                            <Button variant="outline" size="sm" asChild>
                                <a href={verificationDoc.fileUrl} target="_blank" rel="noopener noreferrer">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </a>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-muted/30 rounded-lg p-4 min-h-[300px] flex items-center justify-center border border-border overflow-hidden relative">
                                {verificationDoc.fileUrl?.toLowerCase().endsWith('.pdf') ? (
                                    <iframe src={verificationDoc.fileUrl} className="w-full h-[500px] rounded-md" />
                                ) : (
                                    <img
                                        src={verificationDoc.fileUrl}
                                        alt="Front Preview"
                                        className="max-w-full max-h-[500px] object-contain rounded-md shadow-lg"
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Back Image (if exists) */}
                    {verificationDoc.backImageUrl && (
                        <Card className="glass-card">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle>Back Side</CardTitle>
                                <Button variant="outline" size="sm" asChild>
                                    <a href={verificationDoc.backImageUrl} target="_blank" rel="noopener noreferrer">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </a>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-muted/30 rounded-lg p-4 min-h-[300px] flex items-center justify-center border border-border overflow-hidden relative">
                                    <img
                                        src={verificationDoc.backImageUrl}
                                        alt="Back Preview"
                                        className="max-w-full max-h-[500px] object-contain rounded-md shadow-lg"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Selfie Image (if exists) */}
                    {verificationDoc.selfieImageUrl && (
                        <Card className="glass-card">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle>Selfie</CardTitle>
                                <Button variant="outline" size="sm" asChild>
                                    <a href={verificationDoc.selfieImageUrl} target="_blank" rel="noopener noreferrer">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </a>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-muted/30 rounded-lg p-4 min-h-[300px] flex items-center justify-center border border-border overflow-hidden relative">
                                    <img
                                        src={verificationDoc.selfieImageUrl}
                                        alt="Selfie Preview"
                                        className="max-w-full max-h-[500px] object-contain rounded-md shadow-lg"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Rejection Dialog */}
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Document</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this document. The user will be notified.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="rejection-reason">Rejection Reason</Label>
                            <Textarea
                                id="rejection-reason"
                                placeholder="Enter the reason for rejection..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={() => handleUpdateStatus('rejected', rejectionReason)} disabled={processing}>
                            {processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Confirm Rejection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
