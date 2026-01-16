-- Add admin and staff flags to user_profiles table

-- 1. Add columns if they don't exist
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_staff BOOLEAN DEFAULT FALSE;

-- 2. Backfill existing data based on role
UPDATE public.user_profiles 
SET is_admin = TRUE 
WHERE role = 'admin';

UPDATE public.user_profiles 
SET is_staff = TRUE 
WHERE role = 'staff';

-- 3. Reload schema cache
NOTIFY pgrst, 'reload schema';
