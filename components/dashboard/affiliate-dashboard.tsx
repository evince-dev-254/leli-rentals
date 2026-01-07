"use client"

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getAffiliateData, getAffiliateReferrals } from "@/lib/actions/dashboard-actions";
import { joinAffiliateProgram } from "@/lib/actions/affiliate-actions";
import { toast } from "sonner";
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
    ArrowLeft,
    RefreshCw,
    Instagram,
    Share2,
    Video
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
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                                Become a Partner
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Join the Leli Rentals Affiliate Program and start earning today.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
                                    <DollarSign className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Earn 10% Commission</h3>
                                    <p className="text-muted-foreground">Get paid for every successful booking made through your referral link.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                    <RefreshCw className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Monthly Payouts</h3>
                                    <p className="text-muted-foreground">Reliable payments via Bank Transfer or Mobile Money.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Unlimited Referrals</h3>
                                    <p className="text-muted-foreground">There&apos;s no cap on how many users you can refer or how much you can earn.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                onClick={handleJoinProgram}
                                disabled={joining}
                                size="lg"
                                className="w-full md:w-auto text-lg h-12 px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                            >
                                {joining ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Setting up your dashboard...</> : "Join Affiliate Program"}
                            </Button>
                            <p className="text-sm text-muted-foreground mt-4">
                                By joining, you agree to our affiliate terms and conditions.
                            </p>
                        </div>
                    </div>

                    <div className="relative hidden md:block">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-3xl blur-3xl" />
                        <div className="relative glass-card bg-card/50 backdrop-blur-xl border-border/50 p-8 rounded-3xl shadow-2xl">
                            <div className="space-y-6 opacity-50 pointer-events-none select-none">
                                {/* Mock stats for preview */}
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold">Dashboard Preview</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-card border shadow-sm">
                                        <div className="text-sm text-muted-foreground">Total Earnings</div>
                                        <div className="text-2xl font-bold">Kes 45,000</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-card border shadow-sm">
                                        <div className="text-sm text-muted-foreground">Referrals</div>
                                        <div className="text-2xl font-bold">128</div>
                                    </div>
                                </div>
                                <div className="h-32 rounded-xl bg-muted/50 w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }



    const referralLink = `${process.env.NEXT_PUBLIC_SITE_URL || "https://leli.rentals"}/signup?ref=${stats?.invite_code || ''}`;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <WithdrawalModal
                open={withdrawalOpen}
                onOpenChange={setWithdrawalOpen}
                availableBalance={stats?.pending_earnings || 0}
                userId={user?.id}
                onSuccess={handleRefresh}
                paymentInfo={stats?.payment_info}
                role="affiliate"
            />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Affiliate Dashboard</h2>
                    <p className="text-muted-foreground">Manage your referrals and track your earnings in real-time.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={refreshing}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => router.push('/select-role?force=true')}>
                        Switch Account
                    </Button>
                </div>
            </div>

            {/* Hero Card - Referral Link */}
            <div className="relative group rounded-3xl overflow-hidden border shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-blue-600 opacity-90 dark:opacity-80" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />

                <div className="relative p-8 md:p-10 flex flex-col items-center gap-8 text-white text-center">
                    <div className="space-y-4 max-w-3xl">
                        <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-sm font-medium border border-white/20 mx-auto">
                            <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                            Active Partner
                        </div>
                        <h3 className="text-3xl md:text-5xl font-bold">Start earning with your unique link</h3>
                        <p className="text-white/80 text-lg max-w-2xl mx-auto">
                            Share this link with your audience. You&apos;ll earn a <span className="font-bold text-white">{stats?.commission_rate || 10}% commission</span> on every booking they make.
                        </p>
                    </div>

                    <div className="w-full max-w-2xl space-y-3 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                        <label className="text-sm font-medium text-white/80 uppercase tracking-widest text-xs block text-left mb-2">Your Referral Link</label>
                        <div className="flex gap-2">
                            <Input
                                readOnly
                                value={referralLink}
                                className="bg-black/20 border-white/10 text-white placeholder:text-white/50 h-12 font-mono"
                            />
                            <Button
                                size="lg"
                                variant="secondary"
                                className="h-12 px-6 shrink-0 bg-white hover:bg-white/90 text-primary border-0 font-semibold"
                                onClick={() => copyLink(referralLink)}
                            >
                                {linkCopied ? <Check className="mr-2 h-5 w-5 text-green-600" /> : <Copy className="mr-2 h-5 w-5" />}
                                Copy Link
                            </Button>
                        </div>

                        <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <Button variant="outline" size="lg" className="bg-[#1DA1F2] border-0 text-white hover:bg-[#1DA1F2]/90" asChild>
                                <a href={`https://twitter.com/intent/tweet?text=Check%20out%20Leli%20Rentals!&url=${encodeURIComponent(referralLink)}`} target="_blank" rel="noopener noreferrer">
                                    <svg className="mr-2 h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                    Share on X
                                </a>
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] border-0 text-white hover:opacity-90 transition-opacity"
                                onClick={() => copyLink(referralLink, 'Instagram')}
                            >
                                <Instagram className="mr-2 h-5 w-5" />
                                Share on IG
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="bg-black border-0 text-white hover:bg-gray-900 transition-colors"
                                onClick={() => copyLink(referralLink, 'TikTok')}
                            >
                                <svg className="mr-2 h-5 w-5 fill-white" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.55-1.11-.01 1.6.03 3.2-.01 4.79-.1 2.22-1.25 4.2-3.07 5.48-1.79 1.26-4.06 1.66-6.16.89-2.09-.76-3.8-2.58-4.49-4.71-.69-2.2-.13-4.66 1.49-6.32 1.51-1.54 3.75-2.14 5.87-1.57v4.06c-1.02-.56-2.29-.49-3.23.19-.94.69-1.46 1.83-1.37 2.99.09 1.15.8 2.21 1.86 2.72 1.05.52 2.33.37 3.24-.4.92-.77 1.46-1.92 1.45-3.11.01-4.23-.01-8.46 0-12.69z" /></svg>
                                Share on TikTok
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Kes {stats?.total_earnings || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Lifetime revenue</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-green-500 relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payout</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">Kes {stats?.pending_earnings || 0}</div>
                        <Button
                            size="sm"
                            className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => setWithdrawalOpen(true)}
                        >
                            Request Payout
                        </Button>
                    </CardContent>
                </Card>
                {/* ... (Keep other stats cards same) ... */}
                <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Referrals</CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.total_referrals || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Registered users</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-orange-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Commission Rate</CardTitle>
                        <MousePointerClick className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.commission_rate || 10}%</div>
                        <p className="text-xs text-muted-foreground mt-1">Per booking</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs for Referrals and Withdrawals */}
            <Tabs defaultValue="referrals" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-[500px]">
                    <TabsTrigger value="referrals">Referrals</TabsTrigger>
                    <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* ... (Referrals and Withdrawals Content same as before) ... */}

                <TabsContent value="settings" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold tracking-tight">Payment Settings</h3>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/faq/affiliate">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Affiliate FAQ
                            </Link>
                        </Button>
                    </div>
                    <Card className="border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Payout Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveSettings} className="space-y-4 max-w-md">
                                <div className="space-y-2">
                                    <Label>Payment Provider</Label>
                                    <Select value={paymentProvider} onValueChange={setPaymentProvider}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Provider" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="mpesa">M-Pesa (Mobile Money)</SelectItem>
                                            <SelectItem value="airtel">Airtel Money</SelectItem>
                                            <SelectItem value="bank">Bank Transfer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Account Number / Phone</Label>
                                    <Input
                                        value={accountNumber}
                                        onChange={(e) => handleAccountChange(e.target.value)}
                                        placeholder={paymentProvider === 'mpesa' ? "e.g. 0712345678" : paymentProvider === 'airtel' ? "e.g. 0733..." : "Bank Account Number"}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Account Name</Label>
                                    <Input
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value)}
                                        placeholder="Full Name as on Account"
                                    />
                                </div>
                                <Button type="submit" disabled={savingSettings}>
                                    {savingSettings && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Payment Details
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="bg-muted/30 p-4 rounded-lg border text-sm text-muted-foreground">
                        <p>
                            <strong>Note:</strong> Ensure your details are correct. Incorrect details may lead to failed or lost transfers.
                            Consult the <Link href="/faq/affiliate" className="underline text-primary">Affiliate FAQ</Link> for more help.
                        </p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
