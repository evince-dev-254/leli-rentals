-- Add referral tracking fields to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS is_referred BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.user_profiles.is_referred IS 'Indicates if the user was referred by an affiliate';
COMMENT ON COLUMN public.user_profiles.referred_by IS 'The user ID of the person who referred this user';
