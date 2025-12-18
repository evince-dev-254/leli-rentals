import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function ensureTestUser() {
    const email = 'reviewer-test@leli.rentals'
    const password = 'LeliReviewer2025!'

    console.log(`Checking for user: ${email}...`)

    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
        console.error('Error listing users:', listError)
        process.exit(1)
    }

    const existingUser = users.find(u => u.email === email)

    if (existingUser) {
        console.log('User exists. Updating password to ensure it matches...')
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { password: password }
        )
        if (updateError) {
            console.error('Error updating password:', updateError)
        } else {
            console.log('Password updated successfully.')
        }
    } else {
        console.log('User does not exist. Creating...')
        const { error: createError } = await supabase.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true
        })
        if (createError) {
            console.error('Error creating user:', createError)
        } else {
            console.log('User created successfully.')
        }
    }
}

ensureTestUser()
