-- Migration: Add multi-role support
-- Description: Adds is_staff and is_admin flags to user_profiles

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS is_staff BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Update existing admins/staff based on their current role
UPDATE user_profiles SET is_admin = TRUE WHERE role = 'admin';
UPDATE user_profiles SET is_staff = TRUE WHERE role = 'staff';

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_staff ON user_profiles(is_staff) WHERE is_staff = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_admin ON user_profiles(is_admin) WHERE is_admin = TRUE;
