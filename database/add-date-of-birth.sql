-- Add date_of_birth field to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Add constraint to ensure user is at least 18 years old
ALTER TABLE public.user_profiles
ADD CONSTRAINT check_minimum_age 
CHECK (date_of_birth IS NULL OR date_of_birth <= CURRENT_DATE - INTERVAL '18 years');

-- Add comment
COMMENT ON COLUMN public.user_profiles.date_of_birth IS 'User date of birth - must be at least 18 years old';
