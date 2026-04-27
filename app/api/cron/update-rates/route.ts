import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

// Supported currencies for the earning calculator
const CURRENCIES = ["KES", "GBP", "EUR", "AED", "NGN", "ZAR", "AUD", "CAD"]

export async function GET(request: Request) {
  try {
    // Verify this is called by Vercel Cron or manually triggered
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    // Allow both cron secret and manual trigger in development
    if (
      process.env.NODE_ENV === "production" &&
      cronSecret &&
      authHeader !== `Bearer ${cronSecret}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch latest rates from ExchangeRate-API (free, no key needed)
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD",
      {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 0 }, // Always fetch fresh
      }
    )

    if (!response.ok) {
      throw new Error(`ExchangeRate API failed: ${response.status}`)
    }

    const data = await response.json()

    if (!data.rates) {
      throw new Error("Invalid response from ExchangeRate API")
    }

    // Extract only the currencies we need
    const updates = CURRENCIES.map((currency) => ({
      currency,
      rate: data.rates[currency] ?? null,
      updated_at: new Date().toISOString(),
    })).filter((r) => r.rate !== null)

    if (updates.length === 0) {
      throw new Error("No valid rates found in API response")
    }

    // Upsert into Supabase — updates existing rows or inserts new ones
    const { error } = await supabaseAdmin
      .from("exchange_rates")
      .upsert(updates, { onConflict: "currency" })

    if (error) {
      throw new Error(`Supabase upsert failed: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updates.length} exchange rates`,
      rates: Object.fromEntries(updates.map((r) => [r.currency, r.rate])),
      source: "api.exchangerate-api.com",
      updated_at: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("update-rates cron error:", error)

    // Return error but don't crash — Supabase still has previous rates as fallback
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        fallback: "Previous rates in Supabase remain active",
      },
      { status: 500 }
    )
  }
}