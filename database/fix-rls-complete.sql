-- ============================================
-- COMPREHENSIVE RLS FIX FOR USER PROFILES
-- ============================================

-- 1. Enable RLS (ensure it's on)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies to ensure a clean slate
-- We use dynamic SQL to drop policies to avoid errors if they don't exist
DO $$ 
DECLARE 
    pol record; 
BEGIN 
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles' 
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_profiles', pol.policyname); 
    END LOOP; 
END $$;

-- 3. Create INSERT policy (Authenticated users can create their own profile)
CREATE POLICY "Enable insert for users based on user_id"
ON public.user_profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- 4. Create SELECT policy (Everyone can view profiles - needed for listings/reviews)
-- We allow public access so listing owners can be seen by anyone
CREATE POLICY "Enable read access for all users"
ON public.user_profiles FOR SELECT 
TO public 
USING (true);

-- 5. Create UPDATE policy (Users can only update their own profile)
CREATE POLICY "Enable update for users based on user_id"
ON public.user_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 6. Create DELETE policy (Users can only delete their own profile)
CREATE POLICY "Enable delete for users based on user_id"
ON public.user_profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- 7. Grant access to public/anon roles just in case
GRANT SELECT ON public.user_profiles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;

-- VERIFICATION QUERY
SELECT policyname, cmd, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'user_profiles';
