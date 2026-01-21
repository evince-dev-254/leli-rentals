import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Fetches a specific setting from the admin_settings table
 * Falls back to environment variables if setting is missing or empty
 */
export async function getAdminSetting(key: string, envFallback?: string): Promise<string> {
    try {
        const { data, error } = await supabaseAdmin
            .from('admin_settings')
            .select('value')
            .eq('key', key)
            .single()

        if (error || !data?.value) {
            return envFallback || ""
        }

        return data.value
    } catch (error) {
        console.error(`Error fetching admin setting ${key}:`, error)
        return envFallback || ""
    }
}

/**
 * Specialized helper to get Paystack Secret Key
 */
export async function getPaystackSecretKey(): Promise<string> {
    return getAdminSetting('paystack_secret_key', process.env.PAYSTACK_SECRET_KEY)
}

/**
 * Specialized helper to get Paystack Public Key
 */
export async function getPaystackPublicKey(): Promise<string> {
    return getAdminSetting('paystack_public_key', process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY)
}

/**
 * Specialized helper to get Affiliate Commission Rate
 */
export async function getAffiliateCommissionRate(): Promise<number> {
    const rateString = await getAdminSetting('affiliate_commission_rate', '10')
    return parseFloat(rateString) || 10
}
