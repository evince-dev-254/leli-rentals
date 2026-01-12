"use client"
import { useState, useEffect } from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, Megaphone, ArrowUpRight, ShieldCheck, Paintbrush } from "lucide-react"
import Link from "next/link"
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card"
import { getStaffStats } from "@/lib/actions/staff-actions"
import { supabase } from "@/lib/supabase"
import { LoadingLogo } from "@/components/ui/loading-logo"

export default function StaffOverviewPage() {
    const [stats, setStats] = useState({
        totalAffiliates: 0,
        activeAffiliates: 0,
        totalAdvertisers: 0,
        pendingApprovals: 0,
        totalStaff: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadStats() {
            try {
                const data = await getStaffStats()
                setStats(data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        loadStats()
    }, [])

    if (loading) return <div className="flex h-[80vh] items-center justify-center"><LoadingLogo size={60} /></div>

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Staff Dashboard</h1>
                <p className="text-muted-foreground text-base md:text-lg">Detailed overview of sales and affiliate performance.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardStatCard
                    title="Total Affiliates"
                    value={stats.totalAffiliates}
                    icon={Users}
                    color="blue"
                    description={`${stats.activeAffiliates} active partners`}
                />
                <DashboardStatCard
                    title="Potential Advertisers"
                    value={stats.totalAdvertisers}
                    icon={Megaphone}
                    color="purple"
                    description="Registered Owners"
                />
                <DashboardStatCard
                    title="Pending Reviews"
                    value={stats.pendingApprovals}
                    icon={TrendingUp}
                    color="orange"
                    description="Affiliates waiting approval"
                />
                <DashboardStatCard
                    title="Total Staff"
                    value={stats.totalStaff}
                    icon={Users}
                    color="green"
                    description="Active sales team members"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass-card hover:shadow-lg transition-all">
                    <CardHeader>
                        <CardTitle>Manage Affiliates</CardTitle>
                        <CardDescription>Review applications and track partner performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Access detailed reports on affiliate referrals, earnings, and payout status.
                        </p>
                        <Button asChild className="w-full">
                            <Link href="/staff/affiliates">
                                Go to Affiliates <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="glass-card hover:shadow-lg transition-all">
                    <CardHeader>
                        <CardTitle>Manage Advertisers</CardTitle>
                        <CardDescription>Oversee paid promotion campaigns and advertisers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Manage owner accounts, promoted listings, and advertising inquiries.
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/staff/advertisers">
                                view Advertisers <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
