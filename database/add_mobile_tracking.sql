-- Add mobile tracking columns to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS last_app_version TEXT,
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS ota_update_id TEXT,
ADD COLUMN IF NOT EXISTS device_platform TEXT;

-- Create an index for last_active_at to efficiently show live users
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_active ON public.user_profiles(last_active_at DESC);
