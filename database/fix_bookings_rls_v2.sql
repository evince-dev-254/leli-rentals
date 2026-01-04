-- ============================================
-- FIX RLS FOR BOOKINGS TABLE
-- ============================================

-- 1. Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing insert policies
DROP POLICY IF EXISTS "Renter can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Renter create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;

-- 3. Create a more robust INSERT policy
-- Allow any authenticated user to create a booking as long as they are the renter
CREATE POLICY "authenticated_user_create_booking"
ON public.bookings FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = renter_id);

-- 4. Ensure SELECT policy exists
DROP POLICY IF EXISTS "Stakeholders view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
CREATE POLICY "authenticated_user_view_booking"
ON public.bookings FOR SELECT 
TO authenticated 
USING (auth.uid() = renter_id OR auth.uid() = owner_id);

-- 5. Add Admin bypass if not already present
DROP POLICY IF EXISTS "Admin full access bookings" ON public.bookings;
CREATE POLICY "admin_all_bookings"
ON public.bookings FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 6. Grant basic permissions
GRANT ALL ON public.bookings TO authenticated;
GRANT SELECT ON public.bookings TO anon;

-- Verification
SELECT policyname, cmd, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'bookings';
