import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

// Create admin client for webhook operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
    try {
        const body = await req.text()
        const signature = req.headers.get('x-paystack-signature')

        // Verify webhook signature
        const hash = crypto
            .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
            .update(body)
            .digest('hex')

        if (hash !== signature) {
            console.error('Invalid webhook signature')
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
        }

        const event = JSON.parse(body)
        console.log('Paystack webhook event:', event.event)

        // Handle different event types
        switch (event.event) {
            case 'charge.success':
                await handleSuccessfulPayment(event.data)
                break

            case 'subscription.create':
                await handleSubscriptionCreated(event.data)
                break

            case 'subscription.disable':
                await handleSubscriptionCancelled(event.data)
                break

            case 'subscription.not_renew':
                await handleSubscriptionNotRenewed(event.data)
                break

            case 'invoice.create':
            case 'invoice.update':
                await handleInvoiceEvent(event.data)
                break

            default:
                console.log('Unhandled event type:', event.event)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('Webhook error:', error)
        return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
    }
}

async function handleSuccessfulPayment(data: any) {
    const { reference, metadata, amount, customer, channel, paid_at } = data

    console.log('Processing successful payment:', reference)

    try {
        // Find user by email
        const { data: profile } = await supabaseAdmin
            .from('user_profiles')
            .select('id')
            .eq('email', customer.email)
            .single()

        // Create payment record
        const { error: paymentError } = await supabaseAdmin
            .from('payments')
            .upsert({
                reference,
                user_id: profile?.id || null,
                booking_id: metadata?.booking_id || null,
                subscription_id: metadata?.subscription_id || null,
                amount: amount / 100, // Convert from kobo to naira
                currency: data.currency || 'NGN',
                status: 'success',
                payment_method: channel,
                customer_email: customer.email,
                customer_name: customer.first_name && customer.last_name
                    ? `${customer.first_name} ${customer.last_name}`
                    : null,
                metadata: metadata || {},
                paid_at: paid_at || new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'reference'
            })

        if (paymentError) {
            console.error('Failed to create payment record:', paymentError)
        } else {
            console.log('Payment record created:', reference)

            // Send payment confirmation email
            try {
                const { Resend } = await import('resend')
                const resend = new Resend(process.env.RESEND_API_KEY)

                await resend.emails.send({
                    from: 'Leli Rentals <noreply@leli.rentals>',
                    to: customer.email,
                    subject: 'Payment Confirmation - Leli Rentals',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #10b981;">Payment Successful!</h2>
                            <p>Dear ${customer.first_name || 'Customer'},</p>
                            <p>Your payment has been successfully processed.</p>
                            
                            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <h3 style="margin-top: 0;">Payment Details</h3>
                                <p><strong>Amount:</strong> ${data.currency} ${(amount / 100).toLocaleString()}</p>
                                <p><strong>Reference:</strong> ${reference}</p>
                                <p><strong>Payment Method:</strong> ${channel}</p>
                                <p><strong>Date:</strong> ${new Date(paid_at || new Date()).toLocaleString()}</p>
                            </div>
                            
                            <p>Thank you for your payment!</p>
                            <p>If you have any questions, please contact our support team.</p>
                            
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                            <p style="color: #6b7280; font-size: 12px;">
                                This is an automated email from Leli Rentals. Please do not reply to this email.
                            </p>
                        </div>
                    `
                })

                console.log('Payment confirmation email sent to:', customer.email)
            } catch (emailError) {
                console.error('Failed to send payment confirmation email:', emailError)
                // Don't fail the webhook if email fails
            }
        }

        // Check if this is a booking payment
        if (metadata?.booking_id) {
            const { error } = await supabaseAdmin
                .from('bookings')
                .update({
                    payment_status: 'paid',
                    payment_reference: reference,
                    payment_amount: amount / 100,
                    updated_at: new Date().toISOString()
                })
                .eq('id', metadata.booking_id)

            if (error) {
                console.error('Failed to update booking:', error)
            } else {
                console.log('Booking payment confirmed:', metadata.booking_id)

                // Calculate and create affiliate commission if applicable
                try {
                    const { calculateCommission } = await import('@/lib/actions/commission-actions')
                    const commissionResult = await calculateCommission(metadata.booking_id)

                    if (commissionResult.success) {
                        console.log('Commission created:', commissionResult.commission)
                    } else {
                        console.log('No commission:', commissionResult.message)
                    }
                } catch (commissionError) {
                    console.error('Commission calculation error:', commissionError)
                    // Don't fail the webhook if commission fails
                }
            }
        }

        // Check if this is a subscription payment
        if (metadata?.subscription_plan) {
            await handleSubscriptionPayment(data)
        }
    } catch (error) {
        console.error('Error handling successful payment:', error)
    }
}

async function handleSubscriptionCreated(data: any) {
    const { subscription_code, customer, plan, authorization } = data

    console.log('Processing subscription creation:', subscription_code)

    try {
        // Find user by email
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('user_profiles')
            .select('id')
            .eq('email', customer.email)
            .single()

        if (profileError || !profile) {
            console.error('User not found for subscription:', customer.email)
            return
        }

        // Create or update subscription record
        const { error } = await supabaseAdmin
            .from('subscriptions')
            .upsert({
                user_id: profile.id,
                subscription_code,
                plan_code: plan.plan_code,
                plan_name: plan.name,
                amount: plan.amount / 100,
                status: 'active',
                next_payment_date: data.next_payment_date,
                authorization_code: authorization?.authorization_code,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'subscription_code'
            })

        if (error) {
            console.error('Failed to create subscription:', error)
        } else {
            console.log('Subscription created successfully:', subscription_code)
        }
    } catch (error) {
        console.error('Error handling subscription creation:', error)
    }
}

async function handleSubscriptionCancelled(data: any) {
    const { subscription_code } = data

    console.log('Processing subscription cancellation:', subscription_code)

    try {
        const { error } = await supabaseAdmin
            .from('subscriptions')
            .update({
                status: 'cancelled',
                cancelled_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('subscription_code', subscription_code)

        if (error) {
            console.error('Failed to cancel subscription:', error)
        } else {
            console.log('Subscription cancelled:', subscription_code)
        }
    } catch (error) {
        console.error('Error handling subscription cancellation:', error)
    }
}

async function handleSubscriptionNotRenewed(data: any) {
    const { subscription_code } = data

    console.log('Processing subscription non-renewal:', subscription_code)

    try {
        const { error } = await supabaseAdmin
            .from('subscriptions')
            .update({
                status: 'expired',
                updated_at: new Date().toISOString()
            })
            .eq('subscription_code', subscription_code)

        if (error) {
            console.error('Failed to mark subscription as expired:', error)
        }
    } catch (error) {
        console.error('Error handling subscription non-renewal:', error)
    }
}

async function handleSubscriptionPayment(data: any) {
    // Handle recurring subscription payments
    console.log('Processing subscription payment')
}

async function handleInvoiceEvent(data: any) {
    // Handle invoice creation/updates
    console.log('Processing invoice event')
}
