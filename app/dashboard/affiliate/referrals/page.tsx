"use client"

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getAffiliateReferrals } from "@/lib/actions/dashboard-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Users,
} from "lucide-react";
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

export default function AffiliateReferralsPage() {
    const [referrals, setReferrals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReferees = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            try {
                const data = await getAffiliateReferrals(user.id);
                setReferrals(data || []);
            } catch (error) {
                console.error("Failed to load referrals", error);
            } finally {
                setLoading(false);
            }
        }
        fetchReferees();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">My Referees</h2>
                <p className="text-muted-foreground">People who joined using your referral link.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Referrals List</CardTitle>
                    <CardDescription>
                        You have referred {referrals.length} users so far.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {referrals.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Joined Date</TableHead>
                                    <TableHead>Commission Earned</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {referrals.map((referral) => (
                                    <TableRow key={referral.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
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
                                        <TableCell className="font-medium text-green-600">Kes {referral.commission_amount || 0}</TableCell>
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
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <Users className="h-12 w-12 text-muted-foreground mb-4" />
                            <h4 className="text-lg font-medium">No referrals yet</h4>
                            <p className="text-muted-foreground">Share your link to start seeing referees here.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
