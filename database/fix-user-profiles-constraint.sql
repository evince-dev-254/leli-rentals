-- Fix user_profiles account_type check constraint
-- The existing constraint only allows 'renter' and 'owner', but we need to support 'affiliate', 'admin', and 'user'

DO $$
BEGIN
    -- Check if the constraint exists
    IF EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'user_profiles_account_type_check'
        AND table_name = 'user_profiles'
    ) THEN
        -- Drop the restrictive constraint
        ALTER TABLE user_profiles DROP CONSTRAINT user_profiles_account_type_check;
        RAISE NOTICE 'Dropped restrictive account_type check constraint';
    END IF;

    -- Add a more permissive constraint
    -- We allow 'renter', 'owner', 'affiliate', 'admin', and 'user' (generic fallback)
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_account_type_check 
    CHECK (account_type IN ('renter', 'owner', 'affiliate', 'admin', 'user'));
    RAISE NOTICE 'Added updated account_type check constraint';

END $$;
