-- ============================================
-- MIGRATE CATEGORIES TO PREDEFINED UUIDs
-- ============================================
-- This script safely migrates existing categories to use predefined UUIDs
-- while handling foreign key constraints from subcategories and listings

-- Step 1: Temporarily disable foreign key constraints
ALTER TABLE public.subcategories DROP CONSTRAINT IF EXISTS subcategories_category_id_fkey;
ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_category_id_fkey;

-- Step 2: Create a temporary mapping table
CREATE TEMP TABLE category_uuid_mapping AS
SELECT 
    id as old_id,
    CASE slug
        WHEN 'vehicles' THEN '11111111-1111-1111-1111-111111111111'::uuid
        WHEN 'homes' THEN '22222222-2222-2222-2222-222222222222'::uuid
        WHEN 'equipment' THEN '33333333-3333-3333-3333-333333333333'::uuid
        WHEN 'electronics' THEN '44444444-4444-4444-4444-444444444444'::uuid
        WHEN 'fashion' THEN '55555555-5555-5555-5555-555555555555'::uuid
        WHEN 'entertainment' THEN '66666666-6666-6666-6666-666666666666'::uuid
        WHEN 'events' THEN '77777777-7777-7777-7777-777777777777'::uuid
        WHEN 'photography' THEN '88888888-8888-8888-8888-888888888888'::uuid
        WHEN 'fitness' THEN '99999999-9999-9999-9999-999999999999'::uuid
        WHEN 'baby' THEN 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid
        WHEN 'office' THEN 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid
        WHEN 'bikes' THEN 'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid
        ELSE id -- Keep original if not in our list
    END as new_id,
    slug
FROM public.categories;

-- Step 3: Update subcategories to reference new category IDs
UPDATE public.subcategories
SET category_id = m.new_id
FROM category_uuid_mapping m
WHERE subcategories.category_id = m.old_id;

-- Step 4: Update listings to reference new category IDs
UPDATE public.listings
SET category_id = m.new_id
FROM category_uuid_mapping m
WHERE listings.category_id = m.old_id;

-- Step 5: Update the categories table with new IDs
UPDATE public.categories
SET id = m.new_id
FROM category_uuid_mapping m
WHERE categories.id = m.old_id
  AND categories.id != m.new_id; -- Only update if different

-- Step 6: Re-enable foreign key constraints
ALTER TABLE public.subcategories 
ADD CONSTRAINT subcategories_category_id_fkey 
FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;

ALTER TABLE public.listings 
ADD CONSTRAINT listings_category_id_fkey 
FOREIGN KEY (category_id) REFERENCES public.categories(id);

-- Step 7: Insert any missing categories
INSERT INTO public.categories (id, name, slug, description, display_order, is_active, created_at, updated_at)
SELECT * FROM (VALUES
    ('11111111-1111-1111-1111-111111111111'::uuid, 'Vehicles', 'vehicles', 'Cars, motorcycles, trucks, and more for your transportation needs', 1, true, NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222222'::uuid, 'Homes & Apartments', 'homes', 'Vacation homes, apartments, and temporary accommodations', 2, true, NOW(), NOW()),
    ('33333333-3333-3333-3333-333333333333'::uuid, 'Equipment & Tools', 'equipment', 'Professional tools and machinery for any project', 3, true, NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444444'::uuid, 'Electronics', 'electronics', 'Gadgets, cameras, and tech gear for rent', 4, true, NOW(), NOW()),
    ('55555555-5555-5555-5555-555555555555'::uuid, 'Fashion & Accessories', 'fashion', 'Designer clothing, accessories, and jewelry', 5, true, NOW(), NOW()),
    ('66666666-6666-6666-6666-666666666666'::uuid, 'Entertainment', 'entertainment', 'Music instruments, gaming, and party equipment', 6, true, NOW(), NOW()),
    ('77777777-7777-7777-7777-777777777777'::uuid, 'Event Spaces', 'events', 'Venues and spaces for all occasions', 7, true, NOW(), NOW()),
    ('88888888-8888-8888-8888-888888888888'::uuid, 'Photography', 'photography', 'Cameras, lighting, and studio equipment', 8, true, NOW(), NOW()),
    ('99999999-9999-9999-9999-999999999999'::uuid, 'Fitness & Sports', 'fitness', 'Gym equipment, sports gear, and outdoor activities', 9, true, NOW(), NOW()),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Baby & Kids', 'baby', 'Baby gear, toys, and children''s equipment', 10, true, NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Office & Business', 'office', 'Office furniture, equipment, and business tools', 11, true, NOW(), NOW()),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'Bikes & Scooters', 'bikes', 'Bicycles, e-bikes, and scooters for urban mobility', 12, true, NOW(), NOW())
) AS v(id, name, slug, description, display_order, is_active, created_at, updated_at)
WHERE NOT EXISTS (
    SELECT 1 FROM public.categories WHERE categories.slug = v.slug
);

-- Step 8: Create the mapping view
CREATE OR REPLACE VIEW category_id_mapping AS
SELECT 
    'vehicles' as string_id, '11111111-1111-1111-1111-111111111111'::uuid as uuid_id, 'Vehicles' as name
UNION ALL SELECT 'homes', '22222222-2222-2222-2222-222222222222'::uuid, 'Homes & Apartments'
UNION ALL SELECT 'equipment', '33333333-3333-3333-3333-333333333333'::uuid, 'Equipment & Tools'
UNION ALL SELECT 'electronics', '44444444-4444-4444-4444-444444444444'::uuid, 'Electronics'
UNION ALL SELECT 'fashion', '55555555-5555-5555-5555-555555555555'::uuid, 'Fashion & Accessories'
UNION ALL SELECT 'entertainment', '66666666-6666-6666-6666-666666666666'::uuid, 'Entertainment'
UNION ALL SELECT 'events', '77777777-7777-7777-7777-777777777777'::uuid, 'Event Spaces'
UNION ALL SELECT 'photography', '88888888-8888-8888-8888-888888888888'::uuid, 'Photography'
UNION ALL SELECT 'fitness', '99999999-9999-9999-9999-999999999999'::uuid, 'Fitness & Sports'
UNION ALL SELECT 'baby', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Baby & Kids'
UNION ALL SELECT 'office', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Office & Business'
UNION ALL SELECT 'bikes', 'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'Bikes & Scooters';

-- Step 9: Verify the migration
SELECT 'Categories' as table_name, id, name, slug FROM public.categories ORDER BY display_order;

SELECT 'Mapping View' as info, * FROM category_id_mapping ORDER BY string_id;

-- Show how many subcategories and listings were updated
SELECT 
    'Migration Summary' as info,
    (SELECT COUNT(*) FROM public.categories) as total_categories,
    (SELECT COUNT(*) FROM public.subcategories) as total_subcategories,
    (SELECT COUNT(*) FROM public.listings) as total_listings;
