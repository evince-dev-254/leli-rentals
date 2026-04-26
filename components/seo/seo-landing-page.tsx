"use client"

import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { StructuredData } from "@/components/seo/structured-data"
import type { SeoPage, SeoCategoryData, SeoCity } from "@/lib/seo-pages-data"
import { universalOutlinks } from "@/lib/seo-pages-data"

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Listing {
  id: string
  title: string
  price: number
  price_unit: string
  images: string[]
  location: string
  rating?: number
}

interface Props {
  page: SeoPage
  category: SeoCategoryData
}

// ─── FAQ DATA PER INTENT ──────────────────────────────────────────────────────
function getFaqs(page: SeoPage, category: SeoCategoryData) {
  const keyword = page.keyword.label
  const cityName = page.city?.name ?? "your city"
  const catName = category.name.toLowerCase()

  if (page.intent === "renter") {
    return [
      {
        q: `How do I ${keyword.toLowerCase()} in ${cityName} on Leli Rentals?`,
        a: `To ${keyword.toLowerCase()} in ${cityName} on Leli Rentals, simply browse the listings on this page, select the item or space that meets your needs, check availability, and send a booking request to the owner. Once confirmed, you pay securely through the platform and arrange pickup or delivery directly with the owner.`,
      },
      {
        q: `Is it safe to ${keyword.toLowerCase()} in ${cityName} through Leli Rentals?`,
        a: `Yes — every listing on Leli Rentals in ${cityName} is from a verified owner with ratings and reviews from previous renters. Our secure payment system protects your transaction, and our support team is available if any issue arises during your rental period.`,
      },
      {
        q: `How much does it cost to ${keyword.toLowerCase()} in ${cityName}?`,
        a: `The cost to ${keyword.toLowerCase()} in ${cityName} varies depending on the specific item, duration, and owner. Leli Rentals displays transparent pricing on every listing — daily, weekly, and monthly rates are clearly shown with no hidden fees. Browse the listings on this page to compare current rates in ${cityName}.`,
      },
      {
        q: `Can I ${keyword.toLowerCase()} in ${cityName} for just one day?`,
        a: `Absolutely. Leli Rentals supports flexible booking periods including single-day rentals in ${cityName}. Simply filter by your required dates when browsing listings and book directly with the owner for exactly the duration you need.`,
      },
      {
        q: `What if I have a problem with my ${catName} rental in ${cityName}?`,
        a: `Leli Rentals provides dedicated customer support for all rentals in ${cityName}. If you experience any issue with your ${catName} rental, contact our support team through the app or website and we will work with you and the owner to resolve it promptly.`,
      },
    ]
  }

  if (page.intent === "owner") {
    return [
      {
        q: `How do I ${keyword.toLowerCase()} on Leli Rentals?`,
        a: `To ${keyword.toLowerCase()} on Leli Rentals, create a free account, navigate to your dashboard, and click "Add New Listing." Upload photos of your ${catName}, write a clear description, set your daily or weekly rate, define your availability, and publish. Your listing will be live and visible to renters worldwide within minutes.`,
      },
      {
        q: `How much can I earn from ${keyword.toLowerCase()}?`,
        a: `Your earnings depend on your specific ${catName}, its condition, and how frequently you rent it out. Our earning calculator can give you an estimate based on category averages. Many owners on Leli Rentals earn between $200 and $2,000 per month from their listings — and unlike other platforms, Leli takes zero commission from your earnings.`,
      },
      {
        q: `Is Leli Rentals free to list on?`,
        a: `Leli Rentals charges a simple flat monthly subscription fee rather than taking commission from each rental. This means you keep 100% of every payment your ${catName} earns. There are no listing fees, no setup costs, and no surprise deductions at payout.`,
      },
      {
        q: `How do I get paid when someone rents my ${catName}?`,
        a: `When a renter books your listing, payment is processed securely through Leli Rentals' payment system. Funds are released to your account after the rental period begins. You can withdraw your earnings directly to your bank account or mobile money wallet.`,
      },
      {
        q: `What protection do I have as an owner listing on Leli Rentals?`,
        a: `Leli Rentals verifies all renters before they can make bookings. You can also review renter profiles and ratings before accepting any request. Our platform provides owner protection features including damage reporting tools and a dedicated support team to assist with any disputes.`,
      },
    ]
  }

  // competitor
  return [
    {
      q: `Why should I switch from ${keyword.replace(" alternative", "").replace(" Alternative", "")} to Leli Rentals?`,
      a: `The primary reason owners switch to Leli Rentals is the fee structure. Most competitor platforms charge between 15% and 40% commission on every rental transaction. Leli Rentals charges a flat monthly subscription with zero commission deductions — meaning you keep 100% of every rental payment your ${catName} generates.`,
    },
    {
      q: `Is Leli Rentals as reliable as established ${catName} rental platforms?`,
      a: `Yes. Leli Rentals provides the same core features as established platforms — verified user profiles, secure payments, booking management, owner and renter ratings, and global marketplace visibility — simply without the commission-based fee model that reduces what owners earn.`,
    },
    {
      q: `How does Leli Rentals make money if it doesn't charge commission?`,
      a: `Leli Rentals operates on a flat monthly subscription model. Owners pay a small monthly fee for unlimited listings and keep 100% of their rental earnings. This model aligns Leli's incentives with owner success — the more you earn, the more you want to stay subscribed.`,
    },
    {
      q: `Can I migrate my existing listings to Leli Rentals?`,
      a: `Yes. You can create new listings on Leli Rentals independently of any other platform you currently use. Many owners list on Leli Rentals alongside their existing platforms while they evaluate the difference in earnings — and most find that keeping more of each rental payment makes Leli Rentals the preferred platform within the first month.`,
    },
    {
      q: `Does Leli Rentals have enough renters to justify switching?`,
      a: `Leli Rentals operates across hundreds of cities worldwide and is growing rapidly. Our platform is designed to attract renters through search engine visibility — meaning your listings benefit from targeted organic traffic from renters actively searching for exactly what you offer, rather than relying solely on platform-internal search.`,
    },
  ]
}

// ─── SCHEMA GENERATORS ───────────────────────────────────────────────────────
function generateFaqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  }
}

function generateWebpageSchema(
  page: SeoPage,
  category: SeoCategoryData,
  keyword: string,
  cityName: string,
  siteUrl: string
) {
  const title =
    page.intent === "renter"
      ? `${keyword} in ${cityName} — Find the Best Deals | Leli Rentals`
      : page.intent === "owner"
        ? `${keyword} — Earn From Your Assets | Leli Rentals`
        : `${keyword} — Switch to Leli Rentals | No Commission Fees`

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url: `${siteUrl}/${page.slug}`,
    description: `${keyword} on Leli Rentals — the peer-to-peer rental marketplace with no commission fees.`,
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      name: "Leli Rentals",
      url: siteUrl,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: category.name, item: `${siteUrl}/categories/${category.id}` },
        { "@type": "ListItem", position: 3, name: keyword, item: `${siteUrl}/${page.slug}` },
      ],
    },
  }
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function SeoLandingPage({ page, category }: Props) {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  const keyword = page.keyword.label
  const cityName = page.city?.name ?? ""
  const cityBlurb = page.city?.blurb ?? ""
  const intent = page.intent
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.leli.rentals"

  const image = intent === "renter" ? category.images.renter : category.images.owner
  const altText =
    intent === "renter"
      ? `${keyword} in ${cityName} — Leli Rentals`
      : `${keyword} — Leli Rentals`

  const categoryBlurb =
    intent === "renter"
      ? category.blurbs.renter
      : intent === "owner"
        ? category.blurbs.owner
        : category.blurbs.competitor

  const outlinks = [
    ...(page.city ? universalOutlinks(cityName, page.city.slug) : []),
    ...category.outlinks,
  ]

  const faqs = getFaqs(page, category)

  // CTA config per intent
  const cta = {
    renter: {
      primary: { label: `Browse ${category.name} Listings`, href: `/categories/${category.id}` },
      secondary: { label: "List Your Item — Start Earning", href: "/dashboard/listings/new" },
      headline: intent === "renter" ? `Find ${keyword} in ${cityName} on Leli Rentals` : keyword,
      sub:
        intent === "renter"
          ? `Browse trusted local ${category.name.toLowerCase()} listings in ${cityName}. Verified owners, transparent pricing, flexible booking.`
          : `Join thousands of owners earning passive income on Leli Rentals. Zero commission — just a flat monthly fee.`,
    },
    owner: {
      primary: { label: "List Your Item — Start Earning Today", href: "/dashboard/listings/new" },
      secondary: { label: "Browse Listings", href: `/categories/${category.id}` },
      headline: keyword,
      sub: `Turn your idle ${category.name.toLowerCase()} into consistent rental income. Leli Rentals takes zero commission — you keep every cent.`,
    },
    competitor: {
      primary: { label: "Switch to Leli Rentals — List Free", href: "/dashboard/listings/new" },
      secondary: { label: "See How It Works", href: `/categories/${category.id}` },
      headline: keyword,
      sub: `Stop paying high commission fees. Leli Rentals charges a flat monthly subscription and you keep 100% of every rental payment.`,
    },
  }

  const ctaConfig = cta[intent] || cta.renter

  // Fetch live listings from Supabase
  useEffect(() => {
    async function fetchListings() {
      try {
        let query = supabase
          .from("listings")
          .select("id, title, price, price_unit, images, location, rating")
          .eq("category_id", category.id)
          .eq("status", "active")
          .limit(6)

        // For renter pages filter by city if possible
        if (page.intent === "renter" && cityName) {
          query = query.ilike("location", `%${cityName}%`)
        }

        const { data } = await query
        if (data && data.length > 0) {
          setListings(data)
        } else if (page.intent === "renter") {
          // Fallback — fetch any listings in this category
          const { data: fallback } = await supabase
            .from("listings")
            .select("id, title, price, price_unit, images, location, rating")
            .eq("category_id", category.id)
            .eq("status", "active")
            .limit(6)
          setListings(fallback ?? [])
        }
      } catch {
        // Silently fail — page still renders without listings
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [category.id, cityName, page.intent])

  return (
    <>
      {/* Schema Markup */}
      <StructuredData data={generateWebpageSchema(page, category, keyword, cityName, siteUrl)} />
      <StructuredData data={generateFaqSchema(faqs)} />

      <main className="min-h-screen bg-white">
        {/* ── HERO ── */}
        <section className="relative bg-gradient-to-br from-slate-900 to-slate-700 text-white">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={image}
              alt={altText}
              fill
              className="object-cover opacity-20"
              priority
              sizes="100vw"
              unoptimized={true}
            />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 sm:py-28">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-slate-300">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li className="text-slate-500">/</li>
                <li>
                  <Link href={`/categories/${category.id}`} className="hover:text-white transition-colors">
                    {category.name}
                  </Link>
                </li>
                {cityName && (
                  <>
                    <li className="text-slate-500">/</li>
                    <li className="text-slate-400">{cityName}</li>
                  </>
                )}
              </ol>
            </nav>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 max-w-3xl">
              {intent === "renter"
                ? `${keyword} in ${cityName}`
                : keyword}
            </h1>

            <p className="text-lg sm:text-xl text-slate-200 max-w-2xl mb-10 leading-relaxed">
              {ctaConfig.sub}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={ctaConfig.primary.href}
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-lg"
              >
                {ctaConfig.primary.label}
              </Link>
              <Link
                href={ctaConfig.secondary.href}
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 transition-colors text-lg"
              >
                {ctaConfig.secondary.label}
              </Link>
            </div>
          </div>
        </section>

        {/* ── TRUST BADGES ── */}
        <section className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-600">
              {[
                "✅ Verified Owners",
                "🔒 Secure Payments",
                "⭐ Rated Listings",
                "💰 Zero Commission",
                "🌍 Global Marketplace",
                "📞 24/7 Support",
              ].map((badge) => (
                <span key={badge} className="font-medium">{badge}</span>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-16 space-y-20">
          {/* ── CITY CONTEXT (renter pages only) ── */}
          {intent === "renter" && cityBlurb && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {keyword} in {cityName} — Why Leli Rentals?
              </h2>
              <div className="grid lg:grid-cols-2 gap-10 items-start">
                <div className="space-y-4">
                  <p className="text-slate-700 leading-relaxed text-lg">{cityBlurb}</p>
                </div>
                <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden">
                  <Image
                    src={image}
                    alt={`${keyword} in ${cityName} — Leli Rentals`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    unoptimized={true}
                  />
                </div>
              </div>
            </section>
          )}

          {/* ── CATEGORY BLURB ── */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {intent === "renter"
                ? `About ${category.name} Rentals on Leli Rentals`
                : intent === "owner"
                  ? `Why List Your ${category.name} on Leli Rentals?`
                  : `The Better Alternative for ${category.name} Owners`}
            </h2>
            <p className="text-slate-700 leading-relaxed text-lg">{categoryBlurb}</p>
          </section>

          {/* ── HOW IT WORKS ── */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-10">
              {intent === "renter"
                ? `How to ${keyword} in ${cityName} on Leli Rentals`
                : intent === "owner"
                  ? `How to Start Earning From Your ${category.name}`
                  : `How Leli Rentals Works — The Smarter Alternative`}
            </h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {(intent === "renter"
                ? [
                  {
                    step: "1",
                    title: "Browse Listings",
                    desc: `Search available ${category.name.toLowerCase()} listings in ${cityName}. Filter by price, availability, and distance from your location.`,
                  },
                  {
                    step: "2",
                    title: "Book Securely",
                    desc: `Select your rental dates and send a booking request. Pay securely through Leli Rentals — your payment is protected until the rental starts.`,
                  },
                  {
                    step: "3",
                    title: "Enjoy Your Rental",
                    desc: `Collect your ${category.name.toLowerCase()} from the owner and enjoy. Leave a review after to help other renters in ${cityName} make great decisions.`,
                  },
                ]
                : intent === "owner"
                  ? [
                    {
                      step: "1",
                      title: "Create Your Listing",
                      desc: `Add photos, write a description, set your daily or weekly rate, and define your availability. Your listing goes live in minutes.`,
                    },
                    {
                      step: "2",
                      title: "Accept Bookings",
                      desc: `Review renter profiles and accept booking requests that suit your schedule. Our messaging system makes it easy to coordinate with renters.`,
                    },
                    {
                      step: "3",
                      title: "Get Paid",
                      desc: `Receive payment directly to your account after each rental. Zero commission deducted — you keep every cent your ${category.name.toLowerCase()} earns.`,
                    },
                  ]
                  : [
                    {
                      step: "1",
                      title: "Create a Free Listing",
                      desc: `Sign up and list your ${category.name.toLowerCase()} in minutes. No setup fee, no listing fee — just your monthly subscription.`,
                    },
                    {
                      step: "2",
                      title: "Receive Bookings",
                      desc: `Renters find your listing through Leli Rentals' global marketplace and search engine visibility. Accept bookings on your own terms.`,
                    },
                    {
                      step: "3",
                      title: "Keep Everything You Earn",
                      desc: `Every rental payment goes directly to you. No commission deducted, no percentage taken. Your earnings are 100% yours.`,
                    },
                  ]
              ).map((item) => (
                <div
                  key={item.step}
                  className="bg-slate-50 rounded-2xl p-8 border border-slate-200"
                >
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── LIVE LISTINGS ── */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                {intent === "renter"
                  ? `Available ${category.name} in ${cityName}`
                  : `Active ${category.name} Listings on Leli Rentals`}
              </h2>
              <Link
                href={`/categories/${category.id}`}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-slate-100 rounded-2xl h-64 animate-pulse" />
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/listings/${listing.id}`}
                    className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48 bg-slate-100">
                      {listing.images?.[0] ? (
                        <Image
                          src={listing.images[0]}
                          alt={listing.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-400 text-sm">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2 text-sm">
                        {listing.title}
                      </h3>
                      <p className="text-slate-500 text-xs mb-2">{listing.location}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-600">
                          ${listing.price}/{listing.price_unit ?? "day"}
                        </span>
                        {listing.rating && (
                          <span className="text-xs text-slate-500">⭐ {listing.rating.toFixed(1)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-12 text-center border border-slate-200">
                <p className="text-slate-500 text-lg mb-2">
                  No {category.name.toLowerCase()} listings yet{cityName ? ` in ${cityName}` : ""}.
                </p>
                <p className="text-slate-400 text-sm mb-6">
                  Be the first to list your {category.name.toLowerCase()} and reach renters worldwide.
                </p>
                <Link
                  href="/dashboard/listings/new"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  List Your {category.name} Now
                </Link>
              </div>
            )}
          </section>

          {/* ── WHY LELI RENTALS ── */}
          <section className="bg-blue-50 rounded-3xl p-10 border border-blue-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
              Why Choose Leli Rentals
              {intent === "renter" && cityName ? ` in ${cityName}` : ""}?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: "💰",
                  title: "Zero Commission",
                  desc: "Owners keep 100% of every rental payment. We charge a flat monthly subscription only.",
                },
                {
                  icon: "✅",
                  title: "Verified Community",
                  desc: "All owners and renters are verified. Every listing includes ratings and reviews.",
                },
                {
                  icon: "🌍",
                  title: "Global Reach",
                  desc: "Your listing is visible to renters across hundreds of cities worldwide — not just locally.",
                },
                {
                  icon: "🔒",
                  title: "Secure Payments",
                  desc: "All transactions are processed through our secure payment system with full protection.",
                },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ ── */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-10">
              Frequently Asked Questions
              {intent === "renter" && cityName ? ` — ${keyword} in ${cityName}` : ` — ${keyword}`}
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200 p-8"
                >
                  <h3 className="font-semibold text-slate-900 mb-3 text-lg">{faq.q}</h3>
                  <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── EXTERNAL RESOURCES (outlinks) ── */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Helpful Resources
              {intent === "renter" && cityName ? ` for ${category.name} Rentals in ${cityName}` : ` for ${category.name} Owners`}
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Before you{" "}
              {intent === "renter"
                ? `${keyword.toLowerCase()} in ${cityName}`
                : "list your " + category.name.toLowerCase() + " on Leli Rentals"}
              , here are some trusted external resources that may be helpful:
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {outlinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-colors group"
                >
                  <span className="text-blue-600 text-lg">🔗</span>
                  <span className="text-slate-700 text-sm font-medium group-hover:text-blue-600 transition-colors">
                    {link.anchor}
                  </span>
                  <span className="ml-auto text-slate-400 text-xs">↗</span>
                </a>
              ))}
            </div>
          </section>

          {/* ── FINAL CTA ── */}
          <section className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              {intent === "renter"
                ? `Ready to ${keyword} in ${cityName}?`
                : intent === "owner"
                  ? `Start Earning From Your ${category.name} Today`
                  : `Switch to Leli Rentals — Keep More of What You Earn`}
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              {intent === "renter"
                ? `Browse trusted ${category.name.toLowerCase()} listings in ${cityName} right now. Verified owners, transparent pricing, flexible booking — all on Leli Rentals.`
                : intent === "owner"
                  ? `List your ${category.name.toLowerCase()} on Leli Rentals in minutes. Zero commission, global reach, and a growing community of verified renters.`
                  : `Join thousands of ${category.name.toLowerCase()} owners who have already switched to Leli Rentals and are keeping more of what they earn every month.`}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={ctaConfig.primary.href}
                className="inline-flex items-center justify-center px-10 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors text-lg"
              >
                {ctaConfig.primary.label}
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-10 py-4 bg-blue-500/40 hover:bg-blue-500/60 text-white font-semibold rounded-xl border border-white/30 transition-colors text-lg"
              >
                Create Free Account
              </Link>
            </div>
            <p className="mt-6 text-blue-200 text-sm">
              No credit card required · Cancel anytime · Zero commission on all rentals
            </p>
          </section>

        </div>
      </main>
    </>
  )
}
