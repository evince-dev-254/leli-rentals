"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, Type, Download, Target, Eye, MessageSquare, Shield, Zap, Crown, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"

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

export function BrandingGuidelines() {
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

            {/* Logo Section */}
            <motion.div variants={item}>
                <Card className="glass-card overflow-hidden border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <Palette className="h-6 w-6 text-primary" />
                            Visual Identifier
                        </CardTitle>
                        <CardDescription>Primary marks and downloadable assets</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Main Logo (PNG)</h4>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 gap-2 hover:bg-primary hover:text-white"
                                        onClick={() => handleDownload('/logo.png', 'leli-logo-primary.png')}
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        Download
                                    </Button>
                                </div>
                                <div className="bg-white p-12 rounded-2xl flex items-center justify-center border shadow-xl group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Image src="/logo.png" alt="Logo Light" width={240} height={70} className="w-auto h-14 relative z-10" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Vector Logo (SVG)</h4>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 gap-2 hover:bg-primary hover:text-white"
                                        onClick={() => handleDownload('/logo.svg', 'leli-logo-vector.svg')}
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        Download
                                    </Button>
                                </div>
                                <div className="bg-slate-900 p-12 rounded-2xl flex items-center justify-center border-slate-800 shadow-xl group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Image src="/logo.svg" alt="Logo Dark" width={240} height={70} className="w-auto h-14 relative z-10 invert" />
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
