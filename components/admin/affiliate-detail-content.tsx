"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    Users,
    DollarSign,
    TrendingUp,
    ExternalLink,
    List,
    Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getAffiliateReferralsAdmin } from "@/lib/actions/affiliate-actions"
import { toast } from "sonner"

interface AffiliateDetailContentProps {
    user: any
    affiliate: any
}

export function AffiliateDetailContent({ user, affiliate }: AffiliateDetailContentProps) {
    const [referrals, setReferrals] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function loadReferrals() {
            setLoading(true)
            try {
                const data = await getAffiliateReferralsAdmin(user.id)
                setReferrals(data || [])
            } catch (error) {
                console.error("Error loading referrals:", error)
                toast.error("Failed to load referral history")
            } finally {
                setLoading(false)
            }
        }
        loadReferrals()
    }, [user.id])

    const totalEarnings = referrals.reduce((sum, r) => sum + (r.commission_amount || 0), 0)

    if (!affiliate) {
        return (
            <div className="text-center py-20 space-y-4">
                <Users className="h-16 w-16 mx-auto opacity-20" />
                <h2 className="text-2xl font-bold">Affiliate Record Not Found</h2>
                <p className="text-muted-foreground">This user is not currently an active affiliate.</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Affiliates
                </Button>
                <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start bg-muted/30 p-8 rounded-2xl border">
                <Avatar className="h-24 w-24 border-4 border-background">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="text-2xl">{user.full_name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left space-y-2">
                    <h1 className="text-3xl font-bold">{user.full_name}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                        <Badge variant="outline" className="font-mono">{affiliate.referral_code}</Badge>
                        <span className="text-xs text-muted-foreground">Member since {new Date(affiliate.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="md:ml-auto flex gap-2">
                    <Button variant="outline" onClick={() => router.push(`/admin/users/${user.id}`)}>
                        View User Profile <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="glass-card bg-primary/5">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Referrals</CardDescription>
                        <CardTitle className="text-3xl font-bold flex items-center gap-2">
                            <Users className="h-6 w-6 text-primary" />
                            {referrals.length}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="glass-card bg-green-500/5">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Earnings</CardDescription>
                        <CardTitle className="text-3xl font-bold flex items-center gap-2">
                            <DollarSign className="h-6 w-6 text-green-500" />
                            KSh {totalEarnings.toLocaleString()}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="glass-card bg-orange-500/5">
                    <CardHeader className="pb-2">
                        <CardDescription>Commission Rate</CardDescription>
                        <CardTitle className="text-3xl font-bold flex items-center gap-2">
                            <TrendingUp className="h-6 w-6 text-orange-500" />
                            {affiliate.commission_rate || 5}%
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Referral History Table */}
            <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Referral History</CardTitle>
                        <CardDescription>Detailed list of all successful referrals and commissions</CardDescription>
                    </div>
                    <Badge variant="secondary"><List className="h-4 w-4 mr-2" /> {referrals.length} Records</Badge>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-12 text-muted-foreground animate-pulse">Loading referral data...</div>
                    ) : referrals.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-10" />
                            No referral activity recorded yet.
                        </div>
                    ) : (
                        <ScrollArea className="h-[500px]">
                            <Table>
                                <TableHeader className="bg-muted/50 sticky top-0 z-10">
                                    <TableRow>
                                        <TableHead>Referred User</TableHead>
                                        <TableHead>Listing</TableHead>
                                        <TableHead>Commission</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {referrals.map((ref) => (
                                        <TableRow key={ref.id} className="group hover:bg-muted/30 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={ref.referred_user?.avatar_url} />
                                                        <AvatarFallback>{ref.referred_user?.full_name?.[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium">{ref.referred_user?.full_name}</p>
                                                        <p className="text-xs text-muted-foreground">{ref.referred_user?.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[250px] truncate">
                                                {ref.listing?.title || "N/A"}
                                            </TableCell>
                                            <TableCell className="font-semibold text-green-600">
                                                KSh {ref.commission_amount.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={ref.commission_status === 'paid' ? 'default' : 'secondary'} className="capitalize">
                                                    {ref.commission_status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-xs text-muted-foreground">
                                                {new Date(ref.created_at).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
