import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: Supabase credentials missing.')
    process.exit(1)
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)

async function resetProject() {
    console.log('⚠ WARNING: This will DELETE ALL DATA from your project.')
    console.log('Starting reset...')

    // 1. Delete all verification documents
    const { error: docError } = await supabase
        .from('verification_documents')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    if (docError) console.error('Error deleting docs:', docError)
    else console.log('✓ Verification documents deleted')

    // 2. Delete all user profiles
    const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')

    if (profileError) console.error('Error deleting profiles:', profileError)
    else console.log('✓ User profiles deleted')

    // 3. List and Delete all Auth Users
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
        console.error('Error listing users:', listError)
        return
    }

    if (users && users.length > 0) {
        console.log(`Found ${users.length} auth users. Deleting...`)
        for (const user of users) {
            const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
            if (deleteError) console.error(`Failed to delete user ${user.id}:`, deleteError.message)
            else console.log(`Deleted user: ${user.email}`)
        }
    } else {
        console.log('No auth users to delete.')
    }

    console.log('✓ Project reset complete.')
}

resetProject()
