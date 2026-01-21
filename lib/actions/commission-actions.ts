'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

import { MINIMUM_WITHDRAWAL } from '../constants'
import { getAffiliateCommissionRate } from './settings-actions'

/**
 * Calculate commission for a booking
 */
export async function calculateCommission(bookingId: string) {
    try {
        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .select('*, user_profiles!bookings_renter_id_fkey(referred_by)')
            .eq('id', bookingId)
            .single()

        if (error || !booking) {
            throw new Error('Booking not found')
        }

        // Check if renter was referred by an affiliate
        const referredBy = booking.user_profiles?.referred_by
        if (!referredBy) {
            return { success: false, message: 'No referral found' }
        }

        // Calculate commission using dynamic rate from settings
        const currentRate = await getAffiliateCommissionRate()
        const commissionAmount = (booking.subtotal * currentRate) / 100

        // Create commission record
        const { data: commission, error: commissionError } = await supabaseAdmin
            .from('affiliate_commissions')
            .insert({
                affiliate_id: referredBy,
                booking_id: bookingId,
                referral_id: booking.renter_id,
                amount: commissionAmount,
                commission_rate: currentRate,
                status: 'paid', // Mark as paid immediately when booking is paid
                paid_at: new Date().toISOString()
            })
            .select()
            .single()

        return { success: true, commission }
    } catch (error: any) {
        console.error('Commission calculation error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Get available balance for withdrawal
 */
export async function getAvailableBalance(userId: string, userType: 'owner' | 'affiliate') {
    try {
        let totalEarnings = 0;

        if (userType === 'affiliate') {
            const { data: commissions, error: commError } = await supabaseAdmin
                .from('affiliate_commissions')
                .select('amount')
                .eq('affiliate_id', userId)
                .eq('status', 'paid');

            if (commError) throw commError;
            totalEarnings = (commissions || []).reduce((sum, c) => sum + Number(c.amount), 0);
        } else {
            const { data: payments, error: payError } = await supabaseAdmin
                .from('payments')
                .select('amount')
                .eq('payee_id', userId)
                .eq('status', 'success')
                .eq('payment_type', 'booking');

            if (payError) throw payError;
            totalEarnings = (payments || []).reduce((sum, p) => sum + Number(p.amount), 0);
        }

        const { data: withdrawals, error: withError } = await supabaseAdmin
            .from('withdrawals')
            .select('amount')
            .eq('user_id', userId)
            .in('status', ['pending', 'processing', 'completed']);

        if (withError) throw withError;
        const totalWithdrawn = (withdrawals || []).reduce((sum, w) => sum + Number(w.amount), 0);

        return { success: true, balance: Math.max(0, totalEarnings - totalWithdrawn) };
    } catch (error: any) {
        console.error('Get balance error:', error)
        return { success: false, balance: 0, error: error.message }
    }
}

/**
 * Request withdrawal
 */
export async function requestWithdrawal(
    userId: string,
    userType: 'owner' | 'affiliate',
    amount: number,
    paymentMethod: 'mpesa' | 'bank_transfer',
    paymentDetails: any
) {
    try {
        // Check minimum withdrawal amount
        if (amount < MINIMUM_WITHDRAWAL) {
            return {
                success: false,
                error: `Minimum withdrawal amount is KSh ${MINIMUM_WITHDRAWAL.toLocaleString()}`
            }
        }

        // Check available balance
        const { balance } = await getAvailableBalance(userId, userType)
        if (balance < amount) {
            return {
                success: false,
                error: `Insufficient balance. Available: KSh ${balance.toLocaleString()}`
            }
        }

        // Create withdrawal request
        const { data: withdrawal, error } = await supabaseAdmin
            .from('withdrawals')
            .insert({
                user_id: userId,
                user_type: userType,
                amount,
                payment_method: paymentMethod,
                payment_details: paymentDetails,
                status: 'pending'
            })
            .select()
            .single()

        if (error) throw error

        return { success: true, withdrawal }
    } catch (error: any) {
        console.error('Withdrawal request error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Get user's commission history
 */
export async function getCommissionHistory(affiliateId: string) {
    try {
        const { data, error } = await supabaseAdmin
            .from('affiliate_commissions')
            .select(`
                *,
                bookings(id, listing_title, subtotal, created_at),
                user_profiles!affiliate_commissions_referral_id_fkey(full_name, email)
            `)
            .eq('affiliate_id', affiliateId)
            .order('created_at', { ascending: false })

        if (error) throw error

        return { success: true, commissions: data || [] }
    } catch (error: any) {
        console.error('Get commission history error:', error)
        return { success: false, commissions: [], error: error.message }
    }
}

/**
 * Get user's withdrawal history
 */
export async function getWithdrawalHistory(userId: string) {
    try {
        const { data, error } = await supabaseAdmin
            .from('withdrawals')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw error

        return { success: true, withdrawals: data || [] }
    } catch (error: any) {
        console.error('Get withdrawal history error:', error)
        return { success: false, withdrawals: [], error: error.message }
    }
}

/**
 * Admin: Approve withdrawal
 */
export async function approveWithdrawal(withdrawalId: string, adminId: string, transactionRef: string) {
    try {
        const { data, error } = await supabaseAdmin
            .from('withdrawals')
            .update({
                status: 'completed',
                processed_by: adminId,
                processed_at: new Date().toISOString(),
                transaction_reference: transactionRef
            })
            .eq('id', withdrawalId)
            .select()
            .single()

        if (error) throw error

        return { success: true, withdrawal: data }
    } catch (error: any) {
        console.error('Approve withdrawal error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Admin: Reject withdrawal
 */
export async function rejectWithdrawal(withdrawalId: string, adminId: string, reason: string) {
    try {
        const { data, error } = await supabaseAdmin
            .from('withdrawals')
            .update({
                status: 'cancelled',
                processed_by: adminId,
                processed_at: new Date().toISOString(),
                admin_notes: reason
            })
            .eq('id', withdrawalId)
            .select()
            .single()

        if (error) throw error

        return { success: true, withdrawal: data }
    } catch (error: any) {
        console.error('Reject withdrawal error:', error)
        return { success: false, error: error.message }
    }
}

