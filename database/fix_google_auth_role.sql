-- ============================================
-- FIX: Google Auth Role Assignment
-- Description: Update handle_new_user trigger to default role to NULL instead of 'renter'
-- This forces the user to go through the Role Selection flow
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile, defaulting role to NULL if not provided in metadata
  -- This allows the application to detect "new" users and redirect to /select-role
  INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    role,
    phone,
    date_of_birth,
    avatar_url
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Unknown User'),
    -- CRITICAL CHANGE: Default to NULL instead of 'renter'
    COALESCE(new.raw_user_meta_data->>'role', NULL),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    CASE 
      WHEN new.raw_user_meta_data->>'date_of_birth' = '' THEN NULL
      ELSE (new.raw_user_meta_data->>'date_of_birth')::DATE
    END,
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    -- Only update role if it's currently NULL (don't overwrite existing roles)
    role = COALESCE(public.user_profiles.role, EXCLUDED.role),
    avatar_url = COALESCE(public.user_profiles.avatar_url, EXCLUDED.avatar_url),
    last_login_at = NOW();

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Log error but DO NOT block the user creation
  RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
