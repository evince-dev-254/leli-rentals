
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Smartphone, Download, Shield, CheckCircle, ArrowRight, Star } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Download Leli Rentals Mobile App - Premium Gear Marketplace',
    description: 'Experience seamless rental bookings on the go. Download the official Leli Rentals Android app for instant access to premium gear, vehicles, and properties.',
    openGraph: {
        title: 'Download Leli Rentals Mobile App',
        description: 'Get the official Leli Rentals app for Android. Browse, book, and rent premium gear instantly.',
        images: [
            {
                url: '/leli-home-hero-corrected.png', // Using the high-quality hero image
                width: 1200,
                height: 630,
                alt: 'Leli Rentals Mobile App',
            },
        ],
        type: 'website',
    },
};

export default function DownloadPage() {
    return (
        <div className="relative min-h-screen w-full bg-background overflow-hidden flex flex-col items-center justify-center pt-24 pb-12 px-4">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <BackgroundGradient containerClassName="h-full w-full opacity-30" />
            </div>

            <div className="z-10 w-full max-w-4xl">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Content */}
                    <div className="space-y-8 text-center md:text-left">
                        <div className="space-y-2">
                            <Badge variant="outline" className="px-4 py-1 border-primary/50 bg-primary/10 text-primary mb-4 w-fit mx-auto md:mx-0">
                                Official Release v1.0.1
                            </Badge>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
                                Leli <span className="text-primary">Rentals</span><br />
                                Mobile App
                            </h1>
                            <p className="text-lg text-muted-foreground font-medium max-w-md mx-auto md:mx-0">
                                The premium rental marketplace is now at your fingertips. Download our Android app for a faster, smoother experience.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-lg shadow-primary/25 rounded-full" asChild>
                                <a href="/leli-rentals.apk" download>
                                    <Download className="mr-2 h-5 w-5" />
                                    Download APK
                                </a>
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-medium rounded-full" asChild>
                                <Link href="/">
                                    Visit Website
                                </Link>
                            </Button>
                        </div>

                        <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Smartphone className="h-4 w-4" />
                                <span>Android 8.0+</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Shield className="h-4 w-4" />
                                <span>Secure & Verified</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-amber-500" fill="currentColor" />
                                <span>5.0 Rating</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Visual/Instructions */}
                    <div className="relative">
                        <Card className="p-6 bg-card/50 backdrop-blur-xl border-border/50 shadow-2xl">
                            <h3 className="text-xl font-bold mb-4 flex items-center">
                                <ArrowRight className="h-5 w-5 mr-2 text-primary" />
                                How to Install
                            </h3>

                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                        <span className="font-bold text-primary">1</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Download the File</h4>
                                        <p className="text-sm text-muted-foreground">Tap the &quot;Download APK&quot; button and locate the file in your downloads folder.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                        <span className="font-bold text-primary">2</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Enable Unknown Sources</h4>
                                        <p className="text-sm text-muted-foreground">If prompted, allow installation from your browser or file manager.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                        <span className="font-bold text-primary">3</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Install & Launch</h4>
                                        <p className="text-sm text-muted-foreground">Tap &quot;Install&quot; and open the app to start renting!</p>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                <p className="text-xs text-muted-foreground">
                                    <strong>Note:</strong> This is a direct download. You will receive automatic update notifications within the app for future versions.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
