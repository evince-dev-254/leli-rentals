-- Add owner_at column to user_profiles table if it doesn't exist
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS owner_at TIMESTAMPTZ;

-- Comment on column
COMMENT ON COLUMN public.user_profiles.owner_at IS 'Timestamp when the user became an owner';
