"use client"

import { motion } from "framer-motion";
import { DollarSign, Users, MousePointerClick, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardWelcomeHeader } from "@/components/dashboard/dashboard-welcome-header";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRouter } from "next/navigation";

interface AffiliateOverviewProps {
    user: any;
    stats: any;
    refreshing: boolean;
    onRefresh: () => void;
}

export function AffiliateOverview({ user, stats, refreshing, onRefresh }: AffiliateOverviewProps) {
    const router = useRouter();

    const chartData = [
        { name: 'Mon', value: 0 },
        { name: 'Tue', value: 0 },
        { name: 'Wed', value: 0 },
        { name: 'Thu', value: stats?.total_earnings ? Math.floor(stats.total_earnings * 0.2) : 0 },
        { name: 'Fri', value: stats?.total_earnings ? Math.floor(stats.total_earnings * 0.3) : 0 },
        { name: 'Sat', value: stats?.total_earnings ? Math.floor(stats.total_earnings * 0.1) : 0 },
        { name: 'Sun', value: stats?.total_earnings || 0 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Unified Welcome Header */}
            <DashboardWelcomeHeader
                user={user}
                subtitle="Manage your referrals and track your earnings in real-time."
                role="Affiliate"
            >
                <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
                    <Button variant="secondary" size="sm" onClick={onRefresh} disabled={refreshing} className="bg-white/10 hover:bg-white/20 text-white border-0 flex-1 sm:flex-none">
                        <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/switch-account')} className="bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white flex-1 sm:flex-none">
                        Switch Account
                    </Button>
                </div>
            </DashboardWelcomeHeader>

            {/* Stats Overview */}
            <motion.div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                }}
            >
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <DashboardStatCard
                        title="Total Earnings"
                        value={`Kes ${stats?.total_earnings || 0}`}
                        icon={DollarSign}
                        color="sunset"
                        description="Lifetime revenue"
                    />
                </motion.div>

                <DashboardStatCard
                    title="Pending Payout"
                    value={`Kes ${stats?.pending_earnings || 0}`}
                    icon={DollarSign}
                    color="amber-glow"
                    description="Available to withdraw"
                />

                <DashboardStatCard
                    title="Total Referrals"
                    value={stats?.total_referrals || 0}
                    icon={Users}
                    color="warm-blend"
                    description="Registered users"
                />

                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <DashboardStatCard
                        title="Commission Rate"
                        value={`${stats?.commission_rate || 10}%`}
                        icon={MousePointerClick}
                        color="teal"
                        description="Per booking"
                    />
                </motion.div>
            </motion.div>

            {/* Performance Chart */}
            <Card className="glass-card border-none shadow-xl bg-gradient-to-br from-white/80 to-white/40 dark:from-black/40 dark:to-black/20">
                <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-xl md:text-2xl">Performance Overview</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px] md:h-[350px] p-2 md:p-4 pt-4 min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} strokeOpacity={0.2} />
                            <YAxis tick={{ fontSize: 12 }} strokeOpacity={0.2} tickFormatter={(value) => `Kes ${value}`} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
