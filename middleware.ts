import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
    // Check if the request is for a webhook
    if (request.nextUrl.pathname.startsWith('/api/webhooks')) {
        return NextResponse.next();
    }

    let response = await updateSession(request);

    // Create a Supabase client to check user status
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Enforce 5-day verification suspension for Owners
    if (user) {
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('role, account_status, created_at')
            .eq('id', user.id)
            .single()

        if (profile && profile.role === 'owner' && profile.account_status !== 'suspended') {
            const fiveDaysAgo = new Date()
            fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5)
            const createdAt = new Date(profile.created_at)

            if (createdAt < fiveDaysAgo) {
                const { data: docs } = await supabase
                    .from('verification_documents')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('status', 'approved')
                    .limit(1)

                if (!docs || docs.length === 0) {
                    await supabase
                        .from('user_profiles')
                        .update({ account_status: 'suspended', updated_at: new Date().toISOString() })
                        .eq('id', user.id)
                }
            }
        }
    }

    // Handle Affiliate Referral Tracking
    const url = request.nextUrl
    const refCode = url.searchParams.get('ref')

    if (refCode) {
        response.cookies.set({
            name: 'affiliate_ref',
            value: refCode,
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            httpOnly: true,
            sameSite: 'lax'
        })
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
         * - api/webhooks (handle separately or exempt)
         */
        "/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
