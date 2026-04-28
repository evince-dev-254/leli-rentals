import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { competitors } from "@/lib/comparison-data"
import { PromoButton } from "@/components/seo/promo-button"

export const metadata: Metadata = {
    title: "Rental Platform Reviews 2026 — Honest Reviews of Turo, Airbnb & More",
    description:
        "Honest, independent reviews of Turo, Airbnb, Fat Llama, Rent the Runway, WeWork and 6 more rental platforms. Read about fees, pros, cons, and better alternatives before you list.",
    keywords: [
        "turo review 2026",
        "airbnb review 2026",
        "fat llama review 2026",
        "rental platform reviews",
        "is turo worth it",
        "is airbnb worth it for hosts",
        "best rental platform 2026",
        "rental platform pros cons",
        "peer to peer rental reviews",
        "turo fees review",
        "airbnb host review",
        "rental marketplace comparison 2026",
    ],
    alternates: { canonical: "https://www.leli.rentals/review" },
    robots: { index: true, follow: true },
}

function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <svg
                    key={s}
                    className={`w-4 h-4 ${s <= Math.round(rating) ? "text-yellow-400" : "text-slate-200"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
            <span className="text-slate-500 text-xs ml-1">{rating}/5</span>
        </div>
    )
}

export default function ReviewIndexPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-700 text-white pt-28 pb-16 px-4">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            📋 Honest Reviews
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                            Rental Platform Reviews 2026
                        </h1>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                            Independent, honest reviews of the world's biggest rental platforms.
                            We cover fees, pros, cons, and whether each platform is still worth
                            listing on in 2026.
                        </p>
                    </div>
                </div>

                {/* Review Cards */}
                <div className="max-w-5xl mx-auto px-4 py-16">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {competitors
                            .slice()
                            .sort((a, b) => b.rating - a.rating)
                            .map((c) => (
                                <Link
                                    key={c.id}
                                    href={`/review/${c.id}`}
                                    className="group bg-white rounded-2xl border border-slate-200 hover:border-yellow-300 hover:shadow-lg transition-all p-6"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                                                {c.name} Review 2026
                                            </h2>
                                            <p className="text-xs text-slate-400">{c.category}</p>
                                        </div>
                                        <Stars rating={c.rating} />
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-5 line-clamp-3">
                                        {c.reviewSummary}
                                    </p>
                                    <div className="space-y-1 mb-5">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-400">Host Commission</span>
                                            <span className={`font-bold ${c.hostCommissionMin > 15 ? "text-red-500" : c.hostCommissionMin > 0 ? "text-orange-500" : "text-slate-500"}`}>
                                                {c.hostCommission}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-400">Monthly Cost</span>
                                            <span className="text-slate-600 font-medium">{c.monthlyFee}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-400">Better alternative saves</span>
                                            <span className="text-green-600 font-bold">
                                                +${c.mathExample.extraPerMonth.toLocaleString()}/month
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                            ✓ {c.pros.length} pros
                                        </span>
                                        <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full">
                                            ✗ {c.cons.length} cons
                                        </span>
                                    </div>
                                    <span className="text-sm text-blue-600 font-semibold group-hover:underline">
                                        Read full review →
                                    </span>
                                </Link>
                            ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-16 bg-gradient-to-br from-slate-900 to-slate-700 rounded-3xl p-10 text-white text-center">
                        <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold mb-6">
                            🎉 Limited Offer — Use Code FREEMONTH
                        </div>
                        <h2 className="text-3xl font-bold mb-3">
                            Tired of Paying High Commission Fees?
                        </h2>
                        <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
                            Leli Rentals charges a flat $10/month with zero commission on every
                            rental. No percentage cuts, no hidden fees, no surprises.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <PromoButton label="Claim My Free Month →" />
                            <Link
                                href="/compare"
                                className="inline-flex items-center justify-center px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 transition-colors text-lg"
                            >
                                Compare All Platforms →
                            </Link>
                        </div>
                        <p className="mt-4 text-slate-400 text-sm">
                            Use code FREEMONTH · No credit card required · Cancel anytime
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}