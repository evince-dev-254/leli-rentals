"use client"

import { useEffect, useState, useCallback } from "react"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    CreditCard,
    Users,
    DollarSign,
    TrendingUp,
    Search,
    Download,
    RefreshCw,
    XCircle,
    CheckCircle,
    Clock,
    Filter
} from "lucide-react"
import { getAdminPayments } from "@/lib/actions/admin-actions"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Payment {
    id: string
    reference: string
    amount: number
    currency: string
    status: string
    payment_method: string | null
    customer_email: string
    customer_name: string
    paid_at: string | null
    created_at: string
    user_profiles: {
        full_name: string
        email: string
    } | null
    bookings: {
        id: string
        listing_title: string
    } | null
}

interface Subscription {
    id: string
    subscription_code: string
    plan_name: string
    amount: number
    status: string
    next_payment_date: string | null
    created_at: string
    cancelled_at: string | null
    user_profiles: {
        full_name: string
        email: string
        avatar_url: string | null
    }
}

interface Stats {
    totalRevenue: number
    totalPayments: number
    activeSubscriptions: number
    successRate: number
}

export function SubscriptionsManagement() {
    const [payments, setPayments] = useState<Payment[]>([])
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
    const [stats, setStats] = useState<Stats>({
        totalRevenue: 0,
        totalPayments: 0,
        activeSubscriptions: 0,
        successRate: 0
    })
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [activeTab, setActiveTab] = useState("payments")

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const result = await getAdminPayments()

            if (result.success) {
                setPayments(result.payments as Payment[])
                setSubscriptions(result.subscriptions as Subscription[])

                // Calculate stats
                const successful = result.payments!.filter((p: any) => p.status === 'success')
                const totalRevenue = successful.reduce((sum: number, p: any) => sum + Number(p.amount), 0)
                const successRate = result.payments!.length > 0
                    ? (successful.length / result.payments!.length) * 100
                    : 0

                setStats({
                    totalRevenue,
                    totalPayments: result.payments!.length,
                    activeSubscriptions: (result.subscriptions as any[]).filter(s => s.status === 'active').length || 0,
                    successRate
                })
            } else {
                toast.error(result.error || "Failed to fetch data")
            }
        } catch (error) {
            console.error("Error fetching data:", error)
            toast.error("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }, [])

    const syncPayments = async () => {
        setLoading(true)
        try {
            toast.loading("Syncing with Paystack...", { id: "sync" })
            const response = await fetch("/api/sync-payments", {
                method: "POST"
            })
            const data = await response.json()

            if (data.success) {
                toast.success(`Sync complete! ${data.synced} new payments found.`, { id: "sync" })
                fetchData()
            } else {
                toast.error(data.error || "Failed to sync payments", { id: "sync" })
            }
        } catch (error) {
            console.error("Error syncing:", error)
            toast.error("Failed to connect to sync server", { id: "sync" })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const filteredPayments = payments.filter(payment => {
        const matchesSearch =
            payment.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.customer_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === "all" || payment.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const filteredSubscriptions = subscriptions.filter(sub => {
        const matchesSearch =
            sub.plan_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.user_profiles.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.user_profiles.full_name.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === "all" || sub.status === statusFilter

        return matchesSearch && matchesStatus
    })

    function getStatusBadge(status: string) {
        const variants: Record<string, { variant: any; icon: any }> = {
            success: { variant: "default", icon: CheckCircle },
            active: { variant: "default", icon: CheckCircle },
            failed: { variant: "destructive", icon: XCircle },
            cancelled: { variant: "destructive", icon: XCircle },
            expired: { variant: "secondary", icon: Clock },
            pending: { variant: "secondary", icon: Clock },
        }

        const config = variants[status] || { variant: "secondary", icon: Clock }
        const Icon = config.icon

        return (
            <Badge variant={config.variant as any} className="gap-1">
                <Icon className="h-3 w-3" />
                {status}
            </Badge>
        )
    }

    function exportToCSV() {
        const data = activeTab === "payments" ? filteredPayments : filteredSubscriptions
        const headers = activeTab === "payments"
            ? ["Reference", "Amount", "Status", "Customer", "Date"]
            : ["Plan", "Amount", "Status", "Customer", "Next Payment", "Created"]

        const rows = data.map((item: any) => {
            if (activeTab === "payments") {
                return [
                    item.reference,
                    `${item.currency} ${item.amount}`,
                    item.status,
                    item.customer_email,
                    new Date(item.created_at).toLocaleDateString()
                ]
            } else {
                return [
                    item.plan_name,
                    `NGN ${item.amount}`,
                    item.status,
                    item.user_profiles.email,
                    item.next_payment_date ? new Date(item.next_payment_date).toLocaleDateString() : 'N/A',
                    new Date(item.created_at).toLocaleDateString()
                ]
            }
        })

        const csv = [headers, ...rows].map(row => row.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${activeTab}_${new Date().toISOString().split('T')[0]}.csv`
        a.click()
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Revenue</p>
                            <p className="text-2xl font-bold">
                                NGN {stats.totalRevenue.toLocaleString()}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Payments</p>
                            <p className="text-2xl font-bold">{stats.totalPayments}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                            <CreditCard className="h-6 w-6 text-blue-500" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                            <p className="text-2xl font-bold">{stats.activeSubscriptions}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-green-500" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Success Rate</p>
                            <p className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-purple-500" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content */}
            <Card className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <TabsList>
                            <TabsTrigger value="payments">Payments</TabsTrigger>
                            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                        </TabsList>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1 sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-40">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    {activeTab === "payments" ? (
                                        <>
                                            <SelectItem value="success">Success</SelectItem>
                                            <SelectItem value="failed">Failed</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                        </>
                                    ) : (
                                        <>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                            <SelectItem value="expired">Expired</SelectItem>
                                        </>
                                    )}
                                </SelectContent>
                            </Select>

                            <Button variant="outline" onClick={fetchData} disabled={loading}>
                                <RefreshCw className={cn("h-4 w-4 mr-2", loading && activeTab === "payments" && "animate-spin")} />
                                Refresh
                            </Button>

                            <Button variant="default" onClick={syncPayments} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                                <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                                Sync with Paystack
                            </Button>

                            <Button variant="outline" onClick={exportToCSV}>
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>

                    <TabsContent value="payments" className="mt-0">
                        {loading ? (
                            <div className="text-center py-12">
                                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                            </div>
                        ) : filteredPayments.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>No payments found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-3 font-medium">Reference</th>
                                            <th className="text-left p-3 font-medium">Customer</th>
                                            <th className="text-left p-3 font-medium">Amount</th>
                                            <th className="text-left p-3 font-medium">Status</th>
                                            <th className="text-left p-3 font-medium">Method</th>
                                            <th className="text-left p-3 font-medium">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPayments.map((payment) => (
                                            <tr key={payment.id} className="border-b hover:bg-muted/50">
                                                <td className="p-3">
                                                    <code className="text-xs bg-muted px-2 py-1 rounded">
                                                        {payment.reference}
                                                    </code>
                                                </td>
                                                <td className="p-3">
                                                    <div>
                                                        <p className="font-medium">{payment.customer_name || payment.user_profiles?.full_name}</p>
                                                        <p className="text-sm text-muted-foreground">{payment.customer_email}</p>
                                                    </div>
                                                </td>
                                                <td className="p-3 font-semibold">
                                                    {payment.currency} {Number(payment.amount).toLocaleString()}
                                                </td>
                                                <td className="p-3">{getStatusBadge(payment.status)}</td>
                                                <td className="p-3 text-sm capitalize">{payment.payment_method || 'N/A'}</td>
                                                <td className="p-3 text-sm text-muted-foreground">
                                                    {formatDistanceToNow(new Date(payment.created_at), { addSuffix: true })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="subscriptions" className="mt-0">
                        {loading ? (
                            <div className="text-center py-12">
                                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                            </div>
                        ) : filteredSubscriptions.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>No subscriptions found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-3 font-medium">Customer</th>
                                            <th className="text-left p-3 font-medium">Plan</th>
                                            <th className="text-left p-3 font-medium">Amount</th>
                                            <th className="text-left p-3 font-medium">Status</th>
                                            <th className="text-left p-3 font-medium">Next Payment</th>
                                            <th className="text-left p-3 font-medium">Started</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSubscriptions.map((sub) => (
                                            <tr key={sub.id} className="border-b hover:bg-muted/50">
                                                <td className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        {sub.user_profiles.avatar_url ? (
                                                            <Image
                                                                src={sub.user_profiles.avatar_url}
                                                                alt={sub.user_profiles.full_name}
                                                                width={32}
                                                                height={32}
                                                                className="w-8 h-8 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                                <Users className="h-4 w-4 text-primary" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium">{sub.user_profiles.full_name}</p>
                                                            <p className="text-sm text-muted-foreground">{sub.user_profiles.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3 font-medium">{sub.plan_name}</td>
                                                <td className="p-3 font-semibold">
                                                    NGN {Number(sub.amount).toLocaleString()}
                                                </td>
                                                <td className="p-3">{getStatusBadge(sub.status)}</td>
                                                <td className="p-3 text-sm">
                                                    {sub.next_payment_date
                                                        ? new Date(sub.next_payment_date).toLocaleDateString()
                                                        : 'N/A'
                                                    }
                                                </td>
                                                <td className="p-3 text-sm text-muted-foreground">
                                                    {formatDistanceToNow(new Date(sub.created_at), { addSuffix: true })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    )
}
