"use client"

import { Search, Plus, MoreHorizontal, UserMinus, Shield, ShieldOff, Ban, CheckCircle, Mail, Eye, Trash2 } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAdminStaffData, promoteToStaff, demoteFromStaff, getPendingStaffRequests, rejectStaffRequest } from "@/lib/actions/staff-actions"
import { suspendUsers, reactivateUsers, deleteUsers } from "@/lib/actions/admin-actions"
import { ActionConfirmModal } from "./action-confirm-modal"
import { UserSelector } from "./user-selector"

export function StaffManagement() {
    const { toast } = useToast()
    const [searchQuery, setSearchQuery] = useState("")
    const [staff, setStaff] = useState<any[]>([])
    const [pendingRequests, setPendingRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [actionLoading, setActionLoading] = useState(false)

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

    const loadStaff = useCallback(async () => {
        setLoading(true)
        const [staffResult, pendingResult] = await Promise.all([
            getAdminStaffData(),
            getPendingStaffRequests()
        ])

        if (staffResult.success) {
            setStaff(staffResult.data || [])
        } else {
            toast({ title: "Error", description: staffResult.error, variant: "destructive" })
        }

        if (pendingResult.success) {
            setPendingRequests(pendingResult.data || [])
        }

        setLoading(false)
    }, [toast])

    useEffect(() => {
        loadStaff()
    }, [loadStaff])

    const handlePromote = async () => {
        if (!selectedUser) return
        setActionLoading(true)
        const result = await promoteToStaff(selectedUser.email)
        setActionLoading(false)
        if (result.success) {
            toast({ title: "Success", description: result.message })
            setIsAddDialogOpen(false)
            setSelectedUser(null)
            loadStaff()
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" })
        }
    }

    const handleApprove = async (email: string) => {
        setConfirmModal({
            open: true,
            title: "Approve Staff Request",
            description: `Are you sure you want to approve the staff request for ${email}?`,
            variant: "default",
            confirmText: "Approve",
            onConfirm: async () => {
                setActionLoading(true)
                const result = await promoteToStaff(email)
                setActionLoading(false)
                setConfirmModal(prev => ({ ...prev, open: false }))
                if (result.success) {
                    toast({ title: "Approved", description: result.message })
                    loadStaff()
                } else {
                    toast({ title: "Error", description: result.error, variant: "destructive" })
                }
            }
        })
    }

    const handleReject = async (userId: string) => {
        setConfirmModal({
            open: true,
            title: "Reject Staff Request",
            description: "Are you sure you want to reject this staff request? The user will return to their previous role.",
            variant: "warning",
            confirmText: "Reject",
            onConfirm: async () => {
                setActionLoading(true)
                const result = await rejectStaffRequest(userId)
                setActionLoading(false)
                setConfirmModal(prev => ({ ...prev, open: false }))
                if (result.success) {
                    toast({ title: "Rejected", description: result.message })
                    loadStaff()
                } else {
                    toast({ title: "Error", description: result.error, variant: "destructive" })
                }
            }
        })
    }

    const handleDemote = async (userId: string) => {
        setConfirmModal({
            open: true,
            title: "Demote Staff Member",
            description: "Are you sure you want to demote this staff member? They will return to a standard user role.",
            variant: "warning",
            confirmText: "Demote",
            onConfirm: async () => {
                setActionLoading(true)
                const result = await demoteFromStaff(userId)
                setActionLoading(false)
                setConfirmModal(prev => ({ ...prev, open: false }))
                if (result.success) {
                    toast({ title: "Success", description: result.message })
                    loadStaff()
                } else {
                    toast({ title: "Error", description: result.error, variant: "destructive" })
                }
            }
        })
    }

    const handleSuspend = async (userId: string) => {
        setConfirmModal({
            open: true,
            title: "Suspend Staff Account",
            description: "Are you sure you want to suspend this staff member's account? They will lose access to the platform.",
            variant: "destructive",
            confirmText: "Suspend",
            onConfirm: async () => {
                setActionLoading(true)
                const result = await suspendUsers([userId])
                setActionLoading(false)
                setConfirmModal(prev => ({ ...prev, open: false }))
                if (result.success) {
                    toast({ title: "Success", description: "Staff account suspended" })
                    loadStaff()
                } else {
                    toast({ title: "Error", description: "Failed to suspend account", variant: "destructive" })
                }
            }
        })
    }

    const handleReactivate = async (userId: string) => {
        setConfirmModal({
            open: true,
            title: "Reactivate Staff Account",
            description: "Are you sure you want to reactivate this staff member's account?",
            variant: "default",
            confirmText: "Reactivate",
            onConfirm: async () => {
                setActionLoading(true)
                const result = await reactivateUsers([userId])
                setActionLoading(false)
                setConfirmModal(prev => ({ ...prev, open: false }))
                if (result.success) {
                    toast({ title: "Success", description: "Staff account reactivated" })
                    loadStaff()
                } else {
                    toast({ title: "Error", description: "Failed to reactivate account", variant: "destructive" })
                }
            }
        })
    }

    const handleDelete = async (userId: string) => {
        setConfirmModal({
            open: true,
            title: "DELETE STAFF PERMANENTLY",
            description: "Are you sure you want to PERMANENTLY DELETE this staff member? This will remove all their data and cannot be undone.",
            variant: "destructive",
            confirmText: "Delete Permanently",
            onConfirm: async () => {
                setActionLoading(true)
                const result = await deleteUsers([userId])
                setActionLoading(false)
                setConfirmModal(prev => ({ ...prev, open: false }))
                if (result.success) {
                    toast({ title: "Success", description: "Staff member deleted successfully" })
                    loadStaff()
                } else {
                    toast({ title: "Error", description: result.error || "Failed to delete staff", variant: "destructive" })
                }
            }
        })
    }

    const filteredStaff = staff.filter(s =>
        s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
                    <p className="text-muted-foreground">Manage administrative and support team members</p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-primary text-primary-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Staff Member
                </Button>
            </div>

            <Tabs defaultValue="staff" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="staff">Staff Team ({filteredStaff.length})</TabsTrigger>
                    <TabsTrigger value="requests">Pending Requests ({pendingRequests.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="staff">
                    <Card className="glass-card">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Staff Team ({filteredStaff.length})</CardTitle>
                                    <CardDescription>Users with access to the staff dashboard</CardDescription>
                                </div>
                                <div className="relative w-64">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search staff..."
                                        className="pl-8"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Member</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow><TableCell colSpan={4} className="text-center py-10">Loading staff...</TableCell></TableRow>
                                    ) : filteredStaff.length === 0 ? (
                                        <TableRow><TableCell colSpan={4} className="text-center py-10">No staff members found.</TableCell></TableRow>
                                    ) : (
                                        filteredStaff.map((member) => (
                                            <TableRow key={member.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarImage src={member.avatar_url} />
                                                            <AvatarFallback>{member.full_name?.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-semibold text-sm">{member.full_name}</p>
                                                            <p className="text-xs text-muted-foreground">{member.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={member.account_status === "active" ? "default" : "destructive"}>
                                                        {member.account_status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(member.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => { }}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View Profile
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDemote(member.id)} className="text-orange-600">
                                                                <UserMinus className="h-4 w-4 mr-2" />
                                                                Demote to User
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            {member.account_status === "active" ? (
                                                                <DropdownMenuItem onClick={() => handleSuspend(member.id)} className="text-destructive">
                                                                    <Ban className="h-4 w-4 mr-2" />
                                                                    Suspend Account
                                                                </DropdownMenuItem>
                                                            ) : (
                                                                <DropdownMenuItem onClick={() => handleReactivate(member.id)} className="text-green-600">
                                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                                    Reactivate Account
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleDelete(member.id)} className="text-destructive">
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete Account
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="requests">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Staff Access Requests ({pendingRequests.length})</CardTitle>
                            <CardDescription>Users waiting for approval to access staff tools</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Requested At</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow><TableCell colSpan={3} className="text-center py-10">Loading requests...</TableCell></TableRow>
                                    ) : pendingRequests.length === 0 ? (
                                        <TableRow><TableCell colSpan={3} className="text-center py-10">No pending staff requests.</TableCell></TableRow>
                                    ) : (
                                        pendingRequests.map((request) => (
                                            <TableRow key={request.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarImage src={request.avatar_url} />
                                                            <AvatarFallback>{request.full_name?.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-semibold text-sm">{request.full_name}</p>
                                                            <p className="text-xs text-muted-foreground">{request.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(request.last_login_at || request.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleReject(request.id)}
                                                            disabled={actionLoading}
                                                        >
                                                            Reject
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700 text-white"
                                                            onClick={() => handleApprove(request.email)}
                                                            disabled={actionLoading}
                                                        >
                                                            Approve
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Staff Member</DialogTitle>
                        <DialogDescription>Enter the email address of the user you want to promote to staff.</DialogDescription>
                    </DialogHeader>
                    <div className="pt-6 pb-2 space-y-6">
                        <div className="flex flex-col items-center text-center space-y-2 mb-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <Label className="text-lg font-semibold">Select User to Promote</Label>
                            <p className="text-sm text-muted-foreground max-w-[300px]">
                                Search and select a verified user to give them staff privileges.
                            </p>
                        </div>
                        <div className="px-1">
                            <UserSelector
                                onSelect={setSelectedUser}
                                excludeRoles={['staff', 'admin']}
                                placeholder="Search users by name or email..."
                            />
                        </div>
                        {selectedUser && (
                            <div className="p-4 rounded-xl bg-muted/50 border border-border animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                                        <AvatarImage src={selectedUser.avatar_url} />
                                        <AvatarFallback className="bg-primary/10 text-primary">{selectedUser.full_name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold truncate">{selectedUser.full_name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{selectedUser.email}</p>
                                    </div>
                                    <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-0">
                                        Ready
                                    </Badge>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handlePromote} disabled={actionLoading || !selectedUser}>
                            {actionLoading ? "Promoting..." : "Add to Staff"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
        </div>
    )
}
