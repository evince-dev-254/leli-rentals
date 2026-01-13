import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
    try {
        const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

        if (!paystackSecretKey) {
            return NextResponse.json({ error: 'Paystack secret key not configured' }, { status: 500 })
        }

        // Fetch recent transactions from Paystack
        const response = await fetch('https://api.paystack.co/transaction?perPage=100', {
            headers: {
                'Authorization': `Bearer ${paystackSecretKey}`,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error('Failed to fetch transactions from Paystack')
        }

        const { data: transactions } = await response.json()

        let syncedCount = 0
        let skippedCount = 0

        // Process each transaction
        for (const transaction of transactions) {
            if (transaction.status !== 'success') continue

            // Check if payment already exists
            const { data: existing } = await supabaseAdmin
                .from('payments')
                .select('id')
                .eq('reference', transaction.reference)
                .single()

            if (existing) {
                skippedCount++
                continue
            }

            // Find user by email
            const { data: profile } = await supabaseAdmin
                .from('user_profiles')
                .select('id')
                .eq('email', transaction.customer.email)
                .single()

            // Create payment record
            const { error } = await supabaseAdmin
                .from('payments')
                .insert({
                    reference: transaction.reference,
                    user_id: profile?.id || null,
                    booking_id: transaction.metadata?.booking_id || null,
                    subscription_id: transaction.metadata?.subscription_id || null,
                    amount: transaction.amount / 100,
                    currency: transaction.currency || 'KES',
                    status: 'success',
                    payment_method: transaction.channel,
                    customer_email: transaction.customer.email,
                    customer_name: transaction.customer.first_name && transaction.customer.last_name
                        ? `${transaction.customer.first_name} ${transaction.customer.last_name}`
                        : null,
                    metadata: transaction.metadata || {},
                    paid_at: transaction.paid_at || transaction.transaction_date,
                    created_at: transaction.created_at || new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })

            if (!error) {
                syncedCount++

                // Send email notification
                try {
                    const { Resend } = await import('resend')
                    const resend = new Resend(process.env.RESEND_API_KEY)

                    await resend.emails.send({
                        from: 'Leli Rentals <noreply@leli.rentals>',
                        to: transaction.customer.email,
                        subject: 'Payment Confirmation - Leli Rentals',
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <h2 style="color: #10b981;">Payment Successful!</h2>
                                <p>Dear ${transaction.customer.first_name || 'Customer'},</p>
                                <p>Your payment has been successfully processed.</p>
                                
                                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                    <h3 style="margin-top: 0;">Payment Details</h3>
                                    <p><strong>Amount:</strong> ${transaction.currency} ${(transaction.amount / 100).toLocaleString()}</p>
                                    <p><strong>Reference:</strong> ${transaction.reference}</p>
                                    <p><strong>Payment Method:</strong> ${transaction.channel}</p>
                                    <p><strong>Date:</strong> ${new Date(transaction.paid_at || transaction.transaction_date).toLocaleString()}</p>
                                </div>
                                
                                <p>Thank you for your payment!</p>
                                
                                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                                <p style="color: #6b7280; font-size: 12px;">
                                    This is an automated email from Leli Rentals.
                                </p>
                            </div>
                        `
                    })
                } catch (emailError) {
                    console.error('Failed to send email:', emailError)
                }
            }
        }

        return NextResponse.json({
            success: true,
            synced: syncedCount,
            skipped: skippedCount,
            total: transactions.length
        })

    } catch (error: any) {
        console.error('Payment sync error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
