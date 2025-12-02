import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Verify admin role
        const user = await clerkClient.users.getUser(userId)
        const role = (user.publicMetadata?.role as string) || (user.unsafeMetadata as any)?.role

        if (role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await req.json()
        const { verificationId } = body

        if (!verificationId) {
            return NextResponse.json({ error: 'Verification ID required' }, { status: 400 })
        }

        // Update verification status in Supabase
        const { error: updateError } = await supabase
            .from('user_verifications')
            .update({
                status: 'approved',
                reviewed_at: new Date().toISOString(),
                reviewed_by: userId
            })
            .eq('id', verificationId)

        if (updateError) {
            throw updateError
        }

        // Get the verification to update user metadata
        const { data: verification } = await supabase
            .from('user_verifications')
            .select('user_id')
            .eq('id', verificationId)
            .single()

        if (verification) {
            // Update Clerk user metadata
            await clerkClient.users.updateUserMetadata(verification.user_id, {
                publicMetadata: {
                    verificationStatus: 'approved',
                    verifiedAt: new Date().toISOString()
                }
            })
        }

        return NextResponse.json({ success: true, message: 'Verification approved' })
    } catch (error: any) {
        console.error('Error approving verification:', error)
        return NextResponse.json(
            { error: 'Failed to approve verification', details: error.message },
            { status: 500 }
        )
    }
}
