"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, Type } from "lucide-react"
import Image from "next/image"

export function BrandingGuidelines() {
    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Brand Identity</h2>
                    <p className="text-muted-foreground text-lg">Official color palette, typography and assets for Leli Rentals.</p>
                </div>
            </div>

            {/* Logo Section */}
            <Card className="glass-card overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-primary" />
                        Logo Strategy
                    </CardTitle>
                    <CardDescription>Our visual identifier and usage guidelines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="font-semibold text-sm uppercase tracking-wider">Primary Logo (Light)</h4>
                            <div className="bg-white p-12 rounded-2xl flex items-center justify-center border shadow-inner">
                                <Image src="/logo.png" alt="Logo Light" width={200} height={60} className="w-auto h-12" />
                            </div>
                            <p className="text-xs text-muted-foreground">Use on light backgrounds. Enforce minimum clear space around the logo.</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-semibold text-sm uppercase tracking-wider">Inverted Logo (Dark)</h4>
                            <div className="bg-slate-900 p-12 rounded-2xl flex items-center justify-center border-slate-800 shadow-inner">
                                <Image src="/logo.png" alt="Logo Dark" width={200} height={60} className="w-auto h-12 invert" />
                            </div>
                            <p className="text-xs text-muted-foreground">Use on dark backgrounds or the primary brand color gradients.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Typography Section */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Type className="h-5 w-5 text-primary" />
                        Typography System
                    </CardTitle>
                    <CardDescription>Standardized fonts and hierarchical usage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-5xl font-extrabold tracking-tight mb-2">Heading 1</h1>
                                <p className="text-sm text-muted-foreground">ExtraBold / 3rem - Used for main page titles</p>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight mb-2">Heading 2</h2>
                                <p className="text-sm text-muted-foreground">Bold / 1.875rem - Section headers</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Heading 3</h3>
                                <p className="text-sm text-muted-foreground">SemiBold / 1.25rem - Component headers</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <p className="text-lg leading-relaxed">Lead Paragraph</p>
                                <p className="text-sm text-muted-foreground mt-1">Regular / 1.125rem - Introduction text</p>
                            </div>
                            <div>
                                <p className="text-base text-muted-foreground leading-relaxed">
                                    The quick brown fox jumps over the lazy dog. Standard body text for all descriptions and general content.
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">Regular / 1rem - Body text</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium uppercase tracking-widest text-primary">Accent Label</p>
                                <p className="text-sm text-muted-foreground mt-1">Medium / 0.875rem - Overlines and tags</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Visual Elements Section */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Visual Elements</CardTitle>
                    <CardDescription>Glassmorphism and gradient patterns</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <div className="aspect-square rounded-2xl border bg-background/80 backdrop-blur-xl flex items-center justify-center p-6 text-center text-sm">
                            Glassmorphism Card Effect
                        </div>
                        <p className="text-xs text-center text-muted-foreground">`backdrop-blur-xl bg-background/80`</p>
                    </div>
                    <div className="space-y-2">
                        <div className="aspect-square rounded-2xl bg-gradient-to-tr from-primary via-purple-500 to-pink-500 opacity-20" />
                        <p className="text-xs text-center text-muted-foreground">Brand Mesh Gradient</p>
                    </div>
                    <div className="space-y-2">
                        <div className="aspect-square rounded-2xl border border-dashed border-primary/30 flex items-center justify-center p-6 text-center text-xs text-primary font-medium uppercase tracking-widest">
                            8px <br /> Standard Radius
                        </div>
                        <p className="text-xs text-center text-muted-foreground">`rounded-xl` / 12px for cards</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
