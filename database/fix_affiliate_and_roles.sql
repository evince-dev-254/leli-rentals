-- ==========================================================
-- FIX: Affiliate Logic, Referrals, and User Role Assignment
-- ==========================================================

-- 1. FIX: Signup Trigger to correctly assign roles options
-- Consolidating logic to ensure role is respected from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile, ignoring if already exists
  INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    role,
    phone,
    date_of_birth
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Unknown User'),
    -- PRIORITIZE metadata role, default to 'renter' only if missing
    -- Ensure we strip quotes just in case, though ->> does that.
    COALESCE(new.raw_user_meta_data->>'role', 'renter'),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    CASE 
      WHEN new.raw_user_meta_data->>'date_of_birth' = '' THEN NULL
      ELSE (new.raw_user_meta_data->>'date_of_birth')::DATE
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role, -- Allow role update on conflict to fix mismatch
    phone = EXCLUDED.phone;

  return new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-apply trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. FIX: Referral Trigger logic
-- Ensure we check multiple metadata keys for ref code
CREATE OR REPLACE FUNCTION public.handle_new_user_referral()
RETURNS TRIGGER AS $$
DECLARE
    ref_code TEXT;
    affiliate_record RECORD;
BEGIN
    -- Extract referral code from raw_user_meta_data
    -- Keys might be 'ref_code', 'ref', 'referral_code'
    ref_code := NEW.raw_user_meta_data->>'ref_code';
    
    IF ref_code IS NULL OR ref_code = '' THEN
        ref_code := NEW.raw_user_meta_data->>'ref';
    END IF;
    
    IF ref_code IS NULL OR ref_code = '' THEN
        ref_code := NEW.raw_user_meta_data->>'referral_code';
    END IF;

    -- If we have a referral code, try to find the affiliate
    IF ref_code IS NOT NULL AND ref_code <> '' THEN
        SELECT * INTO affiliate_record FROM public.affiliates WHERE invite_code = ref_code LIMIT 1;

        IF FOUND THEN
            -- Insert into affiliate_referrals
            INSERT INTO public.affiliate_referrals (
                affiliate_id,
                referred_user_id,
                commission_status
            ) VALUES (
                affiliate_record.id,
                NEW.id,
                'pending'
            );

            -- Update total referrals count for the affiliate
            UPDATE public.affiliates
            SET total_referrals = total_referrals + 1,
                updated_at = NOW()
            WHERE id = affiliate_record.id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-apply trigger
DROP TRIGGER IF EXISTS on_auth_user_created_referral ON auth.users;
CREATE TRIGGER on_auth_user_created_referral
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_referral();


-- 3. FIX: Affiliate RLS Policies to prevent "infinite loop" if policies deny reading own record
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own affiliate record" ON public.affiliates;
CREATE POLICY "Users can view their own affiliate record"
    ON public.affiliates FOR SELECT
    USING (auth.uid() = user_id); -- Strict check on user_id

-- Allow creation if authenticated
DROP POLICY IF EXISTS "Users can join the affiliate program" ON public.affiliates;
CREATE POLICY "Users can join the affiliate program"
    ON public.affiliates FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 4. FIX: Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.affiliates TO authenticated;
GRANT SELECT ON public.affiliate_referrals TO authenticated;

-- 5. Helper to allow updating affiliate user_id if it was null (ghost record fix)
-- This allows the server-side action (using service role) to claim a record
-- but for RLS, strictly speaking, we might not need extra policies if we use Service Role in actions.
