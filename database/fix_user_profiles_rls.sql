-- Fix the broken RLS policy from supabase_optimization.sql
-- This policy was hiding users' own profiles from them if account_status was not 'active',
-- which caused upsert calls to fail with "duplicate key value violates unique constraint" (23505).

DROP POLICY IF EXISTS "profiles_auth_master" ON public.user_profiles;
CREATE POLICY "profiles_auth_master" ON public.user_profiles FOR ALL TO authenticated 
USING ((SELECT auth.uid()) = id OR account_status = 'active' OR (SELECT public.is_admin())) 
WITH CHECK ((SELECT public.is_admin()) OR (SELECT auth.uid()) = id);

-- Also ensure anon can still read active profiles
DROP POLICY IF EXISTS "profiles_anon_read" ON public.user_profiles;
CREATE POLICY "profiles_anon_read" ON public.user_profiles FOR SELECT TO anon 
USING (account_status = 'active');

-- Trigger a schema reload
NOTIFY pgrst, 'reload schema';
