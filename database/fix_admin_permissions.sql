-- ==============================================================================
-- ADMIN PERMISSIONS & RLS FIX
-- Run this script in Supabase SQL Editor to fix "Error fetching user_profiles"
-- and ensure Admins have full access to the dashboard data.
-- ==============================================================================

-- 1. Helper Function: Check if user is admin (Securely bypasses RLS)
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
    AND role = 'admin'
  );
END;
$$;

-- 2. Enable Row Level Security on Key Tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;

-- 3. POLICIES: USER PROFILES

-- Allow Public to view profiles (Required for Listing Owner info)
DROP POLICY IF EXISTS "Public view profiles" ON public.user_profiles;
CREATE POLICY "Public view profiles" ON public.user_profiles
  FOR SELECT USING (true);

-- Allow Users to update their own profile
DROP POLICY IF EXISTS "Self update profile" ON public.user_profiles;
CREATE POLICY "Self update profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow Admins full access to all profiles
DROP POLICY IF EXISTS "Admin full access profiles" ON public.user_profiles;
CREATE POLICY "Admin full access profiles" ON public.user_profiles
  FOR ALL USING (is_admin());

-- 4. POLICIES: LISTINGS

-- Allow Public to view listings
DROP POLICY IF EXISTS "Public view listings" ON public.listings;
CREATE POLICY "Public view listings" ON public.listings
  FOR SELECT USING (true);

-- Allow Owners to manage their own listings (Start/Stop/Edit)
DROP POLICY IF EXISTS "Owner manage listings" ON public.listings;
CREATE POLICY "Owner manage listings" ON public.listings
  FOR ALL USING (auth.uid() = owner_id);

-- Allow Admins full access to all listings (Approve/Reject/Delete)
DROP POLICY IF EXISTS "Admin full access listings" ON public.listings;
CREATE POLICY "Admin full access listings" ON public.listings
  FOR ALL USING (is_admin());

-- 5. POLICIES: VERIFICATION DOCUMENTS

-- Allow Users to manage their own documents
DROP POLICY IF EXISTS "Self manage docs" ON public.verification_documents;
CREATE POLICY "Self manage docs" ON public.verification_documents
  FOR ALL USING (auth.uid() = user_id);

-- Allow Admins to view/approve documents
DROP POLICY IF EXISTS "Admin full access docs" ON public.verification_documents;
CREATE POLICY "Admin full access docs" ON public.verification_documents
  FOR ALL USING (is_admin());

-- 6. POLICIES: BOOKINGS

-- Allow involved parties (Renter + Owner) to view bookings
DROP POLICY IF EXISTS "Stakeholders view bookings" ON public.bookings;
CREATE POLICY "Stakeholders view bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = owner_id OR auth.uid() = renter_id);

-- Allow Renters to create bookings
DROP POLICY IF EXISTS "Renter create bookings" ON public.bookings;
CREATE POLICY "Renter create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = renter_id);

-- Allow Admins full access to bookings
DROP POLICY IF EXISTS "Admin full access bookings" ON public.bookings;
CREATE POLICY "Admin full access bookings" ON public.bookings
  FOR ALL USING (is_admin());

-- 7. OPTIONAL: MAKE YOURSELF ADMIN
-- Verify your user ID or Email and uncomment one of the lines below in SQL Editor:

-- UPDATE public.user_profiles SET role = 'admin' WHERE id = auth.uid(); 
-- UPDATE public.user_profiles SET role = 'admin' WHERE email = 'your-email@example.com';
