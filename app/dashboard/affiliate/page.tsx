"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useUser } from '@clerk/nextjs'
import { StatCard } from "@/components/stat-card"
import { GradientText } from "@/components/gradient-text"
import {
    TrendingUp,
    DollarSign,
    Users,
    Link as LinkIcon,
    Copy,
    Share2,
    BarChart3,
    Clock,
    ArrowRight
} from "lucide-react"

export default function AffiliateDashboard() {
    const router = useRouter()
    const { user, isLoaded } = useUser()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)

    const [stats, setStats] = useState({
        totalEarnings: 0,
        totalReferrals: 0,
        clicks: 0,
        conversionRate: 0
    })

    useEffect(() => {
        if (!isLoaded) return

        if (!user) {
            router.push('/sign-in')
            return
        }

        // Check account type
        const clerkAccountType = (user.publicMetadata?.accountType as string) ||
            (user.unsafeMetadata?.accountType as string)

        if (clerkAccountType !== 'affiliate') {
            // If not affiliate, redirect (unless they are just switching, but for now strict check)
            // For now, let's allow access if they just switched in the session
            // In a real app, we'd have stricter checks
        }

        const fetchStats = async () => {
            try {
                // In a real implementation, we would fetch from Supabase here
                // const { data: affiliate } = await supabase.from('affiliates').select('*').eq('id', user.id).single()
                // const { count: referrals } = await supabase.from('referrals').select('*', { count: 'exact' }).eq('affiliate_id', user.id)
                // const { data: earnings } = await supabase.from('earnings').select('amount').eq('affiliate_id', user.id)

                // For now, we'll simulate a fetch delay and use mock data if no DB connection
                // But the structure is ready for the SQL schema provided

                // Mock data simulation
                setStats({
                    totalEarnings: 12500,
                    totalReferrals: 45,
                    clicks: 1250,
                    conversionRate: 3.6
                })
            } catch (error) {
                console.error("Error fetching affiliate stats:", error)
                toast({
                    title: "Error",
                    description: "Failed to load affiliate stats.",
                    variant: "destructive"
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchStats()
    }, [user, isLoaded, router, toast])

    const copyReferralLink = () => {
        const link = `https://leli.rentals/ref/${user?.username || user?.id}`
        navigator.clipboard.writeText(link)
        toast({
            title: "Link Copied!",
            description: "Your referral link has been copied to clipboard.",
        })
    }

    if (isLoading || !isLoaded) {
        return (
            <>
                <Header />
                <LoadingSpinner message="Loading your dashboard..." variant="default" />
            </>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-indigo-950/20">
            <Header />

            <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            <GradientText from="from-green-600" to="to-teal-600">Affiliate Dashboard</GradientText>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Track your referrals and earnings
                        </p>
                    </div>
                    <Button
                        onClick={copyReferralLink}
                        className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
                    >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Copy Referral Link
                    </Button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Earnings"
                        value={`KSh ${stats.totalEarnings.toLocaleString()}`}
                        icon={<DollarSign className="h-5 w-5" />}
                        color="green"
                    />

                    <StatCard
                        title="Total Referrals"
                        value={stats.totalReferrals.toString()}
                        icon={<Users className="h-5 w-5" />}
                        color="blue"
                    />

                    <StatCard
                        title="Link Clicks"
                        value={stats.clicks.toLocaleString()}
                        icon={<Share2 className="h-5 w-5" />}
                        color="purple"
                    />

                    <StatCard
                        title="Conversion Rate"
                        value={`${stats.conversionRate}%`}
                        icon={<TrendingUp className="h-5 w-5" />}
                        color="orange"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Referral Link Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <LinkIcon className="h-5 w-5 text-blue-600" />
                                    Your Referral Link
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4">
                                    <div className="flex-1 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm truncate">
                                        https://leli.rentals/ref/{user?.username || user?.id}
                                    </div>
                                    <Button onClick={copyReferralLink} variant="outline">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">
                                    Share this link with friends and followers. You'll earn 5% commission on their first 3 rentals!
                                </p>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                                                    JD
                                                </div>
                                                <div>
                                                    <p className="font-medium">New Referral Signup</p>
                                                    <p className="text-sm text-gray-500">John Doe joined via your link</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    + KSh 0
                                                </p>
                                                <p className="text-xs text-gray-500">2 hours ago</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant="outline" className="w-full justify-start">
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Share on Social Media
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    View Detailed Reports
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    Payout Settings
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Marketing Tips */}
                        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800">
                            <CardHeader>
                                <CardTitle className="text-blue-700 dark:text-blue-300">Pro Tip</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-blue-600 dark:text-blue-200 mb-4">
                                    Affiliates who share their links on social media earn 3x more on average!
                                </p>
                                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                    Get Marketing Assets
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
