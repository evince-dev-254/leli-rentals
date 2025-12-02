-- Fix User Sync Issues
-- 1. Create user_sync_log table
-- 2. Ensure user_profiles has all necessary columns

-- ================================================================
-- 1. CREATE USER_SYNC_LOG TABLE
-- ================================================================

-- Drop table if it exists to ensure clean state (since it's a log table, this is acceptable for a fix)
DROP TABLE IF EXISTS user_sync_log;

CREATE TABLE user_sync_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sync_type TEXT NOT NULL, -- 'manual', 'webhook', 'scheduled'
  triggered_by TEXT, -- 'admin', 'system', or user_id
  status TEXT NOT NULL, -- 'in_progress', 'completed', 'failed'
  users_synced INTEGER DEFAULT 0,
  users_failed INTEGER DEFAULT 0,
  failed_user_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  error_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_user_sync_log_created_at ON user_sync_log(created_at DESC);

-- Enable RLS
ALTER TABLE user_sync_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view sync logs
CREATE POLICY "Admins can view sync logs" ON user_sync_log
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()::text) = 'admin'
  );

-- Admins and service role can insert/update
CREATE POLICY "Admins can manage sync logs" ON user_sync_log
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()::text) = 'admin'
  );

-- ================================================================
-- 2. ENSURE USER_PROFILES COLUMNS
-- ================================================================

DO $$
BEGIN
    -- Add role column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'role') THEN
        ALTER TABLE user_profiles ADD COLUMN role TEXT DEFAULT 'user';
        -- Add constraint separately to avoid issues if data exists
        ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check CHECK (role IN ('user', 'admin', 'super_admin'));
    END IF;

    -- Add subscription_plan
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'subscription_plan') THEN
        ALTER TABLE user_profiles ADD COLUMN subscription_plan TEXT DEFAULT 'free';
    END IF;

    -- Add subscription_status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'subscription_status') THEN
        ALTER TABLE user_profiles ADD COLUMN subscription_status TEXT DEFAULT 'active';
    END IF;

    -- Add verification_status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'verification_status') THEN
        ALTER TABLE user_profiles ADD COLUMN verification_status TEXT DEFAULT 'unverified';
    END IF;
END $$;
