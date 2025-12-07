-- Add is_admin column to user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Helper function to check admin rights (updated)
-- This function now checks both the role 'admin' OR the boolean flag is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_profiles 
    WHERE id = auth.uid() 
    AND (role = 'admin' OR is_admin = TRUE)
  );
END;
$$;

-- Update RLS policies to use the new definition of admin
-- (Previous policies used is_admin() function, so updating the function definition is sufficient mostly,
-- but we should ensure consistency if direct checks were used)

-- Example: Update policy for Admin full access profiles if it wasn't using the function
DROP POLICY IF EXISTS "Admin full access profiles" ON public.user_profiles;
CREATE POLICY "Admin full access profiles" ON public.user_profiles
  FOR ALL USING (is_admin());

-- Listings Policy Update
DROP POLICY IF EXISTS "Admin full access listings" ON public.listings;
CREATE POLICY "Admin full access listings" ON public.listings
  FOR ALL USING (is_admin());

-- Bookings Policy Update
DROP POLICY IF EXISTS "Admin full access bookings" ON public.bookings;
CREATE POLICY "Admin full access bookings" ON public.bookings
  FOR ALL USING (is_admin());

-- Verifications Policy Update
DROP POLICY IF EXISTS "Admin full access docs" ON public.verification_documents;
CREATE POLICY "Admin full access docs" ON public.verification_documents
  FOR ALL USING (is_admin());


-- OPTIONAL: If the user currently trying to be admin is an owner, run this manually (or let the user know):
-- UPDATE public.user_profiles SET is_admin = TRUE WHERE email = 'YOUR_EMAIL';
