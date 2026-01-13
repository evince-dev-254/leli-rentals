"use client"

import { useEffect, useState, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { getAffiliateData, getAffiliateReferrals } from "@/lib/actions/dashboard-actions";
import { joinAffiliateProgram } from "@/lib/actions/affiliate-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    Link as LinkIcon,
    DollarSign,
    MousePointerClick,
    ExternalLink,
    Copy,
    Check,
    Loader2,
    RefreshCw,
    Instagram,
    Share2,
    Video,
    BarChart3,
    Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { WithdrawalModal } from "./withdrawal-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getWithdrawalHistory } from "@/lib/actions/affiliate-actions";
import { Input } from "@/components/ui/input";
import { updatePaymentInfo } from "@/lib/actions/affiliate-actions";
import { detectKenyanProvider } from "@/lib/utils/phone-utils";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { DashboardWelcomeHeader } from "@/components/dashboard/dashboard-welcome-header";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";


export default function AffiliateDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [referrals, setReferrals] = useState<any[]>([]);
    const [withdrawals, setWithdrawals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [withdrawalOpen, setWithdrawalOpen] = useState(false);

    // Payment Settings State
    const [paymentProvider, setPaymentProvider] = useState("mpesa");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [savingSettings, setSavingSettings] = useState(false);

    const handleAccountChange = (val: string) => {
        setAccountNumber(val);
        const detected = detectKenyanProvider(val);
        if (detected) {
            setPaymentProvider(detected);
        }
    };

    // Pre-fill settings form when stats loads
    useEffect(() => {
        if (stats?.payment_info) {
            setPaymentProvider(stats.payment_info.provider || "mpesa");
            setAccountNumber(stats.payment_info.account_number || "");
            setAccountName(stats.payment_info.account_name || "");
        }
    }, [stats]);

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingSettings(true);
        try {
            const paymentInfo = {
                type: 'mobile_money',
                provider: paymentProvider,
                account_number: accountNumber,
                account_name: accountName
            };
            const result = await updatePaymentInfo(user.id, paymentInfo);
            if (result.success) {
                toast.success("Payment details saved!");
                setStats({ ...stats, payment_info: paymentInfo });
            } else {
                toast.error("Failed to save settings");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setSavingSettings(false);
        }
    };

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (!user) setLoading(false);
        };
        getUser();
    }, []);

    const loadDashboardData = useCallback(async () => {
        if (!user) return;
        try {
            // Also fetch user profile to check role
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            const [statsData, referralsData, withdrawalsData] = await Promise.all([
                getAffiliateData(user.id),
                getAffiliateReferrals(user.id),
                getWithdrawalHistory(user.id)
            ]);

            setStats(statsData);
            setReferrals(referralsData || []);
            setWithdrawals(withdrawalsData || []);

            // If user role is affiliate but stats is null, they might have just joined
            if (!statsData && profile?.role === 'affiliate') {
                await new Promise(resolve => setTimeout(resolve, 500));
                const retryStats = await getAffiliateData(user.id);
                if (retryStats) setStats(retryStats);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;
        loadDashboardData();
    }, [user, loadDashboardData]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadDashboardData();
        toast.success("Dashboard updated");
    };

    const handleJoinProgram = async () => {
        if (!user) return;
        setJoining(true);
        try {
            const result = await joinAffiliateProgram(user.id, user.email || "");
            if (result.success) {
                setStats(result.data);
                toast.success("Welcome to the Affiliate Program!");
                const referralsData = await getAffiliateReferrals(user.id);
                setReferrals(referralsData || []);
            } else {
                toast.error("Failed to join program", {
                    description: result.error
                });
            }
        } catch (error: any) {
            console.error(error);
            toast.error("An error occurred", {
                description: error.message
            });
        } finally {
            setJoining(false);
        }
    };

    const copyCode = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Referral code copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const copyLink = (text: string, platform?: string) => {
        navigator.clipboard.writeText(text);
        setLinkCopied(true);
        if (platform) {
            toast.success(`Link copied! Open ${platform} to paste.`);
        } else {
            toast.success("Referral link copied!");
        }
        setTimeout(() => setLinkCopied(false), 2000);
    };

    // Mock data for the chart (since we might not have historical data yet)
    const chartData = [
        { name: 'Mon', value: 0 },
        { name: 'Tue', value: 0 },
        { name: 'Wed', value: 0 },
        { name: 'Thu', value: stats?.total_earnings ? Math.floor(stats.total_earnings * 0.2) : 0 },
        { name: 'Fri', value: stats?.total_earnings ? Math.floor(stats.total_earnings * 0.3) : 0 },
        { name: 'Sat', value: stats?.total_earnings ? Math.floor(stats.total_earnings * 0.1) : 0 },
        { name: 'Sun', value: stats?.total_earnings || 0 },
    ];

    if (loading && !refreshing && !stats) return (
        <div className="flex flex-col items-center justify-center p-12 h-[60vh]">
            <div className="relative">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-4 w-4 bg-primary/20 rounded-full animate-pulse"></div>
                </div>
            </div>
            <p className="mt-4 text-muted-foreground animate-pulse">Loading dashboard...</p>
        </div>
    );

    if (!user) return <div className="text-center p-8">Please sign in to view the affiliate dashboard.</div>;

    if (!stats && !loading) {
        return (
            <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Decorative background blobs */}
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none px-4 py-1 text-sm rounded-full">
                                Partnership Program
                            </Badge>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
                                Earn with every <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                                    successful referral
                                </span>
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Join our network of partners and get rewarded for bringing new users to Leli Rentals.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            {[
                                { title: "10% Commission", desc: "Get paid for every booking made through your link.", icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
                                { title: "Weekly Payouts", desc: "Fast and reliable payments to your preferred method.", icon: Wallet, color: "text-blue-500", bg: "bg-blue-500/10" },
                                { title: "Marketing Kit", desc: "Access premium assets and tracking tools.", icon: Share2, color: "text-purple-500", bg: "bg-purple-500/10" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/40 dark:bg-black/20 border border-white/20 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300">
                                    <div className={cn("p-2.5 rounded-xl shrink-0", item.bg, item.color)}>
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{item.title}</h3>
                                        <p className="text-muted-foreground text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                            <Button
                                onClick={handleJoinProgram}
                                disabled={joining}
                                size="lg"
                                className="w-full sm:w-auto text-lg h-14 px-10 rounded-2xl shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.05] active:scale-95 transition-all bg-gradient-to-r from-primary to-purple-600 border-none"
                            >
                                {joining ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Setting up...</> : "Join Program Now"}
                            </Button>
                            <span className="text-sm text-muted-foreground font-medium">Free to join. No hidden fees.</span>
                        </div>
                    </div>

                    <div className="hidden md:flex relative justify-center">
                        <div className="relative w-full aspect-square max-w-md">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-full animate-pulse blur-2xl" />
                            <div className="relative bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden group">
                                <div className="space-y-6">
                                    <div className="h-8 w-1/2 bg-white/20 rounded-full" />
                                    <div className="h-32 w-full bg-white/10 rounded-2xl" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-20 bg-white/10 rounded-2xl" />
                                        <div className="h-20 bg-white/10 rounded-2xl" />
                                    </div>
                                    <div className="h-12 w-full bg-primary/40 rounded-xl" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const referralLink = `${process.env.NEXT_PUBLIC_SITE_URL || "https://leli.rentals"}/signup?ref=${stats?.invite_code || ''}`;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">

            <WithdrawalModal
                open={withdrawalOpen}
                onOpenChange={setWithdrawalOpen}
                availableBalance={stats?.pending_earnings || 0}
                userId={user?.id}
                onSuccess={handleRefresh}
                paymentInfo={stats?.payment_info}
                role="affiliate"
            />

            {/* Dashboard Title & Subtitle */}
            <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Affiliate Dashboard</h1>
                <p className="text-muted-foreground text-base md:text-lg">Manage your referrals and track your earnings in real-time.</p>
            </div>

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
                        value={`KSh ${stats?.total_earnings?.toLocaleString() || 0}`}
                        icon={DollarSign}
                        color="blue"
                        description="Lifetime revenue"
                    />
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="relative group">
                    <DashboardStatCard
                        title="Total Referrals"
                        value={stats?.total_referrals || 0}
                        icon={Users}
                        color="purple"
                        description="Registered users"
                    />
                </motion.div>

                <div className="relative group">
                    <DashboardStatCard
                        title="Pending Payout"
                        value={`KSh ${stats?.pending_earnings?.toLocaleString() || 0}`}
                        icon={TrendingUp}
                        color="orange"
                        description="Available to withdraw"
                    />
                    {(stats?.pending_earnings > 0) && (
                        <div className="absolute bottom-4 right-4 animate-in fade-in zoom-in duration-500">
                            <Button
                                size="sm"
                                className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg border-0 rounded-full px-4 h-8 text-xs font-semibold"
                                onClick={() => setWithdrawalOpen(true)}
                            >
                                Withdraw
                            </Button>
                        </div>
                    )}
                </div>

                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <DashboardStatCard
                        title="Commission Rate"
                        value={`${stats?.commission_rate || 10}%`}
                        icon={MousePointerClick}
                        color="green"
                        description="Per booking"
                    />
                </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Charts & Activity */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Performance Chart */}
                    <Card className="glass-card border-none shadow-md overflow-hidden">
                        <CardHeader className="p-4 md:p-6 bg-white/50 dark:bg-black/20 border-b border-border/50">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl">Performance Overview</CardTitle>
                                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="gap-2">
                                    <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
                                    {refreshing ? "Updating..." : "Refresh"}
                                </Button>
                            </div>
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
                                    <YAxis tick={{ fontSize: 10 }} strokeOpacity={0.2} tickFormatter={(value) => `KSh ${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Referrals & Withdrawals Tabs */}
                    <Tabs defaultValue="referrals" className="w-full">
                        <TabsList className="bg-muted/50 p-1">
                            <TabsTrigger value="referrals">Latest Referrals</TabsTrigger>
                            <TabsTrigger value="withdrawals">Withdrawal History</TabsTrigger>
                        </TabsList>

                        <TabsContent value="referrals" className="mt-4">
                            <Card className="glass-card">
                                <CardHeader>
                                    <CardTitle className="text-lg">Recent Referrals</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>User</TableHead>
                                                <TableHead>Joined Date</TableHead>
                                                <TableHead>Bookings</TableHead>
                                                <TableHead>Earnings</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {referrals.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                                        No referrals yet. Share your link to get started!
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                referrals.map((ref) => (
                                                    <TableRow key={ref.id}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarFallback>{ref.referred_user?.full_name?.[0] || 'U'}</AvatarFallback>
                                                                </Avatar>
                                                                {ref.referred_user?.full_name || 'Anonymous User'}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{new Date(ref.created_at).toLocaleDateString()}</TableCell>
                                                        <TableCell>{ref.total_bookings || 0}</TableCell>
                                                        <TableCell>KSh {ref.total_earnings?.toLocaleString() || 0}</TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="withdrawals" className="mt-4">
                            <Card className="glass-card">
                                <CardHeader><CardTitle>Past Withdrawals</CardTitle></CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {withdrawals.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">No withdrawal history available.</TableCell>
                                                </TableRow>
                                            ) : (
                                                withdrawals.map((w) => (
                                                    <TableRow key={w.id}>
                                                        <TableCell>{new Date(w.created_at).toLocaleDateString()}</TableCell>
                                                        <TableCell>KSh {w.amount?.toLocaleString()}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={w.status === 'completed' ? 'default' : 'secondary'}>{w.status}</Badge>
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
                </div>

                {/* Right Column: Marketing Tools & Settings */}
                <div className="space-y-6">
                    {/* Marketing Kit Card */}
                    <Card className="glass-card bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20 overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Share2 size={120} />
                        </div>
                        <CardHeader className="bg-white/50 dark:bg-black/20 border-b border-border/50">
                            <CardTitle className="flex items-center gap-2">
                                <Share2 className="h-5 w-5 text-primary" />
                                Marketing Kit
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6 relative z-10">
                            <div className="space-y-3">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Unique Link</Label>
                                <div className="flex gap-2">
                                    <Input value={referralLink} readOnly className="bg-background/50" />
                                    <Button size="icon" variant="outline" onClick={() => copyLink(referralLink)}>
                                        {linkCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => copyLink(referralLink)}>
                                    <Copy className="mr-2 h-4 w-4" /> Copy
                                </Button>
                                <Button variant="outline" size="sm" className="w-full justify-start text-blue-500" asChild>
                                    <a href={`https://twitter.com/intent/tweet?text=Check%20out%20Leli%20Rentals!&url=${encodeURIComponent(referralLink)}`} target="_blank" rel="noopener noreferrer">
                                        <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                        Tweet
                                    </a>
                                </Button>
                                <Button variant="outline" size="sm" className="w-full justify-start text-pink-600" onClick={() => copyLink(referralLink, 'Instagram')}>
                                    <Instagram className="mr-2 h-4 w-4" /> Story
                                </Button>
                                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => copyLink(referralLink, 'TikTok')}>
                                    <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.55-1.11-.01 1.6.03 3.2-.01 4.79-.1 2.22-1.25 4.2-3.07 5.48-1.79 1.26-4.06 1.66-6.16.89-2.09-.76-3.8-2.58-4.49-4.71-.69-2.2-.13-4.66 1.49-6.32 1.51-1.54 3.75-2.14 5.87-1.57v4.06c-1.02-.56-2.29-.49-3.23.19-.94.69-1.46 1.83-1.37 2.99.09 1.15.8 2.21 1.86 2.72 1.05.52 2.33.37 3.24-.4.92-.77 1.46-1.92 1.45-3.11.01-4.23-.01-8.46 0-12.69z" /></svg>
                                    TikTok
                                </Button>
                                <Button variant="outline" size="sm" className="w-full justify-start text-green-600" asChild>
                                    <a href={`https://wa.me/?text=${encodeURIComponent(`Check out Leli Rentals! Rent anything, anytime. Sign up using my link: ${referralLink}`)}`} target="_blank" rel="noopener noreferrer">
                                        <div className="mr-2 h-4 w-4 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">W</div>
                                        WhatsApp
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Settings */}
                    <Card className="glass-card border-none shadow-md overflow-hidden">
                        <CardHeader className="bg-white/50 dark:bg-black/20 border-b border-border/50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Wallet className="h-4 w-4 text-primary" />
                                Payout Method
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            {!stats?.payment_info ? (
                                <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-sm">
                                    <p className="flex items-center gap-2 font-medium">
                                        <Wallet className="h-4 w-4" />
                                        Payout method missing
                                    </p>
                                    <p className="mt-1 opacity-80">Add your mobile money or bank details to receive payouts.</p>
                                </div>
                            ) : (
                                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Method</span>
                                        <Badge variant="outline" className="capitalize bg-background">{paymentProvider}</Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Account</span>
                                        <span className="font-mono font-medium">{accountNumber}</span>
                                    </div>
                                    <div className="pt-2 border-t border-primary/10 mt-2">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Account Name</p>
                                        <p className="font-semibold text-sm">{accountName || "Not Provided"}</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSaveSettings} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5 col-span-2">
                                        <Label className="text-xs font-bold uppercase tracking-tight">Provider</Label>
                                        <Select value={paymentProvider} onValueChange={setPaymentProvider}>
                                            <SelectTrigger className="rounded-xl border-border/50">
                                                <SelectValue placeholder="Select Provider" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="mpesa">M-Pesa</SelectItem>
                                                <SelectItem value="airtel">Airtel Money</SelectItem>
                                                <SelectItem value="bank">Bank Transfer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5 col-span-2">
                                        <Label className="text-xs font-bold uppercase tracking-tight">Account Number / Phone</Label>
                                        <Input
                                            value={accountNumber}
                                            onChange={(e) => handleAccountChange(e.target.value)}
                                            className="rounded-xl border-border/50"
                                            placeholder="e.g. 0712345678"
                                        />
                                    </div>
                                    <div className="space-y-1.5 col-span-2">
                                        <Label className="text-xs font-bold uppercase tracking-tight">Full Account Name</Label>
                                        <Input
                                            value={accountName}
                                            onChange={(e) => setAccountName(e.target.value)}
                                            className="rounded-xl border-border/50"
                                            placeholder="As it appears on ID"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full rounded-xl" disabled={savingSettings}>
                                    {savingSettings ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    );
}
