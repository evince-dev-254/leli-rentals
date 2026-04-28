import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { competitors } from "@/lib/comparison-data"
import { PromoButton } from "@/components/seo/promo-button"

export const metadata: Metadata = {
    title: "Compare Rental Platforms 2026 — Leli Rentals vs Turo, Airbnb & More",
    description:
        "Compare Leli Rentals against Turo, Airbnb, Fat Llama, Rent the Runway, WeWork and 6 more platforms. See real fee comparisons and decide which platform keeps more of your rental income.",
    keywords: [
        "compare rental platforms 2026",
        "turo vs leli rentals",
        "airbnb vs leli rentals",
        "rental platform fee comparison",
        "best rental platform for hosts",
        "turo alternative lower fees",
        "airbnb alternative lower fees",
        "peer to peer rental platform comparison",
        "rental platform commission comparison",
        "switch from turo",
        "switch from airbnb",
        "zero commission rental platform",
    ],
    alternates: { canonical: "https://www.leli.rentals/compare" },
    robots: { index: true, follow: true },
}

export default function CompareIndexPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-700 text-white pt-28 pb-16 px-4">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            ⚡ Fee Comparisons
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                            Compare Rental Platforms 2026
                        </h1>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                            See exactly how much Turo, Airbnb, Fat Llama, and 8 other major
                            platforms take from your rental income — versus Leli Rentals' flat
                            $10/month with zero commission.
                        </p>
                    </div>
                </div>

                {/* Key Message */}
                <div className="bg-blue-600 text-white py-6 px-4 text-center">
                    <p className="text-lg font-medium">
                        Leli Rentals charges a flat <strong>$10/month</strong> with{" "}
                        <strong>0% commission</strong> on every rental. Competitors take{" "}
                        <strong>15-40%</strong> of everything you earn.
                    </p>
                </div>

                {/* Comparison Cards */}
                <div className="max-w-5xl mx-auto px-4 py-16">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {competitors.map((c) => (
                            <Link
                                key={c.id}
                                href={`/compare/${c.slug}`}
                                className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {c.name} vs Leli
                                        </h2>
                                        <p className="text-xs text-slate-400">{c.category}</p>
                                    </div>
                                    <span className="text-2xl">⚡</span>
                                </div>
                                <div className="space-y-2 mb-5">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-sm text-slate-500">{c.name} commission</span>
                                        <span className="text-sm font-bold text-red-500">{c.hostCommission}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-sm text-slate-500">Leli Rentals</span>
                                        <span className="text-sm font-bold text-green-600">$10/month flat</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-sm text-slate-500">You keep extra</span>
                                        <span className="text-sm font-bold text-blue-600">
                                            +${c.mathExample.extraPerMonth.toLocaleString()}/month
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-blue-600 font-semibold group-hover:underline">
                                        See full comparison →
                                    </span>
                                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                                        {c.features.filter((f) => f.leliWins).length}/{c.features.length} wins
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-10 text-white text-center">
                        <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold mb-6">
                            🎉 Limited Offer — Use Code FREEMONTH
                        </div>
                        <h2 className="text-3xl font-bold mb-3">
                            Ready to Keep More of What You Earn?
                        </h2>
                        <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                            Join thousands of owners who switched to Leli Rentals and immediately
                            started keeping more of their rental income every month.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <PromoButton label="Claim My Free Month →" />
                            <Link
                                href="/pricing"
                                className="inline-flex items-center justify-center px-10 py-4 bg-blue-500/40 hover:bg-blue-500/60 text-white font-semibold rounded-xl border border-white/30 transition-colors text-lg"
                            >
                                View Pricing
                            </Link>
                        </div>
                        <p className="mt-4 text-blue-200 text-sm">
                            No credit card required · Cancel anytime · 0% commission forever
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}