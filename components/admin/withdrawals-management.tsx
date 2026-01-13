"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Loader2,
    CheckCircle2,
    XCircle,
    Clock,
    Wallet,
    User,
    ArrowUpRight,
    Search
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { approveWithdrawal, rejectWithdrawal } from "@/lib/actions/commission-actions"
import { getAdminWithdrawals } from "@/lib/actions/dashboard-actions"

export function WithdrawalsManagement() {
    const [withdrawals, setWithdrawals] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    const fetchWithdrawals = useCallback(async () => {
        setLoading(true)
        try {
            const data = await getAdminWithdrawals()
            setWithdrawals(data || [])
        } catch (error) {
            console.error('Error fetching withdrawals:', error)
            toast.error("Failed to load withdrawal requests")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchWithdrawals()
    }, [fetchWithdrawals])

    const handleApprove = async (id: string) => {
        const transRef = window.prompt("Enter Transaction Reference (e.g. MPesa Code):")
        if (!transRef) return

        setProcessingId(id)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Not authenticated")

            const result = await approveWithdrawal(id, user.id, transRef)
            if (result.success) {
                toast.success("Withdrawal request approved and marked as completed")
                fetchWithdrawals()
            } else {
                toast.error(result.error || "Failed to approve withdrawal")
            }
        } catch (error) {
            toast.error("An error occurred during approval")
        } finally {
            setProcessingId(null)
        }
    }

    const handleReject = async (id: string) => {
        const reason = window.prompt("Enter rejection reason:")
        if (reason === null) return // Cancelled

        setProcessingId(id)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Not authenticated")

            const result = await rejectWithdrawal(id, user.id, reason)
            if (result.success) {
                toast.success("Withdrawal request rejected and funds returned")
                fetchWithdrawals()
            } else {
                toast.error(result.error || "Failed to reject withdrawal")
            }
        } catch (error) {
            toast.error("An error occurred during rejection")
        } finally {
            setProcessingId(null)
        }
    }

    const filteredWithdrawals = withdrawals.filter(w =>
        w.user_profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.user_profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.id.includes(searchTerm)
    )

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</Badge>
            case 'processing':
                return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="w-3 h-3 mr-1" /> Processing</Badge>
            case 'rejected':
                return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>
            default:
                return <Badge variant="outline" className="animate-pulse"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>
        }
    }

    if (loading && withdrawals.length === 0) {
        return <div className="flex flex-col items-center justify-center p-20"><Loader2 className="animate-spin h-10 w-10 text-primary mb-4" /><p>Loading requests...</p></div>
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Withdrawal Management</h1>
                    <p className="text-muted-foreground">Manage payout requests from owners and affiliates</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search user or ID..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Pending Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{withdrawals.filter(w => w.status === 'pending').length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Total Payouts (KES)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            KSh {withdrawals.filter(w => w.status === 'completed').reduce((sum, w) => sum + Number(w.amount), 0).toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Average Withdrawal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            KSh {withdrawals.length > 0 ? (withdrawals.reduce((sum, w) => sum + Number(w.amount), 0) / withdrawals.length).toLocaleString() : 0}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User / Role</TableHead>
                            <TableHead>Amount & Date</TableHead>
                            <TableHead>Payment Details</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredWithdrawals.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                                    No withdrawal requests found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredWithdrawals.map((w) => (
                                <TableRow key={w.id} className="group hover:bg-muted/50 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={w.user_profiles?.avatar_url} />
                                                <AvatarFallback>
                                                    {w.user_profiles?.full_name?.[0] || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{w.user_profiles?.full_name || 'Unknown User'}</div>
                                                <div className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                                                    <Badge variant="outline" className="px-1 text-[10px] h-4">{w.user_type}</Badge>
                                                    {w.user_profiles?.email}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold text-lg">KSh {Number(w.amount).toLocaleString()}</div>
                                        <div className="text-xs text-muted-foreground">Requested: {new Date(w.created_at).toLocaleDateString()}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[200px]">
                                            <div className="font-medium text-sm flex items-center gap-1 uppercase">
                                                <Wallet className="h-3 w-3" /> {w.payment_method}
                                            </div>
                                            <div className="text-xs text-muted-foreground break-all">
                                                {w.payment_method === 'mpesa' ? (
                                                    <span>Phone: {w.payment_details?.phone_number}</span>
                                                ) : (
                                                    <span>
                                                        {w.payment_details?.bank_name} <br />
                                                        Acc: {w.payment_details?.account_number} <br />
                                                        Name: {w.payment_details?.account_name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(w.status)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {w.status === 'pending' || w.status === 'processing' ? (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                                        onClick={() => handleReject(w.id)}
                                                        disabled={processingId === w.id}
                                                    >
                                                        {processingId === w.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-4 h-4 mr-1" />}
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleApprove(w.id)}
                                                        disabled={processingId === w.id}
                                                    >
                                                        {processingId === w.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-1" />}
                                                        Approve
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button variant="ghost" size="sm" disabled>
                                                    Processed
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
