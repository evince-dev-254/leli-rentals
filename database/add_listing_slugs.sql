-- Add slug column to listings table
ALTER TABLE listings ADD COLUMN IF NOT EXISTS slug text;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS listings_slug_idx ON listings (slug);

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title text) RETURNS text AS $$
DECLARE
  new_slug text;
  base_slug text;
  counter integer := 0;
BEGIN
  -- Convert to lowercase, replace non-alphanumeric with hyphens, remove duplicate hyphens
  base_slug := lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'));
  new_slug := base_slug;
  
  -- Check for uniqueness and append counter if necessary
  WHILE EXISTS (SELECT 1 FROM listings WHERE slug = new_slug) LOOP
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN new_slug;
END;
$$ LANGUAGE plpgsql;

-- Update existing listings with slugs
UPDATE listings 
SET slug = generate_slug(title) 
WHERE slug IS NULL;

-- Make slug required for future inserts
ALTER TABLE listings ALTER COLUMN slug SET NOT NULL;
