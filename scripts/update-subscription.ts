
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateSubscription() {
    const email = '1kihiupaul@gmail.com'
    console.log(`Updating subscription for: ${email}`)

    const { data: users } = await supabase.auth.admin.listUsers()
    const user = users.users.find(u => u.email === email)

    if (!user) {
        console.error('User not found')
        return
    }

    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 30)

    const subscriptionData = {
        user_id: user.id,
        plan_type: 'monthly',
        status: 'active',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        price: 1000,
        currency: 'KES'
    }

    // First delete any existing rows to be sure
    await supabase
        .from('subscriptions')
        .delete()
        .eq('user_id', user.id)

    const { error } = await supabase
        .from('subscriptions')
        .insert([subscriptionData])

    if (error) {
        console.error('Insert error:', error)
    } else {
        console.log('Success (re-inserted)')
    }

    await supabase
        .from('user_profiles')
        .update({ role: 'owner' })
        .eq('id', user.id)
}

updateSubscription()
