"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

const ColorSwatch = ({ name, variable, description, hex }: { name: string, variable: string, description: string, hex?: string }) => (
    <div className="space-y-2">
        <div className={`h-24 w-full rounded-lg shadow-sm border border-border ${variable}`} style={{ backgroundColor: `var(${variable})` }} />
        <div>
            <h4 className="font-semibold text-sm">{name}</h4>
            <p className="text-xs text-muted-foreground">{description}</p>
            <code className="text-[10px] bg-muted px-1 py-0.5 rounded mt-1 block w-fit">{variable}</code>
        </div>
    </div>
)

export function BrandingGuidelines() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Brand Identity</h2>
                    <p className="text-muted-foreground">Official color palette, typography and assets for Leli Rentals.</p>
                </div>
            </div>

            <Tabs defaultValue="colors" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="typography">Typography</TabsTrigger>
                    <TabsTrigger value="assets">Logos & Assets</TabsTrigger>
                </TabsList>

                <TabsContent value="colors" className="space-y-8">
                    {/* Primary Colors */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Primary Colors</CardTitle>
                            <CardDescription>Core brand colors used for main actions and identity.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <div className="h-24 w-full rounded-lg shadow-sm bg-primary border border-border" />
                                <div>
                                    <h4 className="font-semibold text-sm">Primary Orange</h4>
                                    <p className="text-xs text-muted-foreground">Main actions, buttons, links</p>
                                    <code className="text-[10px] bg-muted px-1 py-0.5 rounded mt-1 block w-fit">--primary</code>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-24 w-full rounded-lg shadow-sm bg-primary/90 border border-border" />
                                <div>
                                    <h4 className="font-semibold text-sm">Primary Hover</h4>
                                    <p className="text-xs text-muted-foreground">Hover states for primary elements</p>
                                    <code className="text-[10px] bg-muted px-1 py-0.5 rounded mt-1 block w-fit">--primary / 0.9</code>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-24 w-full rounded-lg shadow-sm bg-secondary border border-border" />
                                <div>
                                    <h4 className="font-semibold text-sm">Secondary</h4>
                                    <p className="text-xs text-muted-foreground">Secondary actions, backgrounds</p>
                                    <code className="text-[10px] bg-muted px-1 py-0.5 rounded mt-1 block w-fit">--secondary</code>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-24 w-full rounded-lg shadow-sm bg-accent border border-border" />
                                <div>
                                    <h4 className="font-semibold text-sm">Accent</h4>
                                    <p className="text-xs text-muted-foreground">Highlights, features</p>
                                    <code className="text-[10px] bg-muted px-1 py-0.5 rounded mt-1 block w-fit">--accent</code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* UI Colors */}
                    <Card>
                        <CardHeader>
                            <CardTitle>UI System Colors</CardTitle>
                            <CardDescription>Colors used for structural elements and feedback.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-6">
                            <div className="space-y-2">
                                <div className="h-16 w-full rounded-lg shadow-sm bg-background border border-border" />
                                <div>
                                    <h4 className="font-semibold text-sm">Background</h4>
                                    <code className="text-[10px] bg-muted px-1 py-0.5 rounded">--background</code>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-16 w-full rounded-lg shadow-sm bg-foreground border border-border" />
                                <div>
                                    <h4 className="font-semibold text-sm">Foreground</h4>
                                    <code className="text-[10px] bg-muted px-1 py-0.5 rounded">--foreground</code>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-16 w-full rounded-lg shadow-sm bg-muted border border-border" />
                                <div>
                                    <h4 className="font-semibold text-sm">Muted</h4>
                                    <code className="text-[10px] bg-muted px-1 py-0.5 rounded">--muted</code>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-16 w-full rounded-lg shadow-sm bg-border border border-border" />
                                <div>
                                    <h4 className="font-semibold text-sm">Border</h4>
                                    <code className="text-[10px] bg-muted px-1 py-0.5 rounded">--border</code>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-16 w-full rounded-lg shadow-sm bg-destructive border border-border" />
                                <div>
                                    <h4 className="font-semibold text-sm">Destructive</h4>
                                    <code className="text-[10px] bg-muted px-1 py-0.5 rounded">--destructive</code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Gradients */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Brand Gradients</CardTitle>
                            <CardDescription>Gradients used for backgrounds and special effects.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="h-32 w-full rounded-lg shadow-sm gradient-mesh border border-border" />
                                <div>
                                    <h4 className="font-semibold text-sm">Default Mesh</h4>
                                    <p className="text-xs text-muted-foreground">General dashboard background</p>
                                    <code className="text-[10px] bg-muted px-1 py-0.5 rounded mt-1 block w-fit">.gradient-mesh</code>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-32 w-full rounded-lg shadow-sm gradient-mesh-affiliate border border-border" />
                                <div>
                                    <h4 className="font-semibold text-sm">Affiliate Mesh</h4>
                                    <p className="text-xs text-muted-foreground">Affiliate dashboard background </p>
                                    <code className="text-[10px] bg-muted px-1 py-0.5 rounded mt-1 block w-fit">.gradient-mesh-affiliate</code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="typography" className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Typography System</CardTitle>
                            <CardDescription>Primary font family: Geist Sans</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-5xl font-bold">Heading 1</h1>
                                <code className="block text-xs text-muted-foreground">text-5xl font-bold</code>
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-4xl font-bold">Heading 2</h2>
                                <code className="block text-xs text-muted-foreground">text-4xl font-bold</code>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-semibold">Heading 3</h3>
                                <code className="block text-xs text-muted-foreground">text-3xl font-semibold</code>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-xl font-medium">Heading 4</h4>
                                <code className="block text-xs text-muted-foreground">text-xl font-medium</code>
                            </div>
                            <div className="space-y-4">
                                <p className="text-base leading-relaxed">
                                    Body Text: Leli Rentals connects people who have things with people who need them.
                                    This is a sample of the body text used throughout the application. It is designed to be
                                    highly readable and comfortable for long-form content.
                                </p>
                                <code className="block text-xs text-muted-foreground">text-base</code>
                            </div>
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Small Text: Used for captions, help text, and secondary information.
                                </p>
                                <code className="block text-xs text-muted-foreground">text-sm text-muted-foreground</code>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="assets" className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Logo</CardTitle>
                            <CardDescription>Primary logo variations.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 rounded-lg border border-border flex items-center justify-center bg-white/50">
                                <div className="relative h-16 w-48">
                                    <Image src="/logo.png" alt="Logo Light" fill className="object-contain" />
                                </div>
                                <p className="absolute bottom-2 left-2 text-xs text-muted-foreground">Default</p>
                            </div>
                            <div className="p-8 rounded-lg border border-border flex items-center justify-center bg-black/90">
                                <div className="relative h-16 w-48">
                                    <Image src="/logo.png" alt="Logo Dark" fill className="object-contain invert" />
                                </div>
                                <p className="absolute bottom-2 left-2 text-xs text-muted-foreground">Inverted (Dark Mode)</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
