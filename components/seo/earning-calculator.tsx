"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import {
    type CategoryCalculatorData,
    type CurrencyConfig,
    CURRENCIES,
    matchItemRate,
    calculateEarnings,
    formatInCurrency,
} from "@/lib/calculator-data"

interface Props {
    category: CategoryCalculatorData
}

interface ExchangeRates {
    [currency: string]: number
}

// ─── TRENDING TICKER ──────────────────────────────────────────────────────────
function TrendingTicker({ messages }: { messages: string[] }) {
    const [current, setCurrent] = useState(0)
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false)
            setTimeout(() => {
                setCurrent((prev) => (prev + 1) % messages.length)
                setVisible(true)
            }, 400)
        }, 4000)
        return () => clearInterval(interval)
    }, [messages.length])

    return (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shrink-0" />
            <p
                className={`text-sm text-green-800 font-medium transition-opacity duration-400 ${visible ? "opacity-100" : "opacity-0"
                    }`}
            >
                {messages[current]}
            </p>
        </div>
    )
}

// ─── SHARE BUTTON ─────────────────────────────────────────────────────────────
function ShareButton({
    itemName,
    monthly,
    currency,
    categoryName,
}: {
    itemName: string
    monthly: string
    currency: CurrencyConfig
    categoryName: string
}) {
    const [copied, setCopied] = useState(false)

    const shareText = `I could earn ${monthly}/month renting my ${itemName || categoryName} on Leli Rentals — with zero commission! 🚀 leli.rentals/earn`

    const handleCopy = () => {
        navigator.clipboard.writeText(shareText).catch(() => { })
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`

    return (
        <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">
                Share your earning potential:
            </p>
            <div className="flex flex-wrap gap-3">
                <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.258 5.632 5.907-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Share on X
                </a>
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Share on WhatsApp
                </a>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                    {copied ? "✓ Copied!" : "Copy text"}
                </button>
            </div>
        </div>
    )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function EarningCalculator({ category }: Props) {
    const [input, setInput] = useState("")
    const [selectedCurrency, setSelectedCurrency] = useState<CurrencyConfig>(CURRENCIES[0])
    const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({ USD: 1 })
    const [ratesLoading, setRatesLoading] = useState(true)
    const [hasCalculated, setHasCalculated] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const resultsRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Fetch exchange rates from Supabase
    useEffect(() => {
        async function fetchRates() {
            try {
                const { data } = await supabase
                    .from("exchange_rates")
                    .select("currency, rate")

                if (data && data.length > 0) {
                    const rates: ExchangeRates = {}
                    data.forEach((row) => { rates[row.currency] = row.rate })
                    setExchangeRates(rates)
                }
            } catch {
                // Silently fail — USD default still works
            } finally {
                setRatesLoading(false)
            }
        }
        fetchRates()
    }, [])

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    // Calculate earnings
    const matchedRate = matchItemRate(input, category)
    const earnings = calculateEarnings(matchedRate)
    const rate = exchangeRates[selectedCurrency.code] ?? 1

    const fmt = (usd: number) => formatInCurrency(usd, selectedCurrency, rate)

    const handleCalculate = (value?: string) => {
        if (value !== undefined) setInput(value)
        setHasCalculated(true)
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 100)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleCalculate()
    }

    const itemDisplayName = input.trim() || category.name

    return (
        <div className="bg-white min-h-screen">
            {/* ── HERO ── */}
            <section className="relative bg-gradient-to-br from-slate-900 to-slate-700 text-white pt-28 pb-16 px-4">
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src={category.image}
                        alt={category.headline}
                        fill
                        className="object-cover opacity-15"
                        priority
                        unoptimized
                    />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    {/* Breadcrumb */}
                    <nav className="mb-6">
                        <ol className="flex items-center justify-center gap-2 text-sm text-slate-300">
                            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li className="text-slate-500">/</li>
                            <li><Link href={`/categories/${category.id}`} className="hover:text-white transition-colors">{category.name}</Link></li>
                            <li className="text-slate-500">/</li>
                            <li className="text-slate-400">Earning Calculator</li>
                        </ol>
                    </nav>

                    <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Free Rental Income Calculator
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 max-w-3xl mx-auto">
                        {category.headline}
                    </h1>
                    <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                        {category.subheadline}
                    </p>

                    {/* Main Calculator Input */}
                    <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto">
                        <p className="text-slate-700 font-semibold text-lg mb-4 text-left">
                            What {category.name.toLowerCase()} do you want to rent out?
                        </p>

                        {/* Input + Currency Row */}
                        <div className="flex gap-3 mb-4">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={category.placeholder}
                                className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-900 text-base outline-none focus:border-blue-400 transition-colors placeholder:text-slate-400"
                            />

                            {/* Currency Selector */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-2 px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 font-medium hover:border-blue-400 transition-colors bg-white min-w-[100px]"
                                >
                                    <span>{selectedCurrency.flag}</span>
                                    <span>{selectedCurrency.code}</span>
                                    <svg className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                                        {CURRENCIES.map((c) => (
                                            <button
                                                key={c.code}
                                                onClick={() => { setSelectedCurrency(c); setShowDropdown(false) }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors ${selectedCurrency.code === c.code ? "bg-blue-50 text-blue-700" : "text-slate-700"}`}
                                            >
                                                <span className="text-lg">{c.flag}</span>
                                                <div>
                                                    <div className="font-medium text-sm">{c.code}</div>
                                                    <div className="text-xs text-slate-500">{c.name}</div>
                                                </div>
                                                {!ratesLoading && exchangeRates[c.code] && (
                                                    <span className="ml-auto text-xs text-slate-400">
                                                        {c.code === "USD" ? "1.00" : exchangeRates[c.code]?.toFixed(2)}
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Popular Items */}
                        <div className="mb-5">
                            <p className="text-xs text-slate-500 mb-2">Popular items:</p>
                            <div className="flex flex-wrap gap-2">
                                {category.popularItems.map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => handleCalculate(item)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${input === item
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => handleCalculate()}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg transition-colors"
                        >
                            Calculate My Earnings →
                        </button>
                    </div>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

                {/* ── TRENDING TICKER ── */}
                <TrendingTicker messages={category.trendingTicker} />

                {/* ── RESULTS ── */}
                <div ref={resultsRef}>
                    {hasCalculated ? (
                        <div className="space-y-8">
                            {/* Matched Item Badge */}
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full" />
                                <p className="text-slate-600 text-sm">
                                    Showing estimated earnings for{" "}
                                    <strong className="text-slate-900">{matchedRate.name}</strong>
                                    {input && input !== matchedRate.name && (
                                        <span className="text-slate-400"> (matched from "{input}")</span>
                                    )}
                                    {" "}in{" "}
                                    <strong className="text-slate-900">{selectedCurrency.name}</strong>
                                </p>
                            </div>

                            {/* Big Earnings Cards */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { label: "Per Day", value: fmt(earnings.daily), sub: `${matchedRate.avgDaysPerMonth} rental days/month avg` },
                                    { label: "Per Week", value: fmt(earnings.weekly), sub: "Based on daily rate × 7" },
                                    { label: "Per Month", value: fmt(earnings.monthly), sub: "Estimated monthly income", highlight: true },
                                    { label: "Per Year", value: fmt(earnings.yearly), sub: "Estimated annual income" },
                                ].map((card) => (
                                    <div
                                        key={card.label}
                                        className={`rounded-2xl p-5 border text-center ${card.highlight
                                                ? "bg-green-50 border-green-200 ring-2 ring-green-400"
                                                : "bg-slate-50 border-slate-200"
                                            }`}
                                    >
                                        <p className="text-xs text-slate-500 mb-1">{card.label}</p>
                                        <p className={`text-2xl font-bold mb-1 ${card.highlight ? "text-green-700" : "text-slate-900"}`}>
                                            {card.value}
                                        </p>
                                        <p className="text-xs text-slate-400">{card.sub}</p>
                                    </div>
                                ))}
                            </div>

                            {/* ROI vs Subscription */}
                            <div className="bg-blue-600 rounded-2xl p-8 text-white">
                                <h2 className="text-2xl font-bold mb-2">
                                    Your {selectedCurrency.code} {fmt(earnings.monthly)} monthly income vs Leli Rentals cost
                                </h2>
                                <p className="text-blue-100 mb-6">
                                    See exactly how much you keep after your Leli Rentals subscription — versus what competitors take.
                                </p>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div className="bg-white/10 rounded-xl p-5 text-center">
                                        <p className="text-blue-200 text-sm mb-1">Leli Weekly Plan</p>
                                        <p className="text-3xl font-bold mb-1">$5/week</p>
                                        <p className="text-blue-200 text-sm">You keep</p>
                                        <p className="text-2xl font-bold text-green-300">{fmt(earnings.monthly - 20)}</p>
                                        <p className="text-blue-200 text-xs">(monthly after $20 cost)</p>
                                    </div>
                                    <div className="bg-white/20 rounded-xl p-5 text-center border-2 border-white/40">
                                        <p className="text-blue-200 text-sm mb-1">Leli Monthly Plan</p>
                                        <p className="text-3xl font-bold mb-1">$10/mo</p>
                                        <p className="text-blue-200 text-sm">You keep</p>
                                        <p className="text-2xl font-bold text-green-300">{fmt(earnings.monthly - 10)}</p>
                                        <p className="text-blue-200 text-xs">(monthly after $10 cost)</p>
                                        <div className="mt-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full inline-block">
                                            BEST VALUE — {earnings.monthlyROI.toLocaleString()}% ROI
                                        </div>
                                    </div>
                                    <div className="bg-red-500/20 rounded-xl p-5 text-center border border-red-400/30">
                                        <p className="text-red-200 text-sm mb-1">Competitors (avg 25%)</p>
                                        <p className="text-3xl font-bold mb-1">25% cut</p>
                                        <p className="text-red-200 text-sm">You keep</p>
                                        <p className="text-2xl font-bold text-red-300">{fmt(earnings.monthly * 0.75)}</p>
                                        <p className="text-red-200 text-xs">(they take {fmt(earnings.monthly * 0.25)})</p>
                                    </div>
                                </div>
                            </div>

                            {/* Share Section */}
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                                <ShareButton
                                    itemName={input}
                                    monthly={fmt(earnings.monthly)}
                                    currency={selectedCurrency}
                                    categoryName={category.name}
                                />
                            </div>

                            {/* CTA */}
                            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-10 text-center text-white">
                                <h2 className="text-3xl font-bold mb-3">
                                    Ready to Start Earning {fmt(earnings.monthly)}/month?
                                </h2>
                                <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                                    List your {itemDisplayName} on Leli Rentals in under 5 minutes. Zero commission — just a flat {selectedCurrency.code === "USD" ? "$10/month" : `$10/month (${fmt(10)})`} subscription.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href="/dashboard/listings/new"
                                        className="inline-flex items-center justify-center px-10 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors text-lg"
                                    >
                                        Start Earning My {fmt(earnings.monthly)} →
                                    </Link>
                                    <Link
                                        href="/pricing"
                                        className="inline-flex items-center justify-center px-10 py-4 bg-blue-500/40 hover:bg-blue-500/60 text-white font-semibold rounded-xl border border-white/30 transition-colors text-lg"
                                    >
                                        View Pricing
                                    </Link>
                                </div>
                                <p className="mt-4 text-blue-200 text-sm">
                                    No credit card required · Cancel anytime · Zero commission on all rentals
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* Pre-calculation state */
                        <div className="bg-slate-50 rounded-2xl p-10 text-center border-2 border-dashed border-slate-200">
                            <div className="text-5xl mb-4">💰</div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">
                                Enter your {category.name.toLowerCase()} above to see your earnings
                            </h2>
                            <p className="text-slate-500 mb-6">
                                Type any item name or select from the popular items to instantly calculate your rental income potential.
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                {category.popularItems.slice(0, 5).map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => handleCalculate(item)}
                                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
                                    >
                                        Try: {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── HOW IT WORKS ── */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">
                        How to Start Earning From Your {category.name} on Leli Rentals
                    </h2>
                    <div className="grid sm:grid-cols-3 gap-6">
                        {[
                            { step: "1", title: "Create Your Listing", desc: `Add photos of your ${category.name.toLowerCase()}, write a clear description, set your daily rate, and define your availability. Your listing goes live in minutes.` },
                            { step: "2", title: "Accept Bookings", desc: `Renters find your listing through Leli Rentals and send booking requests. Review their profile, accept the request, and coordinate handover directly.` },
                            { step: "3", title: "Get Paid", desc: `Payment is processed securely and released to your account after the rental begins. Withdraw to your bank account or mobile money wallet anytime.` },
                        ].map((item) => (
                            <div key={item.step} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl font-bold mb-4">
                                    {item.step}
                                </div>
                                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── FAQ ── */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">
                        Frequently Asked Questions — {category.name} Rental Income
                    </h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: `How much can I realistically earn renting my ${category.name.toLowerCase()} on Leli Rentals?`,
                                a: `Earnings vary by item, condition, and how often it gets booked. Based on our market data, ${category.name.toLowerCase()} owners on Leli Rentals typically earn between $200 and $2,000 per month. Use the calculator above to get a personalised estimate for your specific item.`,
                            },
                            {
                                q: "How much does Leli Rentals charge owners?",
                                a: "Leli Rentals charges a flat monthly subscription — $5/week for up to 10 listings or $10/month for unlimited listings. We take zero commission from your rental earnings. Every cent your item earns goes directly into your pocket.",
                            },
                            {
                                q: "How accurate is the rental income calculator?",
                                a: `The calculator uses real market rental rates for ${category.name.toLowerCase()} items based on current demand across our global marketplace. While individual results may vary depending on your location, item condition, and market conditions, the estimates provide a reliable baseline for your earning potential.`,
                            },
                            {
                                q: `How do I list my ${category.name.toLowerCase()} on Leli Rentals?`,
                                a: "Creating a listing takes under 5 minutes. Create a free account, click Add New Listing, upload clear photos, write a description, set your daily rate, and publish. Your listing is immediately visible to renters worldwide.",
                            },
                            {
                                q: "Is my item protected when I rent it out?",
                                a: "Leli Rentals verifies all renters before they can make bookings. You can review renter profiles and ratings before accepting any request. Our platform provides owner protection tools including damage reporting and a dedicated support team.",
                            },
                        ].map((faq, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6">
                                <h3 className="font-semibold text-slate-900 mb-3">{faq.q}</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── OUTLINKS ── */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                        Helpful Resources for {category.name} Owners
                    </h2>
                    <div className="grid sm:grid-cols-3 gap-4">
                        {category.outlinks.map((link) => (
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

                {/* ── EXPLORE MORE ── */}
                <section className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">
                        Calculate Earnings for Other Categories
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { name: "Vehicles", slug: "vehicles" },
                            { name: "Living Spaces", slug: "living-spaces" },
                            { name: "Photography", slug: "photography" },
                            { name: "Electronics", slug: "electronics" },
                            { name: "Fashion", slug: "fashion-accessories" },
                            { name: "Equipment & Tools", slug: "equipment-tools" },
                            { name: "Business Spaces", slug: "business-spaces" },
                            { name: "Entertainment", slug: "entertainment" },
                            { name: "Fitness & Sports", slug: "fitness-sports" },
                            { name: "Utility Spaces", slug: "utility-spaces" },
                            { name: "Baby & Kids", slug: "baby-kids" },
                        ]
                            .filter((c) => c.slug !== category.slug)
                            .map((c) => (
                                <Link
                                    key={c.slug}
                                    href={`/earn/${c.slug}`}
                                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
                                >
                                    {c.name} Calculator →
                                </Link>
                            ))}
                    </div>
                </section>

            </div>
        </div>
    )
}
