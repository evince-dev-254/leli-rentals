"use client"
import { supabase } from "@/lib/supabase"

import { useEffect, useState, useCallback } from "react"
import { getUserDetails, suspendUsers, reactivateUsers } from "@/lib/actions/admin-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingLogo } from "@/components/ui/loading-logo"
import { ActionConfirmModal } from "./action-confirm-modal"
import {
    User,
    Mail,
    Calendar,
    Shield,
    FileText,
    Package,
    ShoppingCart,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

interface UserDetailProps {
    userId: string
}

export function UserDetail({ userId }: UserDetailProps) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [isSuperAdmin, setIsSuperAdmin] = useState(false)

    // Consent Modal State
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean;
        title: string;
        description: string;
        onConfirm: () => void;
        variant: "default" | "destructive" | "warning";
        confirmText?: string;
    }>({
        open: false,
        title: "",
        description: "",
        onConfirm: () => { },
        variant: "default",
    });

    const loadData = useCallback(async () => {
        setLoading(true)
        const result = await getUserDetails(userId)
        if (result.success) {
            setData(result.data)
        } else {
            toast.error(result.error || "Failed to load user details")
        }
        setLoading(false)

        // Check Permissions
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data: profile } = await supabase.from('user_profiles').select('is_super_admin').eq('id', user.id).single()
            setIsSuperAdmin(!!profile?.is_super_admin)
        }
    }, [userId])

    useEffect(() => {
        loadData()
    }, [loadData])

    async function handleSuspend() {
        setConfirmModal({
            open: true,
            title: "Confirm Suspension",
            description: "Are you sure you want to suspend this user? They will not be able to log in or use the platform.",
            variant: "destructive",
            confirmText: "Suspend",
            onConfirm: async () => {
                setActionLoading(true)
                const result = await suspendUsers([userId])
                setActionLoading(false)
                setConfirmModal(prev => ({ ...prev, open: false }))
                if (result.success) {
                    toast.success("User suspended")
                    loadData()
                } else {
                    toast.error("Failed to suspend user")
                }
            }
        })
    }

    async function handleReactivate() {
        setConfirmModal({
            open: true,
            title: "Confirm Reactivation",
            description: "Are you sure you want to reactivate this user's account?",
            variant: "default",
            confirmText: "Reactivate",
            onConfirm: async () => {
                setActionLoading(true)
                const result = await reactivateUsers([userId])
                setActionLoading(false)
                setConfirmModal(prev => ({ ...prev, open: false }))
                if (result.success) {
                    toast.success("User reactivated")
                    loadData()
                } else {
                    toast.error("Failed to reactivate user")
                }
            }
        })
    }

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <LoadingLogo size={60} />
            </div>
        )
    }

    if (!data) {
        return <div className="text-center p-8">User not found</div>
    }

    const { profile, verificationDocs, listings, bookingsAsRenter, bookingsAsOwner, referrals } = data
    const isSuspended = profile.account_status === "suspended"

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <Card className="glass-card border-none shadow-lg">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={profile.avatar_url} />
                            <AvatarFallback className="text-2xl">
                                {profile.full_name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-3">
                            <div>
                                <h1 className="text-3xl font-bold">{profile.full_name || "Unknown User"}</h1>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <Badge variant="outline" className="capitalize">{profile.role}</Badge>
                                    <Badge variant={isSuspended ? "destructive" : "default"}>
                                        {profile.account_status || "active"}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    {profile.email}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
                                </div>
                                {profile.phone_number && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <User className="h-4 w-4" />
                                        {profile.phone_number}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 pt-2">
                                {isSuspended ? (
                                    <Button onClick={handleReactivate} disabled={actionLoading || !isSuperAdmin} variant="default">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Reactivate Account
                                    </Button>
                                ) : (
                                    <Button onClick={handleSuspend} disabled={actionLoading || !isSuperAdmin} variant="destructive">
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Suspend Account
                                    </Button>
                                )}
                                <Button variant="outline" asChild>
                                    <Link href={`/admin/communications?user=${userId}`}>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Send Email
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabbed Content */}
            <Tabs defaultValue="verification" className="w-full">
                <TabsList className="bg-muted/50">
                    {profile.role === "owner" && (
                        <TabsTrigger value="verification">
                            <Shield className="h-4 w-4 mr-2" />
                            Verification
                        </TabsTrigger>
                    )}
                    {profile.role === "owner" && (
                        <TabsTrigger value="listings">
                            <Package className="h-4 w-4 mr-2" />
                            Listings
                        </TabsTrigger>
                    )}
                    <TabsTrigger value="bookings">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Bookings
                    </TabsTrigger>
                    {profile.role === "affiliate" && (
                        <TabsTrigger value="referrals">
                            <Users className="h-4 w-4 mr-2" />
                            Referrals
                        </TabsTrigger>
                    )}
                </TabsList>

                {/* Verification Tab */}
                {profile.role === "owner" && (
                    <TabsContent value="verification" className="space-y-4">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle>Verification Documents</CardTitle>
                                <CardDescription>
                                    {verificationDocs && verificationDocs.length > 0
                                        ? "Document submission history"
                                        : "No documents submitted yet"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!verificationDocs || verificationDocs.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                        <p>No verification documents found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {verificationDocs.map((doc: any) => (
                                            <div key={doc.id} className="border rounded-lg p-4 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium">
                                                            Submitted {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Document Type: {doc.document_type || "ID Verification"}
                                                        </p>
                                                    </div>
                                                    <Badge variant={
                                                        doc.status === "approved" ? "default" :
                                                            doc.status === "rejected" ? "destructive" :
                                                                "secondary"
                                                    }>
                                                        {doc.status}
                                                    </Badge>
                                                </div>

                                                {/* Document Images */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {doc.document_url && (
                                                        <div className="space-y-2">
                                                            <p className="text-sm font-medium">Front ID</p>
                                                            <div className="relative aspect-video rounded-lg overflow-hidden border">
                                                                <Image
                                                                    src={doc.document_url}
                                                                    alt="Front ID"
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <Button variant="outline" size="sm" asChild className="w-full">
                                                                <a href={doc.document_url} target="_blank" rel="noopener noreferrer">
                                                                    View Full Size
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    )}
                                                    {doc.back_image_url && (
                                                        <div className="space-y-2">
                                                            <p className="text-sm font-medium">Back ID</p>
                                                            <div className="relative aspect-video rounded-lg overflow-hidden border">
                                                                <Image
                                                                    src={doc.back_image_url}
                                                                    alt="Back ID"
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <Button variant="outline" size="sm" asChild className="w-full">
                                                                <a href={doc.back_image_url} target="_blank" rel="noopener noreferrer">
                                                                    View Full Size
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    )}
                                                    {doc.selfie_url && (
                                                        <div className="space-y-2">
                                                            <p className="text-sm font-medium">Selfie</p>
                                                            <div className="relative aspect-video rounded-lg overflow-hidden border">
                                                                <Image
                                                                    src={doc.selfie_url}
                                                                    alt="Selfie"
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <Button variant="outline" size="sm" asChild className="w-full">
                                                                <a href={doc.selfie_url} target="_blank" rel="noopener noreferrer">
                                                                    View Full Size
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>

                                                {doc.rejection_reason && (
                                                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                                                        <p className="text-sm font-medium text-destructive flex items-center gap-2">
                                                            <AlertTriangle className="h-4 w-4" />
                                                            Rejection Reason
                                                        </p>
                                                        <p className="text-sm mt-1">{doc.rejection_reason}</p>
                                                    </div>
                                                )}

                                                {doc.status === "pending" && (
                                                    <div className="flex gap-2">
                                                        <Button size="sm" asChild>
                                                            <Link href={`/admin/verifications/${doc.id}`}>
                                                                Review & Approve
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}

                {/* Listings Tab */}
                {profile.role === "owner" && (
                    <TabsContent value="listings">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle>Listings</CardTitle>
                                <CardDescription>Properties listed by this owner</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!listings || listings.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                        <p>No listings found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {listings.map((listing: any) => (
                                            <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    {listing.images?.[0] && (
                                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                                                            <Image
                                                                src={listing.images[0]}
                                                                alt={listing.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{listing.title}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            KSh {listing.price_per_day?.toLocaleString()}/day
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={
                                                        listing.status === "approved" ? "default" :
                                                            listing.status === "rejected" ? "destructive" :
                                                                "secondary"
                                                    }>
                                                        {listing.status}
                                                    </Badge>
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/admin/listings?id=${listing.id}`}>View</Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}

                {/* Bookings Tab */}
                <TabsContent value="bookings" className="space-y-4">
                    {bookingsAsRenter.length > 0 && (
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle>Bookings as Renter</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {bookingsAsRenter.map((booking: any) => (
                                        <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">{booking.listing?.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDistanceToNow(new Date(booking.created_at), { addSuffix: true })}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">KSh {booking.total_amount?.toLocaleString()}</p>
                                                <Badge variant="outline" className="text-xs">{booking.status}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {bookingsAsOwner.length > 0 && (
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle>Bookings as Owner</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {bookingsAsOwner.map((booking: any) => (
                                        <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">{booking.listing?.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDistanceToNow(new Date(booking.created_at), { addSuffix: true })}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">KSh {booking.total_amount?.toLocaleString()}</p>
                                                <Badge variant="outline" className="text-xs">{booking.status}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {bookingsAsRenter.length === 0 && bookingsAsOwner.length === 0 && (
                        <Card className="glass-card">
                            <CardContent className="py-12">
                                <div className="text-center text-muted-foreground">
                                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p>No bookings found</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Referrals Tab */}
                {profile.role === "affiliate" && (
                    <TabsContent value="referrals">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle>Referrals</CardTitle>
                                <CardDescription>Users referred by this affiliate</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!referrals || referrals.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                        <p>No referrals found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {referrals.map((ref: any) => (
                                            <div key={ref.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{ref.referred_user?.full_name || "Unknown"}</p>
                                                    <p className="text-sm text-muted-foreground">{ref.referred_user?.email}</p>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="outline">{ref.referred_user?.role}</Badge>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {formatDistanceToNow(new Date(ref.created_at), { addSuffix: true })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}
            </Tabs>

            <ActionConfirmModal
                open={confirmModal.open}
                onOpenChange={(open) => setConfirmModal((prev) => ({ ...prev, open }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                description={confirmModal.description}
                variant={confirmModal.variant}
                confirmText={confirmModal.confirmText}
                loading={actionLoading}
            />
        </div >
    )
}
