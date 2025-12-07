"use client"

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getAffiliateData, getAffiliateReferrals } from "@/lib/actions/dashboard-actions";
import { joinAffiliateProgram } from "@/lib/actions/affiliate-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    Link as LinkIcon,
    DollarSign,
    MousePointerClick,
    ExternalLink,
    Copy,
    Check,
    Loader2
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

export default function AffiliateDashboard() {
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [referrals, setReferrals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const [statsData, referralsData] = await Promise.all([
                    getAffiliateData(user.id),
                    getAffiliateReferrals(user.id)
                ]);
                setStats(statsData);
                setReferrals(referralsData || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleJoinProgram = async () => {
        if (!user) return;
        setJoining(true);
        try {
            const result = await joinAffiliateProgram(user.id, user.email || "");
            if (result.success) {
                // Update local state directly with returned data to show dashboard immediately
                setStats(result.data);
                // Also refresh referrals just in case
                const referralsData = await getAffiliateReferrals(user.id);
                setReferrals(referralsData || []);

            } else {
                alert("Failed to join: " + result.error);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setJoining(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
    );

    if (!user) return <div className="text-center p-8">Please sign in to view the affiliate dashboard.</div>;

    if (!stats) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-card/50 shadow-sm space-y-4 max-w-2xl mx-auto mt-8">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <DollarSign className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Become an Affiliate Partner</h3>
                <p className="text-muted-foreground max-w-md">
                    Earn 10% commission for every user you refer to Leli Rentals.
                    Join our affiliate program today and start earning passive income.
                </p>
                <div className="p-4 bg-muted/50 rounded-lg text-sm text-left w-full space-y-2">
                    <p className="font-semibold">Program Terms:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>10% commission on all completed bookings from your referrals.</li>
                        <li>Payouts are processed monthly via Bank Transfer or Mobile Money.</li>
                        <li>Minimum payout threshold: KES 1,000.</li>
                        <li>Spamming or misleading promotion is strictly prohibited.</li>
                    </ul>
                </div>
                <Button onClick={handleJoinProgram} disabled={joining} size="lg" className="mt-6">
                    {joining ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Joining...</> : "Agree & Join Program"}
                </Button>
            </div>
        )
    }

    const referralLink = `${process.env.NEXT_PUBLIC_SITE_URL || "https://leli.rentals"}/signup?ref=${stats.invite_code}`;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Affiliate Dashboard</h2>
                    <p className="text-muted-foreground">Track your referrals and earnings.</p>
                </div>

                <Card className="w-full md:w-auto bg-primary/5 border-primary/20">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Referral Code</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-mono font-bold">{stats.invite_code}</span>
                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyToClipboard(stats.invite_code)}>
                                    {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                                </Button>
                            </div>
                        </div>
                        <Separator orientation="vertical" className="h-10 mx-2" />
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Referral Link</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-foreground/80 truncate max-w-[150px]">{referralLink}</span>
                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyToClipboard(referralLink)}>
                                    {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_referrals || 0}</div>
                        <p className="text-xs text-muted-foreground">Users signed up</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Kes {stats.total_earnings || 0}</div>
                        <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
                        <DollarSign className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">Kes {stats.pending_earnings || 0}</div>
                        <p className="text-xs text-muted-foreground">Ready to withdraw</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
                        <Badge variant="outline">{stats.commission_rate}%</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.commission_rate}%</div>
                        <p className="text-xs text-muted-foreground">Per successful booking</p>
                    </CardContent>
                </Card>
            </div>

            {/* Referrals Table */}
            <div className="grid gap-4">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Referrals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {referrals.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Commission</TableHead>
                                        <TableHead className="text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {referrals.map((referral) => (
                                        <TableRow key={referral.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={referral.referred_user?.avatar_url} />
                                                        <AvatarFallback>{referral.referred_user?.full_name?.[0] || 'U'}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span>{referral.referred_user?.full_name || 'Anonymous User'}</span>
                                                        <span className="text-xs text-muted-foreground">{referral.referred_user?.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{new Date(referral.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="font-medium">Kes {referral.commission_amount}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant={referral.commission_status === 'paid' ? 'default' : 'secondary'}>
                                                    {referral.commission_status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed">
                                <Users className="h-8 w-8 text-muted-foreground mb-4" />
                                <h4 className="text-lg font-medium text-muted-foreground">No referrals yet</h4>
                                <p className="text-sm text-muted-foreground max-w-sm mt-2">
                                    Share your referral code to start earning commissions!
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
