-- Migration: Add city column to listings table
-- This script adds the 'city' column for more granular search filtering

-- 1. Add the column
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS city TEXT;

-- 2. Create an index for performance
CREATE INDEX IF NOT EXISTS idx_listings_city ON public.listings(city);

-- 3. (Optional) Populate existing data from the location string if possible
-- This is a heuristic and might need manual adjustment
UPDATE public.listings 
SET city = trim(split_part(location, ',', 2))
WHERE city IS NULL AND location LIKE '%,%';

-- If there's no comma, we can't reliably extract the city from the string, 
-- but this migration ensures future listings have it properly stored.
