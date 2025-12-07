-- ============================================
-- FIX: Signup Flow Trigger (Robust Version)
-- ============================================

-- Function to handle new user processing
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile, ignoring if already exists to handle race conditions or previous failures
  INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    role,
    phone,
    date_of_birth
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Unknown User'),
    COALESCE(new.raw_user_meta_data->>'role', 'renter'),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    CASE 
      WHEN new.raw_user_meta_data->>'date_of_birth' = '' THEN NULL
      ELSE (new.raw_user_meta_data->>'date_of_birth')::DATE
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone;

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Log error but DO NOT block the user creation to ensure the email is sent
  RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
