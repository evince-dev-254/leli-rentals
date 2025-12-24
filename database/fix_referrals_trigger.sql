-- Function to handle new user signup and check for referral code
CREATE OR REPLACE FUNCTION public.handle_new_user_referral()
RETURNS TRIGGER AS $$
DECLARE
    ref_code TEXT;
    affiliate_record RECORD;
BEGIN
    -- Extract referral code from raw_user_meta_data
    -- Note: metadata keys are case-sensitive, usually 'ref_code' or 'ref' passed from signup
    ref_code := NEW.raw_user_meta_data->>'ref_code';
    
    -- If no ref_code, check 'ref' just in case
    IF ref_code IS NULL THEN
        ref_code := NEW.raw_user_meta_data->>'ref';
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

-- Trigger to run after a new user is created in auth.users
-- We use auth.users because that's where the signup metadata comes from initially
DROP TRIGGER IF EXISTS on_auth_user_created_referral ON auth.users;
CREATE TRIGGER on_auth_user_created_referral
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_referral();
