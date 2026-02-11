"use client"

import { motion } from "framer-motion";
import { DollarSign, Users, MousePointerClick, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardWelcomeHeader } from "@/components/dashboard/dashboard-welcome-header";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRouter } from "next/navigation";
import { WithdrawalModal } from "@/components/dashboard/withdrawal-modal";
import { DashboardFAQ } from "@/components/dashboard/dashboard-faq";
import { useState } from "react";

interface AffiliateOverviewProps {
    user: any;
    stats: any;
    refreshing: boolean;
    onRefresh: () => void;
}

export function AffiliateOverview({ user, stats, refreshing, onRefresh }: AffiliateOverviewProps) {
    const router = useRouter();
    const [withdrawalOpen, setWithdrawalOpen] = useState(false);

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

                <div className="relative group">
                    <DashboardStatCard
                        title="Pending Payout"
                        value={`Kes ${stats?.pending_earnings || 0}`}
                        icon={DollarSign}
                        color="amber-glow"
                        description="Available to withdraw"
                    />
                    {Number(stats?.pending_earnings || 0) > 0 && (
                        <div className="absolute bottom-4 right-4">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setWithdrawalOpen(true)}
                                className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md"
                            >
                                Withdraw
                            </Button>
                        </div>
                    )}
                </div>

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
                        value={`${stats?.global_commission_rate || stats?.commission_rate || 10}%`}
                        icon={MousePointerClick}
                        color="teal"
                        description="Per booking"
                    />
                </motion.div>
            </motion.div>

            {/* Referral Link & Performance */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass-card border-none shadow-md bg-gradient-to-br from-primary/5 to-purple-500/5">
                    <CardHeader>
                        <CardTitle className="text-lg">Your Referral Link</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 p-3 bg-white/50 dark:bg-black/20 rounded-xl border border-border/50">
                            <code className="text-sm font-mono flex-1 truncate">
                                {typeof window !== 'undefined' ? `${window.location.origin}/signup?ref=${user?.id}` : `/signup?ref=${user?.id}`}
                            </code>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    const link = `${window.location.origin}/signup?ref=${user?.id}`;
                                    navigator.clipboard.writeText(link);
                                    alert("Link copied to clipboard!");
                                }}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Copy
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                            Share this link with your audience to earn commissions on every successful booking they make.
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass-card border-none shadow-md overflow-hidden bg-gradient-to-br from-white/80 to-white/40 dark:from-black/40 dark:to-black/20">
                    <CardHeader className="p-4 md:p-6 pb-2">
                        <CardTitle className="text-xl md:text-2xl">Performance Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px] p-2 md:p-4 pt-0 min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} strokeOpacity={0.2} />
                                <YAxis tick={{ fontSize: 10 }} strokeOpacity={0.2} tickFormatter={(value) => `Kes ${value}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Referrals Placeholder */}
            <Card className="glass-card border-none shadow-md overflow-hidden">
                <CardHeader className="bg-white/50 dark:bg-black/20 border-b border-border/50">
                    <CardTitle>Recent Referrals</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {(!stats?.recent_referrals || stats.recent_referrals.length === 0) ? (
                        <div className="text-center py-12 px-6">
                            <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                            <h3 className="font-semibold text-lg mb-2">No referrals yet</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto">Once users sign up using your link, they will appear here.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border/50">
                            {stats.recent_referrals.map((ref: any, i: number) => (
                                <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{ref.full_name || "New User"}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(ref.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-[10px] font-bold ${ref.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {ref.status || 'Joined'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <DashboardFAQ role="affiliate" />

            <WithdrawalModal
                open={withdrawalOpen}
                onOpenChange={setWithdrawalOpen}
                availableBalance={Number(stats?.pending_earnings || 0)}
                userId={user?.id}
                onSuccess={onRefresh}
                paymentInfo={user?.payment_info}
                role="affiliate"
            />
        </div>
    );
}
