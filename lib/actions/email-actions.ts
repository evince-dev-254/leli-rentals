"use server"

import { resend } from "@/lib/resend"
import WelcomeEmail from "@/components/emails/welcome-email"
import PaymentSuccessEmail from "@/components/emails/payment-email"
import MissYouEmail from "@/components/emails/miss-you-email"
import FestivePromoEmail from "@/components/emails/promo-email"
import ConfirmSignUpEmail from "@/components/emails/confirm-signup-email"
import InviteEmail from "@/components/emails/invite-email"
import MagicLinkEmail from "@/components/emails/magic-link-email"
import ChangeEmailVerification from "@/components/emails/change-email-email"
import ResetPasswordEmail from "@/components/emails/reset-password-email"
import ReauthEmail from "@/components/emails/reauth-email"
import NewListingEmail from "@/components/emails/new-listing-email"
import BookingConfirmationEmail from "@/components/emails/booking-confirmation-email"

export async function sendWelcomeEmail(email: string, firstName: string) {
    try {
        const data = await resend.emails.send({
            from: "Leli Rentals <onboarding@leli.rentals>", // Use verified domain
            to: email,
            subject: "Welcome to Leli Rentals!",
            react: WelcomeEmail({ userFirstname: firstName }),
        })
        return { success: true, data }
    } catch (error) {
        return { success: false, error }
    }
}

export async function sendPaymentSuccessEmail(
    email: string,
    firstName: string,
    amount: number,
    itemName: string,
    transactionId: string,
) {
    try {
        const data = await resend.emails.send({
            from: "Leli Rentals <payments@leli.rentals>",
            to: email,
            subject: "Payment Receipt - Leli Rentals",
            react: PaymentSuccessEmail({
                userFirstname: firstName,
                amount,
                itemName,
                transactionId,
                date: new Date().toLocaleDateString(),
            }),
        })
        return { success: true, data }
    } catch (error) {
        return { success: false, error }
    }
}

export async function sendMissYouEmail(email: string, firstName: string) {
    try {
        const data = await resend.emails.send({
            from: "Leli Rentals <hello@leli.rentals>",
            to: email,
            subject: "We miss you at Leli Rentals!",
            react: MissYouEmail({ userFirstname: firstName }),
        })
        return { success: true, data }
    } catch (error) {
        return { success: false, error }
    }
}

export async function sendPromoEmail(email: string, firstName: string) {
    try {
        const data = await resend.emails.send({
            from: "Leli Rentals <deals@leli.rentals>",
            to: email,
            subject: "Mega Sale: Up to 30% OFF!",
            react: FestivePromoEmail({ userFirstname: firstName }),
        })
        return { success: true, data }
    } catch (error) {
        return { success: false, error }
    }
}

// ---------- New authentication email actions ----------

export async function sendConfirmSignUpEmail(email: string, firstName: string, token: string) {
    try {
        const data = await resend.emails.send({
            from: "Leli Rentals <onboarding@leli.rentals>",
            to: email,
            subject: "Confirm your Leli Rentals account",
            react: ConfirmSignUpEmail({ userFirstname: firstName, confirmLink: `${process.env.NEXT_PUBLIC_APP_URL}/confirm?token=${token}` }),
        })
        return { success: true, data }
    } catch (error) {
        return { success: false, error }
    }
}

export async function sendInviteEmail(email: string, inviterName: string, inviteCode: string) {
    try {
        const data = await resend.emails.send({
            from: "Leli Rentals <onboarding@leli.rentals>",
            to: email,
            subject: "You are invited to join Leli Rentals",
            react: InviteEmail({ inviterName, inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${inviteCode}` }),
        })
        return { success: true, data }
    } catch (error) {
        return { success: false, error }
    }
}

export async function sendMagicLinkEmail(email: string, firstName: string, token: string) {
    try {
        const data = await resend.emails.send({
            from: "Leli Rentals <onboarding@leli.rentals>",
            to: email,
            subject: "Your magic sign‑in link",
            react: MagicLinkEmail({ userFirstname: firstName, magicLink: `${process.env.NEXT_PUBLIC_APP_URL}/magic-link?token=${token}` }),
        })
        return { success: true, data }
    } catch (error) {
        return { success: false, error }
    }
}

export async function sendChangeEmailVerification(email: string, firstName: string, token: string) {
    try {
        const data = await resend.emails.send({
            from: "Leli Rentals <onboarding@leli.rentals>",
            to: email,
            subject: "Verify your new email address",
            react: ChangeEmailVerification({ userFirstname: firstName, verifyLink: `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}` }),
        })
        return { success: true, data }
    } catch (error) {
        return { success: false, error }
    }
}

export async function sendResetPasswordEmail(email: string, firstName: string, token: string) {
    try {
        const data = await resend.emails.send({
            from: "Leli Rentals <onboarding@leli.rentals>",
            to: email,
            subject: "Reset your password",
            react: ResetPasswordEmail({ userFirstname: firstName, resetLink: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}` }),
        })
        return { success: true, data }
    } catch (error) {
        return { success: false, error }
    }
}

export async function sendReauthEmail(email: string, firstName: string, token: string) {
    try {
        const data = await resend.emails.send({
            from: "Leli Rentals <onboarding@leli.rentals>",
            to: email,
            subject: "Re‑authenticate your account",
            react: ReauthEmail({ userFirstname: firstName, reauthLink: `${process.env.NEXT_PUBLIC_APP_URL}/reauth?token=${token}` }),
        })
        return { success: true, data }
    } catch (error) {
        return { success: false, error }
    }
}

export async function sendNewListingEmail(email: string, firstName: string, listingTitle: string, listingId: string) {
    try {
        const data = await resend.emails.send({
            from: "Leli Rentals <notifications@leli.rentals>",
            to: email,
            subject: "Listing Created Successfully - Leli Rentals",
            react: NewListingEmail({
                userFirstname: firstName,
                listingTitle,
                listingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/listings/${listingId}`
            }),
        })
        return { success: true, data }
    } catch (error) {
        return { success: false, error }
    }
}

export async function sendBookingConfirmationEmail(
    email: string,
    firstName: string,
    listingTitle: string,
    startDate: string,
    endDate: string,
    totalAmount: number,
    bookingId: string
) {
    try {
        const data = await resend.emails.send({
            from: "Leli Rentals <bookings@leli.rentals>",
            to: email,
            subject: `Booking Confirmed: ${listingTitle} - Leli Rentals`,
            react: BookingConfirmationEmail({
                userFirstname: firstName,
                listingTitle,
                startDate,
                endDate,
                totalAmount,
                bookingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings/${bookingId}`
            }),
        })
        return { success: true, data }
    } catch (error) {
        return { success: false, error }
    }
}

