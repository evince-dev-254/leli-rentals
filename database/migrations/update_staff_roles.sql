-- ==========================================================
-- MIGRATION: Update User Roles Constraint
-- ==========================================================
-- This script updates the 'user_profiles_role_check' constraint 
-- to allow the new 'staff' and 'staff_pending' roles.
-- Run this in your Supabase SQL Editor.

-- 1. Drop the existing constraint
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_role_check;

-- 2. Re-create the constraint with expanded role options
ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_role_check 
CHECK (role IN ('renter', 'owner', 'affiliate', 'admin', 'staff', 'staff_pending'));

-- 3. Notify the API to reload schema cache
NOTIFY pgrst, 'reload schema';
