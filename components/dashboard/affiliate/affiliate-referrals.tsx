"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Referral {
    id: string;
    created_at: string;
    commission_amount: number;
    commission_status: string;
    referred_user: {
        full_name: string;
        email: string;
        avatar_url: string | null;
    };
    total_bookings?: number;
    total_earnings?: number;
}

interface AffiliateReferralsProps {
    referrals: Referral[];
}

export function AffiliateReferrals({ referrals }: AffiliateReferralsProps) {
    return (
        <Card className="glass-card shadow-xl">
            <CardHeader>
                <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                    Your Referrals
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Joined Date</TableHead>
                            <TableHead>Bookings</TableHead>
                            <TableHead>Total Commission</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {referrals.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
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
                                            <div className="flex flex-col">
                                                <span>{ref.referred_user?.full_name || 'Anonymous User'}</span>
                                                <span className="text-xs text-muted-foreground">{ref.referred_user?.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(ref.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>{ref.total_bookings || 0}</TableCell>
                                    <TableCell>Kes {ref.commission_amount || 0}</TableCell>
                                    <TableCell>
                                        <Badge variant={ref.commission_status === 'paid' ? 'default' : 'secondary'}>
                                            {ref.commission_status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
