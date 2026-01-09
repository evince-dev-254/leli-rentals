"use client"

import { useState, useEffect } from "react"
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Clock,
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  Download,
  AlertTriangle,
  Package,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import type { User, VerificationDocument } from "@/lib/types"
import { updateDocumentStatus, getAdminVerificationsAppData } from "@/lib/actions/dashboard-actions"
import { toast } from "sonner"

export function VerificationsManagement() {
  const [selectedDocument, setSelectedDocument] = useState<(VerificationDocument & { user: User }) | null>(null)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  const [verificationDocs, setVerificationDocs] = useState<VerificationDocument[]>([])
  const [pendingListings, setPendingListings] = useState<any[]>([])
  const [relatedUsers, setRelatedUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let mounted = true

    async function loadData() {
      setLoading(true)
      try {
        const { docs, listings, users } = await getAdminVerificationsAppData()

        if (!mounted) return

        // Map documents to match VerificationDocument interface
        const mappedDocs: VerificationDocument[] = (docs || []).map((d: any) => ({
          id: d.id,
          userId: d.user_id,
          type: d.document_type,
          fileUrl: d.document_url,
          fileName: d.document_url?.split('/').pop() || 'document',
          uploadedAt: d.created_at ? new Date(d.created_at) : new Date(),
          status: d.status,
          reviewedBy: d.verified_by,
          reviewedAt: d.verified_at ? new Date(d.verified_at) : null,
          rejectionReason: d.rejection_reason,
          // Extra fields that might be used via (as any)
          document_number: d.document_number
        } as any))

        setVerificationDocs(mappedDocs)
        setPendingListings(listings || [])

        const mappedUsers: User[] = (users || []).map((u: any) => ({
          id: u.id,
          email: u.email,
          fullName: u.full_name ?? "",
          phone: u.phone ?? "",
          avatarUrl: u.avatar_url ?? null,
          role: (u.role as any) ?? "renter",
          accountStatus: (u.account_status as any) ?? "active",
          verificationStatus: (u.verification_status as any) ?? "pending",
          verificationDeadline: u.verification_deadline ? new Date(u.verification_deadline) : null,
          verificationDocuments: [],
          subscriptionPlan: (u.subscription_plan as any) ?? null,
          subscriptionExpiresAt: u.subscription_expires_at ? new Date(u.subscription_expires_at) : null,
          createdAt: u.created_at ? new Date(u.created_at) : new Date(),
          updatedAt: u.updated_at ? new Date(u.updated_at) : new Date(),
          lastLoginAt: u.last_login_at ? new Date(u.last_login_at) : null,
          affiliateCode: u.affiliate_code ?? null,
          referredBy: u.referred_by ?? null,
          totalReferrals: u.total_referrals ?? 0,
          totalEarnings: u.total_earnings ?? 0,
          // New Fields
          dateOfBirth: u.date_of_birth,
          nextOfKinName: u.next_of_kin_name,
          nextOfKinPhone: u.next_of_kin_phone,
          nextOfKinRelationship: u.next_of_kin_relationship,
        }))

        setRelatedUsers(mappedUsers)
      } catch (err) {
        console.error("Error loading admin data:", err)
        toast.error("Failed to load verification data")
      } finally {
        setLoading(false)
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [])

  // derive pending documents and users from fetched data
  const pendingDocs = verificationDocs
    .filter((d) => d.status === "pending")
    .map((doc) => {
      const user = relatedUsers.find((u) => u.id === doc.userId);
      return {
        ...doc,
        user: user as User,
      };
    })
    .filter((doc) => doc.user && doc.user.role === 'owner'); // Enforce Owner Only

  const pendingUsers = relatedUsers.filter((u) => {
    // Only owners need verification
    if (u.role !== "owner") return false

    const userDocs = verificationDocs.filter((d) => d.userId === u.id)
    // if no docs, they're awaiting submission
    if (userDocs.length === 0) return true
    // if all docs are not approved, consider them pending
    return userDocs.every((d) => d.status !== "approved")
  })

  const submittedUsers = relatedUsers.filter((u) => {
    if (u.role !== "owner") return false
    const userDocs = verificationDocs.filter((d) => d.userId === u.id)
    return userDocs.some((d) => d.status === "pending")
  })

  const getDaysRemaining = (deadline: Date | null) => {
    if (!deadline) return null
    const days = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  const handleApproveListing = async (listingId: string) => {
    try {
      const { error } = await supabase.from("listings").update({ status: "approved" }).eq("id", listingId)
      if (error) throw error

      // Update local state
      setPendingListings((prev) => prev.filter((l) => l.id !== listingId))
    } catch (err) {
      console.error("Error approving listing:", err)
    }
  }

  const handleRejectListing = async (listingId: string) => {
    // For now, simple reject (delete or set status rejected)
    try {
      const { error } = await supabase.from("listings").update({ status: "rejected" }).eq("id", listingId)
      if (error) throw error
      setPendingListings((prev) => prev.filter((l) => l.id !== listingId))
    } catch (err) {
      console.error("Error rejecting listing:", err)
    }
  }

  const handleUpdateStatus = async (status: 'approved' | 'rejected', reason?: string) => {
    if (!selectedDocument) return;
    try {
      await updateDocumentStatus(selectedDocument.id, status, reason);
      // Update local state
      setVerificationDocs(prev => prev.map(d => d.id === selectedDocument.id ? { ...d, status } : d)); // reason not in type yet but ok
      setRejectDialogOpen(false);
      setSelectedDocument(null);
      toast.success(`Document ${status}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Verifications</h1>
        <p className="text-muted-foreground">Review and manage user verification documents</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-orange-500/20">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingUsers.length}</p>
                <p className="text-sm text-muted-foreground">Awaiting Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/20">
                <ShieldAlert className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingDocs.length}</p>
                <p className="text-sm text-muted-foreground">Documents to Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-500/20">
                <Package className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingListings.length}</p>
                <p className="text-sm text-muted-foreground">Listings to Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-500/20">
                <ShieldX className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{relatedUsers.filter((u) => u.accountStatus === "suspended").length}</p>
                <p className="text-sm text-muted-foreground">Suspended (Deadline Passed)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Tabs */}
      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">
            Documents to Review
            {pendingDocs.length > 0 && <Badge className="ml-2 bg-primary">{pendingDocs.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="pending">
            Awaiting Documents
            {pendingUsers.length > 0 && (
              <Badge className="ml-2" variant="secondary">
                {pendingUsers.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="listings">
            Listing Verifications
            {pendingListings.length > 0 && <Badge className="ml-2 bg-purple-600">{pendingListings.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="all">All Verifications</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Documents Pending Review</CardTitle>
              <CardDescription>Review submitted verification documents</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingDocs.length === 0 ? (
                <div className="text-center py-12">
                  <ShieldCheck className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-medium">All caught up!</h3>
                  <p className="text-muted-foreground">No documents pending review</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={doc.user.avatarUrl || undefined} />
                          <AvatarFallback>
                            {doc.user.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{doc.user.fullName}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {doc.user.role}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{doc.user.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            {(doc.type || "Document").replace("_", " ")}
                          </p>
                          <p className="text-sm text-muted-foreground">{doc.fileName}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/admin/verifications/${doc.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Users Awaiting Document Submission</CardTitle>
              <CardDescription>Owners and affiliates who have not submitted verification documents</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingUsers.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-medium">No pending users</h3>
                  <p className="text-muted-foreground">All users have submitted their documents</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map((user) => {
                    const daysRemaining = getDaysRemaining(user.verificationDeadline)
                    const isUrgent = daysRemaining !== null && daysRemaining <= 2

                    return (
                      <div
                        key={user.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${isUrgent ? "bg-red-500/10 border-red-500/30" : "bg-background/50 border-border"
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={user.avatarUrl || undefined} />
                            <AvatarFallback>
                              {user.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.fullName}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {user.role}
                              </Badge>
                              <span className="text-sm text-muted-foreground">{user.email}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {daysRemaining !== null && (
                            <Badge variant={isUrgent ? "destructive" : "secondary"} className="flex items-center gap-1">
                              {isUrgent && <AlertTriangle className="h-3 w-3" />}
                              <Clock className="h-3 w-3" />
                              {daysRemaining > 0 ? `${daysRemaining} days left` : "Deadline passed"}
                            </Badge>
                          )}
                          <Button variant="outline" size="sm">
                            Send Reminder
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Listings Pending Review</CardTitle>
              <CardDescription>Review and approve new rental listings</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingListings.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-medium">No pending listings</h3>
                  <p className="text-muted-foreground">All listings have been reviewed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingListings.map((listing) => {
                    const owner = relatedUsers.find(u => u.id === listing.owner_id)
                    return (
                      <div
                        key={listing.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border"
                      >
                        <div className="flex items-center gap-4">
                          {listing.images && listing.images[0] && (
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="h-16 w-24 object-cover rounded-md"
                            />
                          )}
                          <div>
                            <p className="font-medium text-lg">{listing.title}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{owner?.fullName || 'Unknown Owner'}</span>
                              <span>•</span>
                              <span>KSh {listing.price_per_day}/day</span>
                              <span>•</span>
                              <Badge variant="outline" className="capitalize">{listing.category_id}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                            onClick={() => handleApproveListing(listing.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={() => handleRejectListing(listing.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>All Verification Records</CardTitle>
              <CardDescription>History of all verification documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {verificationDocs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No verification documents found.</div>
                ) : (
                  verificationDocs.map((doc) => {
                    const user = relatedUsers.find((u) => u.id === doc.userId)
                    if (!user) return null

                    return (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={user.avatarUrl || undefined} />
                            <AvatarFallback>
                              {user.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.fullName}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {user.role}
                              </Badge>
                              <span className="text-sm text-muted-foreground">{user.email}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right hidden md:block">
                            <p className="font-medium capitalize text-sm">{(doc.type || "Document").replace("_", " ")}</p>
                            <p className="text-xs text-muted-foreground">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                          </div>

                          <Badge
                            variant={
                              doc.status === "approved"
                                ? "default"
                                : doc.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className={
                              doc.status === "approved"
                                ? "bg-green-500/20 text-green-600 border-green-500/30"
                                : ""
                            }
                          >
                            {doc.status}
                          </Badge>

                          <Button variant="ghost" size="sm" asChild>
                            <a href={`/admin/verifications/${doc.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </a>
                          </Button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Document Review Dialog */}
      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Review Verification Document</DialogTitle>
            <DialogDescription>Review the submitted document and approve or reject it</DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedDocument.user.avatarUrl || undefined} />
                  <AvatarFallback>
                    {selectedDocument.user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedDocument.user.fullName}</p>
                  <p className="text-sm text-muted-foreground">{selectedDocument.user.email}</p>
                </div>
                <Badge className="ml-auto">{selectedDocument.user.role}</Badge>
              </div>

              {/* Document Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Document Type</p>
                  <p className="font-medium capitalize">{(selectedDocument.type || '').replace("_", " ")}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Document Number</p>
                  <p className="font-medium uppercase">{(selectedDocument as any).document_number || 'N/A'}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{(selectedDocument.user as any).dateOfBirth || 'N/A'}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">File Name</p>
                  <p className="font-medium">{selectedDocument.fileName}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Uploaded</p>
                  <p className="font-medium">{selectedDocument.uploadedAt.toLocaleDateString()}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="secondary">{selectedDocument.status}</Badge>
                </div>
              </div>

              {/* Next of Kin */}
              <div className="p-4 rounded-lg bg-secondary/50">
                <h4 className="font-semibold mb-2">Next of Kin</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span> <span className="font-medium">{(selectedDocument.user as any).nextOfKinName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Relation:</span> <span className="font-medium">{(selectedDocument.user as any).nextOfKinRelationship || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span> <span className="font-medium">{(selectedDocument.user as any).nextOfKinPhone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Document Preview */}
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-medium">Document Preview</p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <img
                    src={selectedDocument.fileUrl || "/placeholder.svg"}
                    alt="Document preview"
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-600/10 bg-transparent"
                  onClick={() => setRejectDialogOpen(true)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>

                <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleUpdateStatus('approved')}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
            <Button variant="destructive" onClick={() => handleUpdateStatus('rejected', rejectionReason)}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  )
}
