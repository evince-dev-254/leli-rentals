-- ============================================
-- UPDATE CATEGORIES AND SUBCATEGORIES V2
-- ============================================
-- This script updates the database to match the latest Changes in lib/categories-data.ts
-- Includes: Renaming categories, adding Business Spaces, updating Vehicles, and setting images.

-- 1. UPDATE EXISTING CATEGORIES (Renames)
-- Rename Homes & Apartments -> Living Spaces
UPDATE public.categories
SET name = 'Living Spaces', 
    slug = 'living', 
    description = 'Homes, apartments, and vacation stays',
    image_url = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'
WHERE id = '22222222-2222-2222-2222-222222222222'::uuid OR slug = 'homes';

-- Rename Event Spaces -> Utility Spaces
UPDATE public.categories
SET name = 'Utility Spaces', 
    slug = 'utility', 
    description = 'Venues and spaces for all occasions',
    image_url = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80'
WHERE id = '77777777-7777-7777-7777-777777777777'::uuid OR slug = 'events';

-- 2. INSERT NEW CATEGORY (Business Spaces)
INSERT INTO public.categories (id, name, slug, description, image_url, display_order, is_active)
VALUES (
    'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid,
    'Business Spaces',
    'business',
    'Professional spaces for businesses and entrepreneurs',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    13, -- Assuming 12 was the last one (bikes)
    true
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url;

-- 3. UPDATE/INSERT SUBCATEGORIES

-- Helper to insert/update subcategory with image
-- We use a temporary table or just direct inserts with specific IDs

-- VEHICLES (1111...) additions
INSERT INTO public.subcategories (category_id, name, slug, image_url, display_order)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Private jets', 'private-jets', 'https://images.unsplash.com/photo-1514972365-5c4c9f3f6e5b?w=400&h=300&fit=crop', 13),
    ('11111111-1111-1111-1111-111111111111', 'Helicopters', 'helicopters', 'https://images.unsplash.com/photo-1514972365-5c4c9f3f6e5b?w=400&h=300&fit=crop', 14)
ON CONFLICT (category_id, slug) DO UPDATE SET image_url = EXCLUDED.image_url;

-- LIVING SPACES (2222...) - Formerly Homes
-- We need to ensure slugs match. 'apartments' exists. 'studios' might be new.
INSERT INTO public.subcategories (category_id, name, slug, image_url, display_order)
VALUES
    ('22222222-2222-2222-2222-222222222222', 'Apartments', 'apartments', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop', 1),
    ('22222222-2222-2222-2222-222222222222', 'Studio Flats', 'studio-flats', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop', 2),
    ('22222222-2222-2222-2222-222222222222', 'Penthouses', 'penthouses', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop', 3),
    ('22222222-2222-2222-2222-222222222222', 'Duplexes', 'duplexes', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop', 4),
    ('22222222-2222-2222-2222-222222222222', 'Single-family Homes', 'single-family-homes', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop', 5),
    ('22222222-2222-2222-2222-222222222222', 'Townhouses', 'townhouses', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop', 6),
    ('22222222-2222-2222-2222-222222222222', 'Luxury Villas', 'luxury-villas', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop', 7),
    ('22222222-2222-2222-2222-222222222222', 'Bungalows', 'bungalows', 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=400&h=300&fit=crop', 8),
    ('22222222-2222-2222-2222-222222222222', 'Coliving Spaces', 'coliving-spaces', 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=400&h=300&fit=crop', 9),
    ('22222222-2222-2222-2222-222222222222', 'Student Hostels', 'student-hostels', 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=400&h=300&fit=crop', 10),
    ('22222222-2222-2222-2222-222222222222', 'Cottages', 'cottages', 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400&h=300&fit=crop', 11),
    ('22222222-2222-2222-2222-222222222222', 'Cabins', 'cabins', 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400&h=300&fit=crop', 12),
    ('22222222-2222-2222-2222-222222222222', 'Beach Houses', 'beach-houses', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop', 13),
    ('22222222-2222-2222-2222-222222222222', 'Farmhouses', 'farmhouses', 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=400&h=300&fit=crop', 14)
ON CONFLICT (category_id, slug) DO UPDATE SET 
    name = EXCLUDED.name,
    image_url = EXCLUDED.image_url,
    display_order = EXCLUDED.display_order;

-- UTILITY SPACES (7777...) - Formerly Events
INSERT INTO public.subcategories (category_id, name, slug, image_url, display_order)
VALUES
    ('77777777-7777-7777-7777-777777777777', 'Banquet Halls', 'banquet-halls', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop', 1),
    ('77777777-7777-7777-7777-777777777777', 'Conference Rooms', 'conference-rooms', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=300&fit=crop', 2),
    ('77777777-7777-7777-7777-777777777777', 'Wedding Venues', 'wedding-venues', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop', 3),
    ('77777777-7777-7777-7777-777777777777', 'Rooftop Terraces', 'rooftop-terraces', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=300&fit=crop', 4),
    ('77777777-7777-7777-7777-777777777777', 'Art Galleries', 'art-galleries', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 5),
    ('77777777-7777-7777-7777-777777777777', 'Creative Studios', 'creative-studios', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 6),
    ('77777777-7777-7777-7777-777777777777', 'Self-storage Units', 'self-storage-units', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 7),
    ('77777777-7777-7777-7777-777777777777', 'Parking Spaces', 'parking-spaces', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 8),
    ('77777777-7777-7777-7777-777777777777', 'Shipping Containers', 'shipping-containers', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 9)
ON CONFLICT (category_id, slug) DO UPDATE SET 
    name = EXCLUDED.name,
    image_url = EXCLUDED.image_url,
    display_order = EXCLUDED.display_order;

-- BUSINESS SPACES (dddd...) - New
INSERT INTO public.subcategories (category_id, name, slug, image_url, display_order)
VALUES
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Private offices', 'private-offices', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 1),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Coworking desks', 'coworking-desks', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 2),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Executive suites', 'executive-suites', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 3),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Shop fronts', 'shop-fronts', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 4),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Showrooms', 'showrooms', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 5),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Pop-up shops', 'pop-up-shops', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 6),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Kiosks', 'kiosks', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 7),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Warehouses', 'warehouses', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 8),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Cold storage', 'cold-storage', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 9),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Workshops', 'workshops', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 10)
ON CONFLICT (category_id, slug) DO UPDATE SET 
    name = EXCLUDED.name,
    image_url = EXCLUDED.image_url,
    display_order = EXCLUDED.display_order;
