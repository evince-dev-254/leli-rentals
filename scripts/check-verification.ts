
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkVerifications() {
    const email = '1kihiupaul@gmail.com'
    console.log(`Checking verifications for: ${email}`)

    const { data: users } = await supabase.auth.admin.listUsers()
    const user = users.users.find(u => u.email === email)

    if (!user) {
        console.error('User not found in Auth')
        return
    }

    console.log(`User ID: ${user.id}`)

    const { data: docs, error } = await supabase
        .from('verification_documents')
        .select('*')
        .eq('user_id', user.id)

    if (error) {
        console.error('Error fetching docs:', error)
    } else {
        console.log('Documents found:', docs)
    }
}

checkVerifications()
