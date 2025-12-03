import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
    try {
        const user = await currentUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const email = user.emailAddresses[0]?.emailAddress
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()
        const avatarUrl = user.imageUrl

        // Upsert user into Supabase
        const { error } = await supabase
            .from('user_profiles')
            .upsert({
                id: user.id,
                email: email,
                name: fullName || email?.split('@')[0] || 'User',
                avatar: avatarUrl,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'id',
                ignoreDuplicates: false,
            })

        if (error) {
            console.error('Supabase sync error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Sync API error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
