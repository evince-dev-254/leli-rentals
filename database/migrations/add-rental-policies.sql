-- ============================================
-- RENTAL POLICIES & LISTING MANAGEMENT MIGRATION
-- ============================================
-- Run this SQL in Supabase SQL Editor after schema.sql

-- Add policy and status fields to listings table
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS rental_policy_type TEXT DEFAULT 'moderate' CHECK (rental_policy_type IN ('harsh', 'strict', 'moderate')),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
ADD COLUMN IF NOT EXISTS late_return_fee_per_day DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS damage_deposit_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS damage_deposit_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS theft_policy TEXT,
ADD COLUMN IF NOT EXISTS damage_policy TEXT,
ADD COLUMN IF NOT EXISTS late_return_policy TEXT;

-- Create listing drafts table for autosave
CREATE TABLE IF NOT EXISTS public.listing_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  draft_data JSONB NOT NULL,
  last_saved_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(owner_id)
);

-- Enable RLS on listing_drafts
ALTER TABLE public.listing_drafts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for listing_drafts
CREATE POLICY "Users can view their own drafts"
ON public.listing_drafts
FOR SELECT
TO authenticated
USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own drafts"
ON public.listing_drafts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own drafts"
ON public.listing_drafts
FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own drafts"
ON public.listing_drafts
FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);

-- Add index for faster draft lookups
CREATE INDEX IF NOT EXISTS idx_listing_drafts_owner ON public.listing_drafts(owner_id);

-- Update existing listings to have default policy
UPDATE public.listings 
SET rental_policy_type = 'moderate', 
    status = 'published'
WHERE rental_policy_type IS NULL OR status IS NULL;

-- ============================================
-- VERIFICATION
-- ============================================
-- Verify new columns:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'listings' AND column_name LIKE '%policy%';
-- SELECT * FROM pg_policies WHERE tablename = 'listing_drafts';
