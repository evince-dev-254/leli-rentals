"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, Type, Download, Target, Eye, MessageSquare, Shield, Zap, Crown, Clock, Map, Activity, ExternalLink, ArrowRight, Home, Search, BookOpen, CreditCard, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

const siteMap = [
    {
        category: "Public Pages",
        pages: [
            { title: "Home", route: "/", desc: "Main entry point with hero, categories, and featured listings." },
            { title: "About Us", route: "/about", desc: "Our story, mission, and vision." },
            { title: "Categories", route: "/categories", desc: "Browse listings by equipment category." },
            { title: "Search", route: "/search", desc: "Advanced search results for specific equipment." },
            { title: "Pricing", route: "/pricing", desc: "Subscription plans and fee structures." },
            { title: "FAQ/Help", route: "/faq", desc: "Self-service support and common questions." },
        ]
    },
    {
        category: "Dashboards",
        pages: [
            { title: "Renter/Owner", route: "/dashboard", desc: "Unified dashboard for managing bookings and listings." },
            { title: "Affiliate", route: "/dashboard?role=affiliate", desc: "Tracking referrals and commissions." },
            { title: "Messages", route: "/messages", desc: "Real-time communication between users." },
            { title: "Favorites", route: "/favorites", desc: "Quick access to saved listings." },
            { title: "Profile", route: "/users/[id]", desc: "Public user profile and reputation." },
        ]
    },
    {
        category: "Administration",
        pages: [
            { title: "Admin Portal", route: "/admin", desc: "High-level platform metrics and management." },
            { title: "Users", route: "/admin/users", desc: "User acquisition and account management." },
            { title: "Listings", route: "/admin/listings", desc: "Internal equipment inventory control." },
            { title: "Verifications", route: "/admin/verifications", desc: "Identity document review and approval." },
            { title: "Bookings", route: "/admin/bookings", desc: "Transaction monitoring and support." },
        ]
    }
]

const flowSteps = [
    { icon: Home, label: "Discovery", desc: "Landing on Leli Rentals", color: "from-blue-500 to-cyan-500" },
    { icon: Search, label: "Exploration", desc: "Searching for specific gear", color: "from-cyan-500 to-teal-500" },
    { icon: BookOpen, label: "Evaluation", desc: "Reviewing listing details", color: "from-teal-500 to-emerald-500" },
    { icon: Clock, label: "Scheduling", desc: "Picking rental dates", color: "from-emerald-500 to-green-500" },
    { icon: CreditCard, label: "Transaction", desc: "Secure payment processing", color: "from-green-500 to-yellow-500" },
    { icon: CheckCircle2, label: "Fulfillment", desc: "Booking confirmed", color: "from-yellow-500 to-primary" },
]

export function BrandingGuidelines() {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % flowSteps.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleDownload = (path: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = path;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-12 pb-20"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">Brand Identity</h2>
                    <p className="text-muted-foreground text-lg mt-2">The soul and visual language of Leli Rentals.</p>
                </div>
            </div>

            {/* Strategic Details */}
            <div className="grid md:grid-cols-3 gap-6">
                {[
                    { icon: Target, title: "Our Mission", color: "text-blue-500", desc: "Empowering Kenyans through a seamless peer-to-peer rental marketplace." },
                    { icon: Eye, title: "Our Vision", color: "text-purple-500", desc: "To be the most trusted and diverse rental platform in East Africa." },
                    { icon: MessageSquare, title: "Brand Voice", color: "text-pink-500", desc: "Professional, innovative, yet accessible and deeply community-focused." }
                ].map((strat, i) => (
                    <motion.div variants={item} key={i}>
                        <Card className="glass-card h-full border-primary/10 hover:border-primary/30 transition-colors">
                            <CardHeader className="pb-2">
                                <strat.icon className={`h-6 w-6 ${strat.color} mb-2`} />
                                <CardTitle className="text-lg">{strat.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground leading-relaxed">{strat.desc}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Core Values */}
            <motion.div variants={item} className="space-y-4">
                <h3 className="text-xl font-bold px-1">Brand Pillars</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: Shield, label: "Secure", desc: "Verified & Safe" },
                        { icon: Zap, label: "Instant", desc: "Fast & Precise" },
                        { icon: Crown, label: "Premium", desc: "High Quality" },
                        { icon: Clock, label: "24/7", desc: "Relentless Support" }
                    ].map((pillar, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-secondary/30 border border-border/50">
                            <pillar.icon className="h-5 w-5 text-primary shrink-0" />
                            <div>
                                <p className="font-bold text-sm leading-none">{pillar.label}</p>
                                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{pillar.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Site Registry */}
            <motion.div variants={item}>
                <Card className="glass-card border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <Map className="h-6 w-6 text-primary" />
                            Site Registry
                        </CardTitle>
                        <CardDescription>Landscape documentation of all platform routes and functions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {siteMap.map((category, idx) => (
                            <div key={idx} className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-primary/70 px-1">{category.category}</h4>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {category.pages.map((page, pIdx) => (
                                        <div key={pIdx} className="group p-4 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg hover:-translate-y-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <span className="font-bold text-sm">{page.title}</span>
                                                <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">{page.desc}</p>
                                            <code className="text-[9px] font-mono text-primary/60 bg-primary/5 px-2 py-1 rounded select-all">{page.route}</code>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Application Flow */}
            <motion.div variants={item}>
                <Card className="glass-card overflow-hidden">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <Activity className="h-6 w-6 text-primary" />
                            Core Ecosystem Flow
                        </CardTitle>
                        <CardDescription>Sequential logic of the Leli Rentals user journey</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-16 pt-8">
                        <div className="relative">
                            {/* Connection Line */}
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 hidden md:block" />
                            <div
                                className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-primary to-pink-500 -translate-y-1/2 transition-all duration-1000 hidden md:block"
                                style={{ width: `${(activeStep / (flowSteps.length - 1)) * 100}%` }}
                            />

                            <div className="grid grid-cols-2 md:grid-cols-6 gap-8 relative z-10">
                                {flowSteps.map((step, idx) => {
                                    const isActive = activeStep === idx;
                                    const isPast = activeStep > idx;

                                    return (
                                        <div key={idx} className="flex flex-col items-center text-center space-y-4">
                                            <div
                                                className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${isActive
                                                        ? `bg-gradient-to-br ${step.color} text-white scale-110 ring-4 ring-primary/20`
                                                        : isPast
                                                            ? "bg-primary text-white"
                                                            : "bg-secondary text-muted-foreground"
                                                    }`}
                                            >
                                                <step.icon className={`h-8 w-8 ${isActive ? "animate-pulse" : ""}`} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className={`font-bold text-xs ${isActive ? "text-primary" : "text-foreground"}`}>{step.label}</p>
                                                <p className="text-[10px] text-muted-foreground leading-tight px-2">{step.desc}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Active Step Highlight Mobile */}
                        <div className="mt-12 md:hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center"
                                >
                                    <h4 className="font-bold text-primary mb-1">{flowSteps[activeStep].label}</h4>
                                    <p className="text-sm text-muted-foreground">{flowSteps[activeStep].desc}</p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Logo Section */}
            <motion.div variants={item}>
                <Card className="glass-card overflow-hidden border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <Palette className="h-6 w-6 text-primary" />
                            Visual Identifier
                        </CardTitle>
                        <CardDescription>Official brand marks and downloadable assets</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-12">
                        {/* Primary Logos Grid */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Dark Variant */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Dark Variant (For Light BG)</h4>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 gap-2 hover:bg-primary hover:text-white"
                                        onClick={() => handleDownload('/logo-black.png', 'leli-logo-black.png')}
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        Download
                                    </Button>
                                </div>
                                <div className="bg-white p-12 rounded-2xl flex items-center justify-center border shadow-xl group relative overflow-hidden h-[160px]">
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Image src="/logo-black.png" alt="Logo Black" width={280} height={80} className="w-auto h-20 relative z-10 object-contain" />
                                </div>
                            </div>

                            {/* Light Variant */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Light Variant (For Dark BG)</h4>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 gap-2 hover:bg-primary hover:text-white"
                                        onClick={() => handleDownload('/logo-white.png', 'leli-logo-white.png')}
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        Download
                                    </Button>
                                </div>
                                <div className="bg-slate-900 p-12 rounded-2xl flex items-center justify-center border-slate-800 shadow-xl group relative overflow-hidden h-[160px]">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Image src="/logo-white.png" alt="Logo White" width={280} height={80} className="w-auto h-20 relative z-10 object-contain" />
                                </div>
                            </div>
                        </div>

                        {/* Presentation Asset */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Brand Presentation Asset</h4>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-2 hover:bg-primary hover:text-white"
                                    onClick={() => handleDownload('/logo-presentation.png', 'leli-brand-presentation.png')}
                                >
                                    <Download className="h-3.5 w-3.5" />
                                    Download
                                </Button>
                            </div>
                            <div className="rounded-2xl overflow-hidden border shadow-xl group relative aspect-[21/9]">
                                <Image
                                    src="/logo-presentation.png"
                                    alt="Brand Presentation"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white font-medium text-sm">Background Presentation Variant</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Typography Section */}
            <motion.div variants={item}>
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <Type className="h-6 w-6 text-primary" />
                            Typography Hierarchy
                        </CardTitle>
                        <CardDescription>Font scales and standard usage patterns</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-10">
                        <div className="grid md:grid-cols-2 gap-16">
                            <div className="space-y-8">
                                <div>
                                    <h1 className="text-6xl font-black tracking-tighter mb-2 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">Heading 1</h1>
                                    <p className="text-xs font-mono text-primary uppercase tracking-[0.2em]">Inter Black / 3.75rem / -0.05em</p>
                                </div>
                                <div>
                                    <h2 className="text-4xl font-extrabold tracking-tight mb-2">Heading 2</h2>
                                    <p className="text-xs font-mono text-primary uppercase tracking-[0.2em]">Inter ExtraBold / 2.25rem</p>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Heading 3</h3>
                                    <p className="text-xs font-mono text-primary uppercase tracking-[0.2em]">Inter Bold / 1.5rem</p>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div>
                                    <p className="text-xl leading-relaxed font-medium text-foreground/80">Lead Paragraph text for intros.</p>
                                    <p className="text-xs font-mono text-muted-foreground mt-2">Medium / 1.25rem / Leading 1.625</p>
                                </div>
                                <div>
                                    <p className="text-base text-muted-foreground leading-loose">
                                        The quick brown fox jumps over the lazy dog. This is our standard reading type, optimized for clarity and eye-comfort.
                                    </p>
                                    <p className="text-xs font-mono text-muted-foreground mt-2">Regular / 1rem / Leading 2</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Visual Elements Section */}
            <motion.div variants={item}>
                <Card className="glass-card bg-slate-50/50 dark:bg-slate-900/20">
                    <CardHeader>
                        <CardTitle>UI Foundation</CardTitle>
                        <CardDescription>Glass effects, gradients, and radius standards</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-3">
                            <div className="aspect-square rounded-[32px] border bg-background/40 backdrop-blur-3xl flex items-center justify-center p-8 shadow-2xl">
                                <span className="text-xs font-bold uppercase tracking-widest opacity-50">Glass-3XL</span>
                            </div>
                            <p className="text-xs text-muted-foreground font-mono">`bg-background/40 backdrop-blur-3xl`</p>
                        </div>
                        <div className="space-y-3">
                            <div className="aspect-square rounded-[32px] bg-gradient-to-tr from-primary via-purple-500 to-pink-500 opacity-30 shadow-2xl shadow-primary/20 animate-pulse" />
                            <p className="text-xs text-muted-foreground font-mono">`from-primary via-purple to-pink`</p>
                        </div>
                        <div className="space-y-3">
                            <div className="aspect-square rounded-3xl border border-dashed border-primary/40 flex items-center justify-center p-8">
                                <div className="w-full h-full border border-primary/20 rounded-xl flex items-center justify-center">
                                    <span className="text-[10px] font-mono text-primary">NESTED RADIUS<br />24px / 12px</span>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground font-mono">`rounded-3xl` (Cards) / `rounded-xl` (Inners)</p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    )
}
