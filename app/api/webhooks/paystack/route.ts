import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { getPaystackSecretKey } from '@/lib/actions/settings-actions'

// Create admin client for webhook operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
    try {
        const body = await req.text()
        const signature = req.headers.get('x-paystack-signature')
        const paystackSecretKey = await getPaystackSecretKey()

        if (!paystackSecretKey) {
            console.error('Paystack secret key not configured')
            return NextResponse.json({ error: 'Config error' }, { status: 500 })
        }

        // Verify webhook signature
        const hash = crypto
            .createHmac('sha512', paystackSecretKey)
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
                currency: data.currency || 'KES',
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
