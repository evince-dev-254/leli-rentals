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
import NewMessageEmail from "@/components/emails/new-message-email"
import SubscriptionConfirmationEmail from "@/components/emails/newsletter-confirmation-email"
import ContactFormEmail from "@/components/emails/contact-submission-email"

export async function sendWelcomeEmail(email: string, firstName: string) {
    try {
        const data = await resend.emails.send({
            from: "leli rentals <onboarding@leli.rentals>", // Use verified domain
            to: email,
            subject: "Welcome to leli rentals!",
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
            from: "leli rentals <payments@leli.rentals>",
            to: email,
            subject: "Payment Receipt - leli rentals",
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
            from: "leli rentals <hello@leli.rentals>",
            to: email,
            subject: "We miss you at leli rentals!",
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
            from: "leli rentals <deals@leli.rentals>",
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
            from: "leli rentals <onboarding@leli.rentals>",
            to: email,
            subject: "Confirm your leli rentals account",
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
            from: "leli rentals <onboarding@leli.rentals>",
            to: email,
            subject: "You are invited to join leli rentals",
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
            from: "leli rentals <onboarding@leli.rentals>",
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
            from: "leli rentals <onboarding@leli.rentals>",
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
            from: "leli rentals <onboarding@leli.rentals>",
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
            from: "leli rentals <onboarding@leli.rentals>",
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
            from: "leli rentals <notifications@leli.rentals>",
            to: email,
            subject: "Listing Created Successfully - leli rentals",
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
            from: "leli rentals <bookings@leli.rentals>",
            to: email,
            subject: `Booking Confirmed: ${listingTitle} - leli rentals`,
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

export async function sendNewMessageEmail(
    email: string,
    receiverName: string,
    senderName: string,
    messageContent: string,
    listingTitle?: string
) {
    try {
        const data = await resend.emails.send({
            from: "leli rentals <messages@leli.rentals>",
            to: email,
            subject: `New message from ${senderName}`,
            react: NewMessageEmail({
                receiverName,
                senderName,
                messageContent,
                listingTitle
            }),
        })
        return { success: true, data }
    } catch (error) {
        console.error("Failed to send message email:", error)
        return { success: false, error }
    }
}

/** Send newsletter subscription confirmation email */
export async function sendNewsletterConfirmationEmail(email: string) {
    try {
        const data = await resend.emails.send({
            from: "leli rentals <updates@leli.rentals>",
            to: email,
            subject: "You're subscribed to leli rentals newsletter!",
            react: SubscriptionConfirmationEmail(),
        })
        return { success: true, data }
    } catch (error) {
        console.error("Failed to send newsletter email:", error)
        return { success: false, error }
    }
}

/** Send contact form submission to admin */
export async function sendContactFormEmail(formData: {
    name: string,
    email: string,
    subject: string,
    message: string
}) {
    try {
        const data = await resend.emails.send({
            from: "leli rentals <support@leli.rentals>",
            to: "lelirentalsmail@gmail.com",
            replyTo: formData.email,
            subject: `Contact Form: ${formData.subject}`,
            react: ContactFormEmail({
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message
            }),
        })
        return { success: true, data }
    } catch (error) {
        console.error("Failed to send contact form email:", error)
        return { success: false, error }
    }
}

