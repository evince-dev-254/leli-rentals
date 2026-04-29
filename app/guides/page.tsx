import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { guides } from "@/lib/guides-data"

export const metadata: Metadata = {
    title: "Rental Guides 2026 — How to Earn from Your Assets | Leli Rentals",
    description:
        "Free guides on peer-to-peer rental income, vehicle rental earnings, camera gear rental, property rental strategies, and how to keep more of what you earn in 2026.",
    keywords: [
        "rental income guides 2026",
        "how to earn from peer to peer rental",
        "passive income rental guides",
        "vehicle rental income guide",
        "camera gear rental guide",
        "property rental income guide",
        "peer to peer rental tips",
    ],
    alternates: { canonical: "https://www.leli.rentals/guides" },
    robots: { index: true, follow: true },
}

export default function GuidesIndexPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-700 text-white pt-28 pb-16 px-4">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            📖 Rental Guides
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                            Rental Income Guides 2026
                        </h1>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                            Free, in-depth guides on how to generate passive income from the
                            assets you already own — with real earnings data, platform
                            comparisons, and practical step-by-step advice.
                        </p>
                    </div>
                </div>

                {/* Guide Cards */}
                <div className="max-w-5xl mx-auto px-4 py-16">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {guides.map((guide) => (
                            <Link
                                key={guide.slug}
                                href={`/guides/${guide.slug}`}
                                className="group bg-white rounded-2xl border border-slate-200 hover:border-green-300 hover:shadow-lg transition-all overflow-hidden"
                            >
                                {/* Cover image */}
                                <div className="aspect-video overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={guide.heroImage}
                                        alt={guide.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                <div className="p-6">
                                    {/* Category + reading time */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">
                                            {guide.category}
                                        </span>
                                        <span className="text-xs text-slate-400">{guide.readingTime}</span>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-green-700 transition-colors mb-2 leading-snug">
                                        {guide.title}
                                    </h2>

                                    {/* Subheadline */}
                                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4">
                                        {guide.subheadline}
                                    </p>

                                    {/* FAQ count + internal links */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-400">
                                            {guide.faqs.length} FAQs · {guide.sections.length} sections
                                        </span>
                                        <span className="text-sm text-green-600 font-semibold group-hover:underline">
                                            Read guide →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-16 bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-10 text-white text-center">
                        <h2 className="text-3xl font-bold mb-3">
                            Ready to Start Earning?
                        </h2>
                        <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
                            Use our free earning calculators to see exactly how much your
                            specific assets could earn per month — then list for just $10/month
                            with zero commission.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/earn/vehicles"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors"
                            >
                                Calculate My Earnings →
                            </Link>
                            <Link
                                href="/pricing"
                                className="inline-flex items-center justify-center px-8 py-4 bg-green-500/40 hover:bg-green-500/60 text-white font-semibold rounded-xl border border-white/30 transition-colors"
                            >
                                View Pricing
                            </Link>
                        </div>
                        <p className="mt-4 text-green-200 text-sm">
                            No credit card required · Cancel anytime · 0% commission forever
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}