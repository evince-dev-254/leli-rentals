-- ============================================
-- RLS FIX FOR USER PROFILES
-- ============================================
-- Run this script in your Supabase SQL Editor to fix the "infinite recursion" errors.
-- It will NOT delete your data or tables. It only resets the access rules.

-- 1. Enable RLS (Ensures it is on)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies to ensure a clean slate
-- We use dynamic SQL to drop policies to avoid errors if they don't exist
-- and to ensure we catch ANY policy that might be causing recursion.
DO $$ 
DECLARE 
    pol record; 
BEGIN 
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles' 
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_profiles', pol.policyname); 
    END LOOP; 
END $$;

-- 3. Create CLEAN, non-recursive policies

-- Allow users to insert their own profile (Required for sign-up)
CREATE POLICY "Enable insert for users based on user_id"
ON public.user_profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Allow everyone to read profiles (Required so listings show owner info)
CREATE POLICY "Enable read access for all users"
ON public.user_profiles FOR SELECT 
TO public 
USING (true);

-- Allow users to update ONLY their own profile (Prevents recursion)
CREATE POLICY "Enable update for users based on user_id"
ON public.user_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Enable delete for users based on user_id"
ON public.user_profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- 4. Verify (Optional output to confirm)
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'user_profiles';
