-- ============================================
-- ENFORCE 5-DAY VERIFICATION SUSPENSION
-- ============================================
-- This script adds a function to automatically suspend owners
-- who haven't verified their identity within 5 days of registration.

-- Function to check and update account statuses
CREATE OR REPLACE FUNCTION public.check_verification_deadlines()
RETURNS void AS $$
BEGIN
    -- Update user_profiles to 'suspended' if:
    -- 1. Role is 'owner'
    -- 2. Created at is more than 5 days ago
    -- 3. Account is currently 'active' or 'pending'
    -- 4. They don't have an 'approved' verification document
    UPDATE public.user_profiles up
    SET account_status = 'suspended',
        updated_at = NOW()
    WHERE up.role = 'owner'
      AND up.created_at < NOW() - INTERVAL '5 days'
      AND up.account_status IN ('active', 'pending')
      AND NOT EXISTS (
          SELECT 1 FROM public.verification_documents vd
          WHERE vd.user_id = up.id
            AND vd.status = 'approved'
      );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: In a production environment, you would schedule this function
-- using pg_cron or a periodic edge function/webhook.
-- Example for pg_cron (if enabled in Supabase):
-- SELECT cron.schedule('check-verifications-daily', '0 0 * * *', 'SELECT public.check_verification_deadlines()');

-- Manual run for existing users
SELECT public.check_verification_deadlines();
