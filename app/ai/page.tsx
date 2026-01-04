"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AiAssistant } from "@/components/ai-assistant"
import { Bot, Sparkles, Shield, Zap } from "lucide-react"

export default function AiPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 pt-24 pb-16 px-4">
                <div className="container mx-auto max-w-5xl">
                    {/* Hero Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6 animate-pulse">
                            <Sparkles className="h-4 w-4" />
                            <span>Next-Gen Rental Assistance</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                            Chat with <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">Leli AI</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Your intelligent companion for finding, listing, and managing rentals.
                            Ask anything about our platform or rental policies.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                        {/* AI Assistant Interface */}
                        <div className="lg:col-span-2">
                            <AiAssistant mode="inline" />
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <div className="glass-card rounded-3xl p-6 border-primary/10">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-yellow-500" />
                                    Quick Tips
                                </h3>
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    <li className="flex gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        &quot;Find me mountain bikes in Nairobi&quot;
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        &quot;How do I verify my account?&quot;
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        &quot;What is the cancellation policy?&quot;
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        &quot;How to list my camera for rent?&quot;
                                    </li>
                                </ul>
                            </div>

                            <div className="glass-card rounded-3xl p-6 border-green-500/10">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-green-500" />
                                    Secure & Helpful
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Leli AI is trained on our platform rules and Kenyan rental regulations
                                    to provide you with the most accurate support.
                                </p>
                            </div>

                            <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-600/10 to-pink-500/10 border border-white/20">
                                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Notice</p>
                                <p className="text-sm text-muted-foreground">
                                    For complex legal disputes or payment issues, our human support team
                                    is also available via the Contact page.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
