-- ============================================
-- FINAL FIX: 403 Error Despite Correct Policy
-- ============================================
-- The policy exists and looks correct, but 403 persists
-- This means there might be a trigger or the user isn't authenticated properly

-- Step 1: Check if there are any triggers blocking inserts
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'user_profiles';

-- Step 2: Temporarily allow ALL authenticated users to insert
-- This will help us identify if the issue is with auth.uid()
DROP POLICY IF EXISTS "allow_authenticated_insert" ON public.user_profiles;

CREATE POLICY "temp_allow_all_authenticated"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (true);  -- Allow any authenticated user

-- Step 3: Also ensure SELECT is allowed (needed to check if profile exists)
DROP POLICY IF EXISTS "users_select_own_profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;

CREATE POLICY "allow_authenticated_select"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (true);

-- Step 4: Verify policies
SELECT 
    policyname, 
    cmd, 
    roles,
    CASE 
        WHEN with_check = 'true'::text THEN 'ALLOWS ALL'
        ELSE with_check 
    END as check_condition
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY cmd;

-- ============================================
-- IMPORTANT: After signup works, tighten security
-- ============================================
-- Once signup is working, replace with secure policies:
-- 
-- DROP POLICY IF EXISTS "temp_allow_all_authenticated" ON public.user_profiles;
-- 
-- CREATE POLICY "secure_insert"
-- ON public.user_profiles
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (auth.uid() = id);
