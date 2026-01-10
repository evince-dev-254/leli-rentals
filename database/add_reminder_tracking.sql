-- Add columns to track when reminders were last sent
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS last_inactivity_reminder_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_verification_reminder_at TIMESTAMPTZ;

-- Add index for performance on these queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_login ON public.user_profiles(last_login_at);
CREATE INDEX IF NOT EXISTS idx_user_profiles_reminders ON public.user_profiles(last_inactivity_reminder_at, last_verification_reminder_at);
