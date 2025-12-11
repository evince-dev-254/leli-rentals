-- Add last_login_at column to user_profiles if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'last_login_at'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN last_login_at TIMESTAMPTZ;
    END IF;
END $$;

NOTIFY pgrst, 'reload schema';
