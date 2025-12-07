"use server"

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { sendBookingConfirmationEmail } from "@/lib/actions/email-actions"

interface BookingData {
    listing_id: string
    renter_id: string
    owner_id: string
    start_date: string
    end_date: string
    total_days: number
    price_per_day: number
    subtotal: number
    service_fee: number
    total_amount: number
    payment_status: "pending" | "paid"
    status: "pending" | "confirmed"
}

export async function createBooking(bookingData: BookingData, userEmail: string, userName: string, listingTitle: string) {
    console.log("Creating booking:", bookingData)

    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    )

    try {
        const { data, error } = await supabase
            .from("bookings")
            .insert(bookingData)
            .select()
            .single()

        if (error) {
            console.error("Error creating booking:", error)
            throw error
        }

        console.log("Booking created:", data.id)

        // If booking is confirmed/paid, send confirmation email
        if (bookingData.status === "confirmed" || bookingData.payment_status === "paid") {
            try {
                await sendBookingConfirmationEmail(
                    userEmail,
                    userName.split(" ")[0], // First name
                    listingTitle,
                    new Date(bookingData.start_date).toLocaleDateString(),
                    new Date(bookingData.end_date).toLocaleDateString(),
                    bookingData.total_amount,
                    data.id
                )
            } catch (emailErr) {
                console.error("Failed to send booking email:", emailErr)
            }
        }

        return { success: true, booking: data }
    } catch (err: any) {
        return { success: false, error: err.message }
    }
}
