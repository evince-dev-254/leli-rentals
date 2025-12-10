-- ============================================
-- MIGRATE LISTINGS TO SPECIFIC OWNER
-- ============================================

DO $$
DECLARE
    v_user_id UUID := '6679c678-8a4b-46cc-b346-68e814c80d31';
    v_email TEXT := '1kihiupaul@gmail.com';
BEGIN
    -- 1. Ensure the user exists (Using user provided data)
    -- We use ON CONFLICT DO NOTHING to avoid errors if already exists
    INSERT INTO public.user_profiles (
        id, email, full_name, phone, date_of_birth, role, account_status, email_verified, phone_verified, created_at, updated_at
    ) VALUES (
        v_user_id, 
        v_email, 
        'Sir.Ginno', 
        '+254112081866', 
        '2002-03-03', 
        'owner', 
        'active', 
        false, 
        false, 
        '2025-12-10 07:49:44.323702+00', 
        '2025-12-10 13:16:06.771754+00'
    )
    ON CONFLICT (id) DO UPDATE SET
        role = 'owner', -- Ensure they are an owner
        email = EXCLUDED.email;

    -- 2. Update ALL listings to belong to this user
    UPDATE public.listings
    SET owner_id = v_user_id;

    -- 3. Update any bookings where this user might be the owner (optional, depending on logic)
    UPDATE public.bookings
    SET owner_id = v_user_id
    WHERE listing_id IN (SELECT id FROM public.listings);

END $$;
