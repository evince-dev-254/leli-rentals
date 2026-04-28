"use client"

import { useState } from "react"
import Link from "next/link"

export function PromoButton({ label = "Claim My Free Month →", className }: { label?: string; className?: string }) {
    const [showPromo, setShowPromo] = useState(false)

    return (
        <>
            {showPromo && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
                        <button
                            onClick={() => setShowPromo(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl font-light"
                        >
                            ×
                        </button>
                        <div className="text-center mb-6">
                            <div className="text-4xl mb-3">🎉</div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Redeem Your Free Month</h2>
                            <p className="text-slate-500 text-sm">
                                Use code <span className="font-bold text-blue-600">FREEMONTH</span> to
                                get your first month of unlimited listings for $0
                            </p>
                        </div>
                        <div className="space-y-4 mb-8">
                            {[
                                "Create your free account at leli.rentals/signup",
                                "Choose the Monthly Plan ($10/month) at checkout",
                                "Email support@gurucrafts.agency with subject line: FREEMONTH",
                                "Include your account email — we will activate your free first month within 24 hours",
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
                                onClick={() => setShowPromo(false)}
                                className="w-full py-3 bg-blue-600 text-white text-center font-bold rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                Create My Free Account →
                            </Link>
                            <a
                                href="mailto:support@gurucrafts.agency?subject=FREEMONTH"
                                onClick={() => setShowPromo(false)}
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
            )}
            <button
                onClick={() => setShowPromo(true)}
                className={className || "inline-flex items-center justify-center px-10 py-4 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold rounded-xl transition-colors text-lg"}
            >
                {label}
            </button>
        </>
    )
}