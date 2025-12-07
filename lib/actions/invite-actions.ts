import { supabase } from '@/lib/supabase';
import { sendInviteEmail } from '@/lib/actions/email-actions';

/**
 * Create a pending affiliate invite and send the invitation email.
 * Returns the generated invite code.
 */
export async function createAffiliateInvite(email: string, inviterName: string) {
    // Generate a unique invite code – using crypto.randomUUID (available in Node >=14)
    const inviteCode = crypto.randomUUID();

    // Insert a pending affiliate record (adjust table/columns to match your schema)
    const { error: insertErr } = await supabase.from('affiliates').insert({
        email,
        invite_code: inviteCode,
        status: 'pending',
    });
    if (insertErr) throw insertErr;

    // Send the invitation email using the existing server action
    const { success, error } = await sendInviteEmail(email, inviterName, inviteCode);
    if (!success) throw error;

    return { inviteCode };
}
