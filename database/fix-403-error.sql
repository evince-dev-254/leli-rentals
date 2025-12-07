-- ============================================
-- URGENT FIX: 403 Forbidden Error on Signup
-- ============================================
-- The 403 error means RLS policies exist but are blocking the insert
-- This is likely because the WITH CHECK condition is failing

-- Step 1: Drop the problematic INSERT policy
DROP POLICY IF EXISTS "Enable insert for authenticated users during signup" ON public.user_profiles;
DROP POLICY IF EXISTS "authenticated_users_insert_own_profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;

-- Step 2: Create a new INSERT policy that will work
-- The key is to use auth.uid() which gets the current user's ID from the JWT token
CREATE POLICY "allow_authenticated_insert"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Step 3: Verify the policy was created
SELECT policyname, cmd, roles, with_check 
FROM pg_policies 
WHERE tablename = 'user_profiles' AND cmd = 'INSERT';

-- Expected output:
-- policyname: allow_authenticated_insert
-- cmd: INSERT
-- roles: {authenticated}
-- with_check: (auth.uid() = id)

-- ============================================
-- ALTERNATIVE: If still failing, try this simpler policy
-- ============================================
-- This allows ANY authenticated user to insert (less secure but will work)
-- DROP POLICY IF EXISTS "allow_authenticated_insert" ON public.user_profiles;
-- 
-- CREATE POLICY "allow_any_authenticated_insert"
-- ON public.user_profiles
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (true);

-- ============================================
-- VERIFICATION
-- ============================================
-- After running, test by trying to insert manually:
-- INSERT INTO public.user_profiles (id, email, full_name, role)
-- VALUES (auth.uid(), 'test@example.com', 'Test User', 'renter');
