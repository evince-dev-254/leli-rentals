-- Quick script to approve all pending listings for testing
-- Run this in Supabase SQL Editor to approve your listings

UPDATE public.listings
SET status = 'approved'
WHERE status = 'pending';

-- Verify the update
SELECT id, title, status, category_id, owner_id, created_at
FROM public.listings
ORDER BY created_at DESC
LIMIT 10;
