-- Migration to add is_advertiser support
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_advertiser BOOLEAN DEFAULT FALSE;
