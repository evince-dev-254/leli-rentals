"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, Megaphone, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card"
import { useState, useEffect } from "react"
import { getAllAffiliates } from "@/lib/actions/affiliate-actions"
import { supabase } from "@/lib/supabase"
import { LoadingLogo } from "@/components/ui/loading-logo"

export default function StaffOverviewPage() {
    const [stats, setStats] = useState({
        totalAffiliates: 0,
        activeAffiliates: 0,
        totalAdvertisers: 0,
        pendingApprovals: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadStats() {
            try {
                // Get Affiliates Stats
                const affiliates = await getAllAffiliates()
                const activeAffiliates = affiliates.filter((a: any) => a.status === 'active').length

                // Get Advertisers Stats (Owners with promoted/paid intent - mocking loosely as Owners for now)
                const { count: ownersCount } = await supabase
                    .from('user_profiles')
                    .select('*', { count: 'exact', head: true })
                    .eq('role', 'owner')

                setStats({
                    totalAffiliates: affiliates.length,
                    activeAffiliates,
                    totalAdvertisers: ownersCount || 0,
                    pendingApprovals: affiliates.filter((a: any) => a.status === 'pending').length
                })
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
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Staff Dashboard</h1>
                <p className="text-muted-foreground text-lg">Detailed overview of sales and affiliate performance.</p>
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
