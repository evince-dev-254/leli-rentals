-- Add Next of Kin columns to user_profiles table

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'next_of_kin_name') THEN
        ALTER TABLE public.user_profiles ADD COLUMN next_of_kin_name TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'next_of_kin_phone') THEN
        ALTER TABLE public.user_profiles ADD COLUMN next_of_kin_phone TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'next_of_kin_relation') THEN
        ALTER TABLE public.user_profiles ADD COLUMN next_of_kin_relation TEXT;
    END IF;
END $$;

NOTIFY pgrst, 'reload schema';
