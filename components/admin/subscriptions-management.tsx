"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
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
    Filter,
    AlertCircle
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Payment {
    id: string
    reference: string
    amount: number
    currency: string
    status: string
    payment_method: string | null
    customer_email: string
    customer_name: string | null
    paid_at: string | null
    created_at: string
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
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [activeTab, setActiveTab] = useState("payments")

    const fetchData = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            // Fetch payments without joins to avoid relationship errors
            const { data: paymentsData, error: paymentsError } = await supabase
                .from("payments")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(100)

            if (paymentsError) {
                console.error("Error fetching payments:", paymentsError)
                setError(`Failed to load payments: ${paymentsError.message}`)
            }

            // Fetch subscriptions without joins
            const { data: subscriptionsData, error: subscriptionsError } = await supabase
                .from("subscriptions")
                .select("*")
                .order("created_at", { ascending: false })

            if (subscriptionsError) {
                console.error("Error fetching subscriptions:", subscriptionsError)
                setError(`Failed to load subscriptions: ${subscriptionsError.message}`)
            }

            setPayments(paymentsData || [])
            setSubscriptions(subscriptionsData || [])

            // Calculate stats
            if (paymentsData) {
                const successful = paymentsData.filter(p => p.status === 'success')
                const totalRevenue = successful.reduce((sum, p) => sum + Number(p.amount), 0)
                const successRate = paymentsData.length > 0
                    ? (successful.length / paymentsData.length) * 100
                    : 0

                setStats({
                    totalRevenue,
                    totalPayments: paymentsData.length,
                    activeSubscriptions: subscriptionsData?.filter(s => s.status === 'active').length || 0,
                    successRate
                })
            }
        } catch (error: any) {
            console.error("Error fetching data:", error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }, [])

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
            sub.subscription_code.toLowerCase().includes(searchQuery.toLowerCase())

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
            ? ["Reference", "Amount", "Currency", "Status", "Customer", "Date"]
            : ["Plan", "Amount", "Status", "Code", "Created"]

        const rows = data.map((item: any) => {
            if (activeTab === "payments") {
                return [
                    item.reference,
                    item.amount,
                    item.currency,
                    item.status,
                    item.customer_email,
                    new Date(item.created_at).toLocaleDateString()
                ]
            } else {
                return [
                    item.plan_name,
                    item.amount,
                    item.status,
                    item.subscription_code,
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
            {error && (
                <Card className="p-4 bg-red-500/10 border-red-500/20">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                            <p className="font-semibold text-red-600 dark:text-red-400">Error Loading Data</p>
                            <p className="text-sm text-muted-foreground">{error}</p>
                            <Button variant="outline" size="sm" onClick={fetchData} className="mt-2">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Retry
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Revenue</p>
                            <p className="text-2xl font-bold">
                                KSh {stats.totalRevenue.toLocaleString()}
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
                            <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
                            <TabsTrigger value="subscriptions">Subscriptions ({subscriptions.length})</TabsTrigger>
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

                            <Button variant="outline" onClick={fetchData}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>

                            <Button
                                variant="default"
                                onClick={async () => {
                                    setLoading(true)
                                    try {
                                        const response = await fetch('/api/sync-payments', { method: 'POST' })
                                        const result = await response.json()
                                        if (result.success) {
                                            alert(`Synced ${result.synced} new payments, skipped ${result.skipped} existing`)
                                            fetchData()
                                        } else {
                                            alert('Sync failed: ' + result.error)
                                        }
                                    } catch (error: any) {
                                        alert('Sync failed: ' + error.message)
                                    } finally {
                                        setLoading(false)
                                    }
                                }}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Sync Payments
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
                                <p className="font-medium">No payments found</p>
                                <p className="text-sm mt-2">Payments will appear here after webhook is configured</p>
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
                                                        <p className="font-medium">{payment.customer_name || 'N/A'}</p>
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
                                            <th className="text-left p-3 font-medium">Code</th>
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
                                                    <code className="text-xs bg-muted px-2 py-1 rounded">
                                                        {sub.subscription_code}
                                                    </code>
                                                </td>
                                                <td className="p-3 font-medium">{sub.plan_name}</td>
                                                <td className="p-3 font-semibold">
                                                    KSh {Number(sub.amount).toLocaleString()}
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
