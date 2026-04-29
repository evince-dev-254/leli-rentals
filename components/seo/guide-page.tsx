import Link from "next/link"
import type { GuideData } from "@/lib/guides-data"

interface Props {
    guide: GuideData
    relatedGuides: GuideData[]
}

export function GuidePage({ guide, relatedGuides }: Props) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.leli.rentals"
    const url = `${siteUrl}/guides/${guide.slug}`

    // Article schema
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: guide.headline,
        description: guide.metaDescription,
        image: guide.heroImage,
        datePublished: guide.publishDate,
        dateModified: guide.lastUpdated,
        author: { "@type": "Organization", name: "Leli Rentals", url: siteUrl },
        publisher: {
            "@type": "Organization",
            name: "Leli Rentals",
            logo: { "@type": "ImageObject", url: `${siteUrl}/logo.png` },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        keywords: guide.keywords.join(", "),
    }

    // FAQ schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: guide.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="bg-white min-h-screen">
                {/* ── HERO ── */}
                <div className="relative pt-20">
                    <div className="absolute inset-0 bg-slate-900/70 z-10" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={guide.heroImage}
                        alt={guide.heroAlt}
                        className="w-full h-[420px] object-cover"
                    />
                    <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 px-4">
                        <div className="max-w-4xl mx-auto w-full">
                            {/* Breadcrumb */}
                            <nav className="mb-4">
                                <ol className="flex items-center gap-2 text-sm text-slate-300">
                                    <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                                    <li className="text-slate-500">/</li>
                                    <li><Link href="/guides" className="hover:text-white transition-colors">Rental Guides</Link></li>
                                    <li className="text-slate-500">/</li>
                                    <li className="text-slate-400 truncate max-w-[200px]">{guide.title}</li>
                                </ol>
                            </nav>

                            {/* Category + reading time */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-green-500/30 border border-green-500/50 text-green-300 px-3 py-1 rounded-full text-xs font-medium">
                                    {guide.category}
                                </span>
                                <span className="text-slate-400 text-sm">{guide.readingTime}</span>
                                <span className="text-slate-400 text-sm">·</span>
                                <span className="text-slate-400 text-sm">Updated {guide.lastUpdated}</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                                {guide.headline}
                            </h1>
                            <p className="text-slate-300 text-lg max-w-2xl">
                                {guide.subheadline}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="grid lg:grid-cols-3 gap-12">

                        {/* ── MAIN CONTENT ── */}
                        <div className="lg:col-span-2 space-y-12">

                            {/* Intro */}
                            <section>
                                <p className="text-slate-700 leading-relaxed text-lg">{guide.intro}</p>
                            </section>

                            {/* Sections */}
                            {guide.sections.map((section, i) => (
                                <section key={i}>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                        {section.heading}
                                    </h2>
                                    {section.content.split("\n\n").map((paragraph, j) => (
                                        <p key={j} className="text-slate-700 leading-relaxed mb-4">
                                            {paragraph}
                                        </p>
                                    ))}
                                </section>
                            ))}

                            {/* CTA Banner */}
                            <section className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-8 text-white text-center">
                                <h2 className="text-2xl font-bold mb-2">
                                    See How Much Your Assets Could Earn
                                </h2>
                                <p className="text-green-100 mb-6">
                                    Use our free earning calculator — enter any item and get an
                                    instant monthly income estimate with zero obligation.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    {guide.internalLinks.slice(0, 2).map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors text-sm"
                                        >
                                            {link.anchor} →
                                        </Link>
                                    ))}
                                </div>
                                <p className="mt-4 text-green-200 text-xs">
                                    $10/month flat · 0% commission · Cancel anytime
                                </p>
                            </section>

                            {/* FAQ */}
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-8">
                                    Frequently Asked Questions
                                </h2>
                                <div className="space-y-4">
                                    {guide.faqs.map((faq, i) => (
                                        <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                                            <h3 className="font-semibold text-slate-900 mb-3">{faq.q}</h3>
                                            <p className="text-slate-600 leading-relaxed text-sm">{faq.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Outlinks */}
                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-4">
                                    Helpful Resources
                                </h2>
                                <div className="space-y-3">
                                    {guide.outlinks.map((link) => (
                                        <a
                                            key={link.url}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors group"
                                        >
                                            <span className="text-green-600">🔗</span>
                                            <span className="text-slate-700 text-sm font-medium group-hover:text-green-700 transition-colors">
                                                {link.anchor}
                                            </span>
                                            <span className="ml-auto text-slate-400 text-xs">↗</span>
                                        </a>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* ── SIDEBAR ── */}
                        <div className="space-y-8">

                            {/* Internal links */}
                            <div className="bg-green-50 rounded-2xl p-6 border border-green-200 sticky top-24">
                                <h3 className="font-bold text-green-900 mb-4 text-sm uppercase tracking-wide">
                                    Related Tools
                                </h3>
                                <div className="space-y-3">
                                    {guide.internalLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="flex items-center gap-2 text-sm text-green-700 hover:text-green-900 font-medium transition-colors"
                                        >
                                            <span className="text-green-500">→</span>
                                            {link.anchor}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Related guides */}
                            {relatedGuides.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                                    <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">
                                        Related Guides
                                    </h3>
                                    <div className="space-y-4">
                                        {relatedGuides.map((related) => (
                                            <Link
                                                key={related.slug}
                                                href={`/guides/${related.slug}`}
                                                className="block group"
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={related.heroImage}
                                                    alt={related.title}
                                                    className="w-full h-24 object-cover rounded-xl mb-2 group-hover:opacity-90 transition-opacity"
                                                />
                                                <p className="text-sm font-semibold text-slate-800 group-hover:text-green-700 transition-colors leading-snug">
                                                    {related.title}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">{related.readingTime}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Start earning CTA */}
                            <div className="bg-slate-900 rounded-2xl p-6 text-white text-center">
                                <p className="text-2xl mb-2">💰</p>
                                <h3 className="font-bold mb-2">Start Earning Today</h3>
                                <p className="text-slate-400 text-sm mb-4">
                                    List your assets on Leli Rentals — $10/month flat, zero commission.
                                </p>
                                <Link
                                    href="/dashboard/listings/new"
                                    className="block w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors text-sm"
                                >
                                    Create My First Listing
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}