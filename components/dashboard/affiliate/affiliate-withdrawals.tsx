"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Wallet } from "lucide-react";
import { WithdrawalModal } from "../withdrawal-modal";

interface Withdrawal {
    id: string;
    created_at: string;
    amount: number;
    status: string;
}

interface AffiliateWithdrawalsProps {
    user: any;
    stats: any;
    withdrawals: Withdrawal[];
    onRefresh: () => void;
}

export function AffiliateWithdrawals({ user, stats, withdrawals, onRefresh }: AffiliateWithdrawalsProps) {
    const [withdrawalOpen, setWithdrawalOpen] = useState(false);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <WithdrawalModal
                open={withdrawalOpen}
                onOpenChange={setWithdrawalOpen}
                availableBalance={stats?.pending_earnings || 0}
                userId={user?.id}
                onSuccess={onRefresh}
                paymentInfo={stats?.payment_info}
                role="affiliate"
            />

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass-card shadow-xl overflow-hidden bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl">Available Balance</CardTitle>
                        <Wallet className="h-6 w-6 text-amber-600" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-4xl font-bold">Kes {stats?.pending_earnings || 0}</p>
                        <Button
                            className="w-full bg-amber-600 hover:bg-amber-700 h-12 text-lg shadow-lg"
                            disabled={!stats?.pending_earnings || stats.pending_earnings <= 0}
                            onClick={() => setWithdrawalOpen(true)}
                        >
                            <DollarSign className="mr-2 h-5 w-5" />
                            Request Withdrawal
                        </Button>
                    </CardContent>
                </Card>

                <Card className="glass-card bg-primary/5 flex flex-col justify-center p-6 border-primary/10">
                    <h3 className="font-semibold text-lg text-primary">Withdrawal Policy</h3>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            Minimum withdrawal amount: Kes 500
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            Processing time: 24 - 48 business hours
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            Payments are made to your registered details in Settings
                        </li>
                    </ul>
                </Card>
            </div>

            <Card className="glass-card shadow-xl">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Withdrawal History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Reference</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {withdrawals.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                        No withdrawal history available.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                withdrawals.map((w) => (
                                    <TableRow key={w.id}>
                                        <TableCell>{new Date(w.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-semibold">Kes {w.amount}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                w.status === 'completed' ? 'default' :
                                                    w.status === 'pending' ? 'secondary' : 'destructive'
                                            }>
                                                {w.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground font-mono">
                                            {w.id.slice(0, 8).toUpperCase()}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
