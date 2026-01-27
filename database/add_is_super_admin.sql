-- Add is_super_admin column to user_profiles table
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT FALSE;

-- Optional: Create a policy if RLS is enabled, or just rely on service role key for admin actions
-- (Admin actions usually use supabaseAdmin which bypasses RLS)

-- Example: Promote usage to Super Admin (Run this manually in Supabase SQL Editor)
-- UPDATE public.user_profiles
-- SET is_super_admin = TRUE, role = 'admin'
-- WHERE email = 'YOUR_EMAIL@gmail.com';
