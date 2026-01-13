"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updatePaymentInfo } from "@/lib/actions/affiliate-actions";
import { detectKenyanProvider } from "@/lib/utils/phone-utils";

interface AffiliateSettingsProps {
    user: any;
    stats: any;
    onUpdate: (newStats: any) => void;
}

export function AffiliateSettings({ user, stats, onUpdate }: AffiliateSettingsProps) {
    const [paymentProvider, setPaymentProvider] = useState("mpesa");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [savingSettings, setSavingSettings] = useState(false);

    useEffect(() => {
        if (stats?.payment_info) {
            setPaymentProvider(stats.payment_info.provider || "mpesa");
            setAccountNumber(stats.payment_info.account_number || "");
            setAccountName(stats.payment_info.account_name || "");
        }
    }, [stats]);

    const handleAccountChange = (val: string) => {
        setAccountNumber(val);
        const detected = detectKenyanProvider(val);
        if (detected) {
            setPaymentProvider(detected);
        }
    };

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
                onUpdate({ ...stats, payment_info: paymentInfo });
            } else {
                toast.error("Failed to save settings");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setSavingSettings(false);
        }
    };

    return (
        <Card className="glass-card shadow-xl max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">Payment Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div className="p-4 bg-muted/50 rounded-xl space-y-4">
                        <div className="space-y-2">
                            <Label>Payment Provider</Label>
                            <Select value={paymentProvider} onValueChange={setPaymentProvider}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mpesa">M-Pesa</SelectItem>
                                    <SelectItem value="airtel">Airtel Money</SelectItem>
                                    <SelectItem value="bank">Bank Transfer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Account / Phone Number</Label>
                            <Input
                                value={accountNumber}
                                onChange={(e) => handleAccountChange(e.target.value)}
                                placeholder="e.g. 07XXXXXXXX"
                                className="bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Account Name</Label>
                            <Input
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                                placeholder="Registered Full Name"
                                className="bg-background"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-12 text-lg" disabled={savingSettings}>
                        {savingSettings && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        Save Payment Details
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                        Ensure your details are accurate to avoid delays in processing your withdrawals.
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
