import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const cookieStore = await cookies()

        // 1. Standard Client to verify session
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll() },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                        } catch { }
                    }
                },
            }
        )

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            console.error("[API] Verifications: Unauthorized", authError)
            return NextResponse.json({ error: 'Unauthorized', details: authError }, { status: 401 })
        }

        // 2. Admin Client to fetch data (Bypassing RLS)
        const adminSupabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                cookies: {
                    getAll() { return [] },
                    setAll() { }
                }
            }
        )

        const { data, error } = await adminSupabase
            .from('verification_documents')
            .select('*')
            .eq('user_id', user.id)

        if (error) {
            console.error("[API] Verifications: DB Error", error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        console.log(`[API] Verifications: Found ${data.length} docs for user ${user.id}`)
        return NextResponse.json(data)

    } catch (err: any) {
        console.error("[API] Verifications: Unexpected Error", err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
