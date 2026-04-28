"use client"

import { useState } from "react"
import Link from "next/link"
import type { CompetitorData } from "@/lib/comparison-data"

interface Props {
    competitor: CompetitorData
    type: "compare" | "review"
}

// ─── PROMO POPUP ──────────────────────────────────────────────────────────────
function PromoPopup({ competitor, onClose }: { competitor: CompetitorData; onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl font-light"
                >
                    ×
                </button>
                <div className="text-center mb-6">
                    <div className="text-4xl mb-3">🎉</div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        Redeem Your Free Month
                    </h2>
                    <p className="text-slate-500 text-sm">
                        Use code <span className="font-bold text-blue-600">FREEMONTH</span> to get your
                        first month of unlimited listings for $0
                    </p>
                </div>
                <div className="space-y-4 mb-8">
                    {[
                        competitor.promoInstructions.step1,
                        competitor.promoInstructions.step2,
                        competitor.promoInstructions.step3,
                        competitor.promoInstructions.step4,
                    ].map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                                {i + 1}
                            </span>
                            <p className="text-slate-700 text-sm leading-relaxed">{step}</p>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-3">
                    <Link
                        href="/signup"
                        onClick={onClose}
                        className="w-full py-3 bg-blue-600 text-white text-center font-bold rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        Create My Free Account →
                    </Link>
                    <a
                        href="mailto:support@gurucrafts.agency?subject=FREEMONTH"
                        onClick={onClose}
                        className="w-full py-3 bg-slate-100 text-slate-700 text-center font-medium rounded-xl hover:bg-slate-200 transition-colors text-sm"
                    >
                        Email Support to Redeem
                    </a>
                </div>
                <p className="text-center text-slate-400 text-xs mt-4">
                    No credit card required · Cancel anytime · Offer subject to availability
                </p>
            </div>
        </div>
    )
}

// ─── STAR RATING ──────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-5 h-5 ${star <= Math.round(rating) ? "text-yellow-400" : "text-slate-200"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
            <span className="text-slate-600 text-sm ml-1">{rating}/5</span>
        </div>
    )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function ComparisonPage({ competitor, type }: Props) {
    const [showPromo, setShowPromo] = useState(false)

    const isCompare = type === "compare"
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.leli.rentals"

    const pageTitle = isCompare ? competitor.compareTitle : competitor.reviewTitle
    const pageIntro = isCompare ? competitor.compareIntro : competitor.reviewIntro
    const faqs = isCompare ? competitor.compareFaqs : competitor.reviewFaqs
    const mathEx = competitor.mathExample

    // Schema markup
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
    }

    const reviewSchema = !isCompare
        ? {
            "@context": "https://schema.org",
            "@type": "Review",
            itemReviewed: {
                "@type": "SoftwareApplication",
                name: competitor.name,
                applicationCategory: "BusinessApplication",
                url: competitor.website,
            },
            reviewRating: {
                "@type": "Rating",
                ratingValue: competitor.rating,
                bestRating: 5,
                worstRating: 1,
            },
            author: { "@type": "Organization", name: "Leli Rentals" },
            reviewBody: competitor.reviewSummary,
        }
        : null

    return (
        <>
            {/* Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            {reviewSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
                />
            )}

            {/* Promo Popup */}
            {showPromo && (
                <PromoPopup competitor={competitor} onClose={() => setShowPromo(false)} />
            )}

            <div className="bg-white min-h-screen">
                {/* ── HERO ── */}
                <section className="bg-gradient-to-br from-slate-900 to-slate-700 text-white pt-28 pb-16 px-4">
                    <div className="max-w-5xl mx-auto">
                        {/* Breadcrumb */}
                        <nav className="mb-6">
                            <ol className="flex items-center gap-2 text-sm text-slate-300">
                                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                                <li className="text-slate-500">/</li>
                                <li>
                                    <Link
                                        href={isCompare ? "/compare" : "/review"}
                                        className="hover:text-white transition-colors"
                                    >
                                        {isCompare ? "Compare" : "Reviews"}
                                    </Link>
                                </li>
                                <li className="text-slate-500">/</li>
                                <li className="text-slate-400">{competitor.name}</li>
                            </ol>
                        </nav>

                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                            <div className="flex-1">
                                {/* Badge */}
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${isCompare
                                    ? "bg-blue-500/20 border border-blue-500/40 text-blue-300"
                                    : "bg-yellow-500/20 border border-yellow-500/40 text-yellow-300"
                                    }`}>
                                    {isCompare ? "⚡ Fee Comparison" : "📋 Honest Review"}
                                    <span className="text-slate-400">·</span>
                                    <span>{competitor.category}</span>
                                </div>

                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                                    {pageTitle}
                                </h1>

                                <p className="text-slate-300 text-lg mb-8 max-w-2xl">
                                    {isCompare ? competitor.compareDescription : competitor.reviewDescription}
                                </p>

                                {/* Quick verdict */}
                                {isCompare && (
                                    <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4 max-w-lg">
                                        <p className="text-green-300 text-sm font-semibold mb-1">Quick Verdict</p>
                                        <p className="text-white text-sm leading-relaxed">
                                            On a ${mathEx.monthlyRental.toLocaleString()}/month rental,{" "}
                                            <span className="text-red-300 font-semibold">
                                                {competitor.name} takes ${mathEx.theyTake} ({competitor.hostCommission})
                                            </span>{" "}
                                            — Leli Rentals costs only{" "}
                                            <span className="text-green-300 font-semibold">
                                                ${mathEx.leliCost}/month flat
                                            </span>
                                            . You keep{" "}
                                            <span className="text-green-300 font-semibold">
                                                ${mathEx.extraPerMonth} more per month
                                            </span>
                                            .
                                        </p>
                                    </div>
                                )}

                                {!isCompare && (
                                    <div className="flex items-center gap-4">
                                        <StarRating rating={competitor.rating} />
                                        <span className="text-slate-400 text-sm">Our rating of {competitor.name}</span>
                                    </div>
                                )}
                            </div>

                            {/* Quick Stats Card */}
                            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 min-w-[260px]">
                                <p className="text-slate-300 text-sm font-semibold mb-4 uppercase tracking-wide">
                                    {competitor.name} at a glance
                                </p>
                                <div className="space-y-3">
                                    {[
                                        { label: "Category", value: competitor.category },
                                        { label: "Host Commission", value: competitor.hostCommission === "N/A" ? "N/A" : competitor.hostCommission, warn: competitor.hostCommissionMin > 0 },
                                        { label: "Guest Fee", value: competitor.guestFee },
                                        { label: "Monthly Cost", value: competitor.monthlyFee },
                                    ].map((item) => (
                                        <div key={item.label} className="flex justify-between items-center">
                                            <span className="text-slate-400 text-sm">{item.label}</span>
                                            <span className={`text-sm font-semibold ${item.warn ? "text-red-300" : "text-white"}`}>
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/20">
                                    <p className="text-slate-400 text-xs">vs Leli Rentals</p>
                                    <p className="text-green-300 text-sm font-bold">$10/month · 0% commission</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

                    {/* ── INTRO ── */}
                    <section>
                        <p className="text-slate-700 leading-relaxed text-lg">{pageIntro}</p>
                    </section>

                    {/* ── COMPARISON TABLE (compare pages) ── */}
                    {isCompare && (
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-8">
                                {competitor.name} vs Leli Rentals — Feature by Feature
                            </h2>
                            <div className="overflow-x-auto rounded-2xl border border-slate-200">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="text-left py-4 px-6 text-slate-600 font-semibold text-sm">Feature</th>
                                            <th className="text-left py-4 px-6 text-slate-600 font-semibold text-sm">{competitor.name}</th>
                                            <th className="text-left py-4 px-6 text-blue-600 font-semibold text-sm">Leli Rentals</th>
                                            <th className="text-center py-4 px-6 text-slate-600 font-semibold text-sm">Winner</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {competitor.features.map((row, i) => (
                                            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                                                <td className="py-4 px-6 text-slate-700 font-medium text-sm">{row.feature}</td>
                                                <td className={`py-4 px-6 text-sm ${!row.leliWins ? "text-slate-900 font-medium" : "text-slate-500"}`}>
                                                    {row.competitor}
                                                </td>
                                                <td className={`py-4 px-6 text-sm ${row.leliWins ? "text-blue-700 font-semibold" : "text-slate-500"}`}>
                                                    {row.leli}
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    {row.leliWins ? (
                                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                                            Leli ✓
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                                                            {competitor.name} ✓
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* ── THE MATH (compare pages) ── */}
                    {isCompare && (
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                The Real Numbers — What You Actually Keep
                            </h2>
                            <p className="text-slate-600 mb-8 leading-relaxed">{competitor.feeBreakdown}</p>

                            <div className="grid sm:grid-cols-3 gap-6">
                                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                                    <p className="text-red-600 text-sm font-semibold mb-2">{competitor.name} Takes</p>
                                    <p className="text-4xl font-bold text-red-700 mb-1">
                                        ${mathEx.theyTake.toLocaleString()}
                                    </p>
                                    <p className="text-red-400 text-xs">
                                        per ${mathEx.monthlyRental.toLocaleString()} monthly rental
                                    </p>
                                </div>
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                                    <p className="text-slate-600 text-sm font-semibold mb-2">You Keep on {competitor.name}</p>
                                    <p className="text-4xl font-bold text-slate-700 mb-1">
                                        ${mathEx.youKeep.toLocaleString()}
                                    </p>
                                    <p className="text-slate-400 text-xs">
                                        per ${mathEx.monthlyRental.toLocaleString()} monthly rental
                                    </p>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center ring-2 ring-green-400">
                                    <p className="text-green-600 text-sm font-semibold mb-2">You Keep on Leli Rentals</p>
                                    <p className="text-4xl font-bold text-green-700 mb-1">
                                        ${mathEx.leliYouKeep.toLocaleString()}
                                    </p>
                                    <p className="text-green-400 text-xs">
                                        (after $10/month subscription)
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 bg-blue-600 rounded-2xl p-6 text-white text-center">
                                <p className="text-blue-100 text-sm mb-2">By switching to Leli Rentals you keep</p>
                                <p className="text-5xl font-bold mb-1">
                                    ${mathEx.extraPerMonth.toLocaleString()}<span className="text-2xl">/month</span>
                                </p>
                                <p className="text-blue-200 text-sm">
                                    That's ${mathEx.extraPerYear.toLocaleString()} more per year, per listing
                                </p>
                            </div>
                        </section>
                    )}

                    {/* ── PROS & CONS (review pages) ── */}
                    {!isCompare && (
                        <section>
                            <div className="flex items-center gap-4 mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">{competitor.name} — Full Review</h2>
                                <StarRating rating={competitor.rating} />
                            </div>
                            <p className="text-slate-700 leading-relaxed mb-8 text-lg">{competitor.reviewSummary}</p>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                                    <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                                        <span className="text-green-500">✓</span> What {competitor.name} Does Well
                                    </h3>
                                    <ul className="space-y-3">
                                        {competitor.pros.map((pro, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                                                <span className="text-green-500 shrink-0 mt-0.5">•</span>
                                                {pro}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                                    <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                                        <span className="text-red-500">✗</span> Where {competitor.name} Falls Short
                                    </h3>
                                    <ul className="space-y-3">
                                        {competitor.cons.map((con, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                                                <span className="text-red-400 shrink-0 mt-0.5">•</span>
                                                {con}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ── VERDICT ── */}
                    <section className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">
                            {isCompare ? "Our Verdict" : `Is ${competitor.name} Worth It in 2026?`}
                        </h2>
                        {!isCompare && (
                            <div className="flex items-center gap-3 mb-4">
                                <StarRating rating={competitor.rating} />
                                <span className="text-slate-500 text-sm">Overall Rating</span>
                            </div>
                        )}
                        <p className="text-slate-700 leading-relaxed text-lg">{competitor.verdict}</p>
                    </section>

                    {/* ── FEE BREAKDOWN (review pages) ── */}
                    {!isCompare && (
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                {competitor.name} Fee Structure — Full Breakdown
                            </h2>
                            <p className="text-slate-700 leading-relaxed text-lg mb-8">{competitor.feeBreakdown}</p>

                            {/* Simple math box */}
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                                    <p className="text-red-600 text-sm font-semibold mb-3">
                                        On ${mathEx.monthlyRental.toLocaleString()}/month with {competitor.name}:
                                    </p>
                                    <p className="text-2xl font-bold text-red-700">
                                        You keep ${mathEx.youKeep.toLocaleString()}
                                    </p>
                                    <p className="text-red-400 text-sm mt-1">
                                        {competitor.name} takes ${mathEx.theyTake.toLocaleString()} ({competitor.hostCommission})
                                    </p>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 ring-2 ring-green-400">
                                    <p className="text-green-600 text-sm font-semibold mb-3">
                                        On ${mathEx.monthlyRental.toLocaleString()}/month with Leli Rentals:
                                    </p>
                                    <p className="text-2xl font-bold text-green-700">
                                        You keep ${mathEx.leliYouKeep.toLocaleString()}
                                    </p>
                                    <p className="text-green-400 text-sm mt-1">
                                        Only $10/month subscription — zero commission
                                    </p>
                                </div>
                            </div>

                            <p className="text-slate-600 mt-6 leading-relaxed">{competitor.switchReason}</p>
                        </section>
                    )}

                    {/* ── SWITCH CTA ── */}
                    <section className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-10 text-white text-center">
                        <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold mb-6">
                            🎉 Limited Offer — Use Code FREEMONTH
                        </div>
                        <h2 className="text-3xl font-bold mb-3">
                            {isCompare
                                ? `Ready to Switch From ${competitor.name} to Leli Rentals?`
                                : `Looking for a Better Alternative to ${competitor.name}?`}
                        </h2>
                        <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                            Get your first month of unlimited listings completely free.
                            Zero commission, zero setup fees, cancel anytime.
                            Keep ${mathEx.extraPerMonth.toLocaleString()} more every month.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => setShowPromo(true)}
                                className="inline-flex items-center justify-center px-10 py-4 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold rounded-xl transition-colors text-lg"
                            >
                                Claim My Free Month →
                            </button>
                            <Link
                                href="/pricing"
                                className="inline-flex items-center justify-center px-10 py-4 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl border border-white/30 transition-colors text-lg"
                            >
                                View Pricing
                            </Link>
                        </div>
                        <p className="mt-4 text-blue-200 text-sm">
                            No credit card required · Cancel anytime · 0% commission forever
                        </p>
                    </section>

                    {/* ── FAQ ── */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">
                            {isCompare
                                ? `Frequently Asked Questions — ${competitor.name} vs Leli Rentals`
                                : `Frequently Asked Questions — ${competitor.name} Review`}
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6">
                                    <h3 className="font-semibold text-slate-900 mb-3">{faq.q}</h3>
                                    <p className="text-slate-600 leading-relaxed text-sm">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── OUTLINKS ── */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            Helpful Resources
                        </h2>
                        <div className="grid sm:grid-cols-3 gap-4">
                            {competitor.outlinks.map((link) => (
                                <a
                                    key={link.url}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors group"
                                >
                                    <span className="text-blue-600">🔗</span>
                                    <span className="text-slate-700 text-sm font-medium group-hover:text-blue-600 transition-colors">
                                        {link.anchor}
                                    </span>
                                    <span className="ml-auto text-slate-400 text-xs">↗</span>
                                </a>
                            ))}
                        </div>
                    </section>

                    {/* ── EXPLORE MORE COMPARISONS ── */}
                    <section className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">
                            {isCompare ? "Compare Other Platforms" : "Read More Reviews"}
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {[
                                { name: "Turo vs Leli", compare: "turo-vs-leli-rentals", review: "turo" },
                                { name: "Airbnb vs Leli", compare: "airbnb-vs-leli-rentals", review: "airbnb" },
                                { name: "Fat Llama vs Leli", compare: "fat-llama-vs-leli-rentals", review: "fat-llama" },
                                { name: "Rent the Runway vs Leli", compare: "rent-the-runway-vs-leli-rentals", review: "rent-the-runway" },
                                { name: "ShareGrid vs Leli", compare: "sharegrid-vs-leli-rentals", review: "sharegrid" },
                                { name: "WeWork vs Leli", compare: "wework-vs-leli-rentals", review: "wework" },
                                { name: "BabyQuip vs Leli", compare: "babyquip-vs-leli-rentals", review: "babyquip" },
                                { name: "Spinlister vs Leli", compare: "spinlister-vs-leli-rentals", review: "spinlister" },
                                { name: "Neighbor vs Leli", compare: "neighbor-vs-leli-rentals", review: "neighbor" },
                                { name: "Peerspace vs Leli", compare: "peerspace-vs-leli-rentals", review: "peerspace" },
                                { name: "Getaround vs Leli", compare: "getaround-vs-leli-rentals", review: "getaround" },
                            ]
                                .filter((c) =>
                                    isCompare
                                        ? c.compare !== competitor.slug
                                        : c.review !== competitor.id
                                )
                                .map((c) => (
                                    <Link
                                        key={isCompare ? c.compare : c.review}
                                        href={isCompare ? `/compare/${c.compare}` : `/review/${c.review}`}
                                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
                                    >
                                        {c.name} →
                                    </Link>
                                ))}
                        </div>
                    </section>

                </div>
            </div>
        </>
    )
}
