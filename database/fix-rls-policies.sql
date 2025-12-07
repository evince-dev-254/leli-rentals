-- ============================================
-- FIX: Row-Level Security Policies for user_profiles
-- ============================================
-- Run this SQL in your Supabase SQL Editor to fix the signup error

-- Enable RLS on user_profiles table
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users during signup" ON public.user_profiles;

-- Policy 1: Allow users to INSERT their own profile during signup
-- This is CRITICAL for signup to work
CREATE POLICY "Enable insert for authenticated users during signup"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Policy 2: Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy 3: Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 4: Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy 5: Public can view basic profile info for listings
CREATE POLICY "Public can view basic profile info"
ON public.user_profiles
FOR SELECT
TO anon
USING (true);

-- ============================================
-- VERIFICATION
-- ============================================
-- Run this to verify policies are created:
-- SELECT * FROM pg_policies WHERE tablename = 'user_profiles';
