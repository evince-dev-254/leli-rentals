import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Email configuration - Updated to use Gmail
const FROM_EMAIL = 'Leli Rentals <lelirentalsmail@gmail.com>'
const SUPPORT_EMAIL = 'lelirentalsmail@gmail.com'

export interface EmailOptions {
    to: string
    subject: string
    html: string
    replyTo?: string
}

// Export the configuration for use in other modules
export { FROM_EMAIL, SUPPORT_EMAIL }

export const emailService = {
    sendWelcomeEmail: async (userEmail: string, userName: string) => {
        console.log('📧 Sending welcome email to:', userEmail)
        return { success: true, message: 'Email functionality will be implemented' }
    }
}
