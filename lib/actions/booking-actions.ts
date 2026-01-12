"use server"

import { createClient } from '@/lib/supabase-server'
import { sendBookingConfirmationEmail } from "@/lib/actions/email-actions"
import { createNotification } from "./dashboard-actions"

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
    console.log("[SERVER ACTION] createBooking started:", { ...bookingData, userEmail, userName });

    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            console.error("[SERVER ACTION] Auth error or user not found:", authError);
            return { success: false, error: "Authentication failed. Please sign in again." };
        }

        console.log("[SERVER ACTION] Authenticated user ID:", user.id);
        console.log("[SERVER ACTION] Booking renter ID:", bookingData.renter_id);

        if (user.id !== bookingData.renter_id) {
            console.error("[SERVER ACTION] User ID mismatch:", { userId: user.id, renterId: bookingData.renter_id });
            return { success: false, error: "Unauthorized booking attempt. User ID mismatch." };
        }

        const { data, error } = await supabase
            .from("bookings")
            .insert(bookingData)
            .select()
            .single()

        if (error) {
            console.error("[SERVER ACTION] Supabase error creating booking:", error);
            // Check for specific RLS error
            if (error.code === '42501' || error.message.includes('row-level security')) {
                return {
                    success: false,
                    error: "Security Policy Violation: You don't have permission to book this listing. This usually happens if there's a problem with your account setup."
                };
            }
            return { success: false, error: `Database error: ${error.message}` };
        }

        console.log("Booking created:", data.id)

        // If booking is confirmed/paid, send confirmation email and notification
        if (bookingData.status === "confirmed" || bookingData.payment_status === "paid") {
            try {
                await createNotification(bookingData.renter_id, {
                    title: "Booking Confirmed! 🎉",
                    message: `You've successfully booked ${listingTitle}. We've sent the details to your email.`,
                    type: "booking",
                    action_url: "/dashboard/renter?tab=bookings"
                })

                await sendBookingConfirmationEmail(
                    userEmail,
                    userName.split(" ")[0], // First name
                    listingTitle,
                    new Date(bookingData.start_date).toLocaleDateString(),
                    new Date(bookingData.end_date).toLocaleDateString(),
                    bookingData.total_amount,
                    data.id
                )
            } catch (err) {
                console.error("Failed to trigger booking notifications:", err)
            }
        }

        return { success: true, booking: data }
    } catch (err: any) {
        console.error("[SERVER ACTION] Unexpected error in createBooking:", err);
        return { success: false, error: "An unexpected error occurred. Please try again later." }
    }
}

export async function getLastCompletedBookingId(listingId: string, userId: string) {
    if (!userId || !listingId) return null;

    try {
        const supabase = await createClient()

        // Find a confirmed or paid booking for this user and listing
        // Ideally should be completed (end_date < now), but for UX letting them review 
        // if they have a valid booking record is a good start. 
        // You can add .lt('end_date', new Date().toISOString()) to strictly enforce past bookings.

        const { data, error } = await supabase
            .from('bookings')
            .select('id')
            .eq('listing_id', listingId)
            .eq('renter_id', userId)
            .or('status.eq.confirmed,status.eq.completed')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (error || !data) {
            return null
        }

        return data.id
    } catch (error) {
        console.error("Error fetching booking for review:", error)
        return null
    }
}
