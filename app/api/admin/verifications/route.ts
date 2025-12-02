import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { addCorsHeaders, createOptionsResponse } from '@/lib/admin-cors'
import { verifyAdminRequest } from '@/lib/admin-auth'

export async function OPTIONS(req: NextRequest) {
    return createOptionsResponse(req)
}

export async function GET(req: NextRequest) {
    try {
        const authResult = await verifyAdminRequest(req)
        if (!authResult.ok) {
            const errorResponse = NextResponse.json(
                { error: 'Forbidden: Admin access required' },
                { status: authResult.status || 403 }
            )
            return addCorsHeaders(errorResponse, req)
        }

        // Fetch all verification requests
        const { data: verifications, error } = await supabase
            .from('verifications')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching verifications:', error)
            return NextResponse.json({ verifications: [] })
        }

        // Get user details for each verification
        const verificationsWithUsers = await Promise.all(
            (verifications || []).map(async (verification) => {
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('name, email')
                    .eq('user_id', verification.user_id)
                    .single()

                return {
                    ...verification,
                    user_name: profile?.name || 'Unknown',
                    user_email: profile?.email || 'N/A',
                }
            })
        )

        const response = NextResponse.json({
            success: true,
            verifications: verificationsWithUsers,
            total: verifications?.length || 0
        })

        return addCorsHeaders(response, req)
    } catch (error: any) {
        console.error('Error fetching verifications:', error)
        const errorResponse = NextResponse.json(
            { error: 'Failed to fetch verifications', details: error.message },
            { status: 500 }
        )
        return addCorsHeaders(errorResponse, req)
    }
}
