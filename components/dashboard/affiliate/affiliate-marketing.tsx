"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, Copy, Check, Instagram, Twitter, Facebook } from "lucide-react";
import { toast } from "sonner";

interface AffiliateMarketingProps {
    stats: any;
}

export function AffiliateMarketing({ stats }: AffiliateMarketingProps) {
    const [linkCopied, setLinkCopied] = useState(false);
    const referralLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://leli.rentals'}/signup?ref=${stats?.invite_code || ''}`;

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

    const shareOnWhatsApp = () => {
        const text = encodeURIComponent(`Rent anything you need on Leli Rentals! Sign up using my link: ${referralLink}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    const shareOnTwitter = () => {
        const text = encodeURIComponent(`Check out Leli Rentals! Use my referral link to sign up: ${referralLink}`);
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    };

    const shareOnFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
    };

    return (
        <Card className="glass-card shadow-xl overflow-hidden bg-gradient-to-br from-primary/5 to-purple-500/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <Share2 className="h-6 w-6 text-primary" />
                    Marketing Kit
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="space-y-3">
                    <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your Unique Referral Link</Label>
                    <div className="flex gap-2">
                        <Input value={referralLink} readOnly className="bg-background/50 h-12 text-lg" />
                        <Button size="icon" variant="outline" className="h-12 w-12" onClick={() => copyLink(referralLink)}>
                            {linkCopied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground italic">Share this link to earn 10% commission on every booking your referrals make.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <Label className="text-xs font-bold uppercase text-muted-foreground">Direct Share</Label>
                        <div className="flex flex-wrap gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-600 border-green-500/20 h-12"
                                onClick={shareOnWhatsApp}
                            >
                                <div className="mr-2 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">W</div>
                                WhatsApp
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 bg-blue-400/10 hover:bg-blue-400/20 text-blue-500 border-blue-400/20 h-12"
                                onClick={shareOnTwitter}
                            >
                                <Twitter className="mr-2 h-5 w-5 fill-current" />
                                Twitter / X
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 border-blue-600/20 h-12"
                                onClick={shareOnFacebook}
                            >
                                <Facebook className="mr-2 h-5 w-5 fill-current" />
                                Facebook
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 border-pink-500/20 h-12"
                                onClick={() => copyLink(referralLink, 'Instagram')}
                            >
                                <Instagram className="mr-2 h-5 w-5" />
                                Instagram
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-xs font-bold uppercase text-muted-foreground">Marketing Tips</Label>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                Share on your Instagram & TikTok bio for passive reach.
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                Post your link in local equipment rental Facebook groups.
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                Use relevant hashtags like #Rental #Equipment #PassiveIncome.
                            </li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
