-- ============================================
-- MANUAL EMAIL VERIFICATION SCRIPT
-- ============================================
-- Use this script if you are not receiving verification emails.
-- It will manually mark your email as "verified" in the database.

-- 1. Confirm the email address
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = '1junemukami@gmail.com';

-- 2. Verify the user profile exists (it should have been created by the trigger)
SELECT * FROM public.user_profiles WHERE email = '1junemukami@gmail.com';

-- If the profile is missing (e.g. if the signup trigger failed initially), you can manually create it:
INSERT INTO public.user_profiles (id, email, full_name, role)
SELECT id, email, raw_user_meta_data->>'full_name', COALESCE(raw_user_meta_data->>'role', 'renter')
FROM auth.users
WHERE email = '1junemukami@gmail.com'
AND NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE email = '1junemukami@gmail.com');
