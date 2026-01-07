-- Function to calculate and record affiliate commission
-- This should be called by the application (route handler) after a successful payment

CREATE OR REPLACE FUNCTION public.calculate_affiliate_commission(
    p_booking_id UUID,
    p_transaction_amount DECIMAL,
    p_user_id UUID -- The user who made the purchase
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_affiliate_id UUID;
    v_commission_rate DECIMAL;
    v_commission_amount DECIMAL;
    v_referral_id UUID;
    v_result JSONB;
BEGIN
    -- 1. Check if the user has a pending referral (i.e., was referred by someone)
    -- We look for a referral record for this user that hasn't been 'paid' or fully processed yet
    -- For simplicity, we check if there is ANY referral record for this user.
    -- In a strict system, we might check if this specific booking is already attributed.
    
    SELECT id, affiliate_id INTO v_referral_id, v_affiliate_id
    FROM public.affiliate_referrals
    WHERE referred_user_id = p_user_id
    ORDER BY created_at DESC
    LIMIT 1;

    IF v_referral_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'No referrer found for this user');
    END IF;

    -- 2. Get affiliate commission rate
    SELECT commission_rate INTO v_commission_rate
    FROM public.affiliates
    WHERE id = v_affiliate_id;

    IF v_commission_rate IS NULL THEN
        v_commission_rate := 10.0; -- Default fallback
    END IF;

    -- 3. Calculate amount
    v_commission_amount := p_transaction_amount * (v_commission_rate / 100.0);

    -- 4. Update the referral record to link it to this booking (if not already) and update amount
    -- If this referral was generic (just signup), we might create a NEW referral record for this specific booking
    -- strictly speaking. But typically "referrals" table tracks "Who referred Who".
    -- Let's insert a NEW record into `affiliate_referrals` if we want to track PER TRANSACTION commission?
    -- OR update the existing one?
    -- User request: "number of products the referrals have purchased then calculates commissions"
    -- This implies we accumulate commissions. 
    -- Best approach: Insert a NEW record into `affiliate_referrals` for THIS booking? 
    -- But the schema has `referred_user_id` and `booking_id`. 
    -- If `booking_id` is null on the initial signup referral, we update it? 
    -- But what if they book twice? We need multiple records.
    -- So, let's Insert a new record for this commission event.

    INSERT INTO public.affiliate_referrals (
        affiliate_id,
        referred_user_id,
        booking_id,
        commission_amount,
        commission_status
    ) VALUES (
        v_affiliate_id,
        p_user_id,
        p_booking_id,
        v_commission_amount,
        'approved' -- Approved because payment is successful
    );

    -- 5. Update Affiliate Earnings
    UPDATE public.affiliates
    SET 
        pending_earnings = pending_earnings + v_commission_amount,
        total_earnings = total_earnings + v_commission_amount,
        updated_at = NOW()
    WHERE id = v_affiliate_id;

    RETURN jsonb_build_object(
        'success', true, 
        'affiliate_id', v_affiliate_id, 
        'commission', v_commission_amount
    );
END;
$$;
