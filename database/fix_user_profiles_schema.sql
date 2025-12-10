-- Fix user_profiles table schema
-- This script ensures the date_of_birth column exists and reloads the schema cache

DO $$
BEGIN
    -- 1. Ensure date_of_birth column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'date_of_birth'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN date_of_birth DATE;
    END IF;

    -- 2. Ensure other critical columns exist (just in case)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'role') THEN
        ALTER TABLE public.user_profiles ADD COLUMN role TEXT DEFAULT 'renter' CHECK (role IN ('renter', 'owner', 'affiliate', 'admin'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'full_name') THEN
        ALTER TABLE public.user_profiles ADD COLUMN full_name TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'avatar_url') THEN
        ALTER TABLE public.user_profiles ADD COLUMN avatar_url TEXT;
    END IF;

END $$;

-- 3. Reload the schema cache
NOTIFY pgrst, 'reload schema';
