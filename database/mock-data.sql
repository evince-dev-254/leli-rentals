-- ============================================
-- LELI RENTALS - MOCK DATA
-- ============================================
-- This file populates the database with realistic mock data
-- Run this AFTER schema.sql and helper-functions.sql

-- ============================================
-- 1. CATEGORIES & SUBCATEGORIES
-- ============================================

-- Insert categories
INSERT INTO public.categories (name, slug, description, icon, display_order) VALUES
    ('Vehicles', 'vehicles', 'Cars, motorcycles, and other vehicles for rent', '🚗', 1),
    ('Electronics', 'electronics', 'Cameras, laptops, and gadgets', '💻', 2),
    ('Equipment', 'equipment', 'Tools and machinery for various needs', '🔧', 3),
    ('Properties', 'properties', 'Homes, apartments, and spaces', '🏠', 4),
    ('Fashion', 'fashion', 'Clothing, accessories, and jewelry', '👗', 5),
    ('Events', 'events', 'Party supplies and event equipment', '🎉', 6)
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs for subcategories
DO $$
DECLARE
    v_vehicles_id UUID;
    v_electronics_id UUID;
    v_equipment_id UUID;
    v_properties_id UUID;
    v_fashion_id UUID;
    v_events_id UUID;
BEGIN
    SELECT id INTO v_vehicles_id FROM public.categories WHERE slug = 'vehicles';
    SELECT id INTO v_electronics_id FROM public.categories WHERE slug = 'electronics';
    SELECT id INTO v_equipment_id FROM public.categories WHERE slug = 'equipment';
    SELECT id INTO v_properties_id FROM public.categories WHERE slug = 'properties';
    SELECT id INTO v_fashion_id FROM public.categories WHERE slug = 'fashion';
    SELECT id INTO v_events_id FROM public.categories WHERE slug = 'events';

    -- Insert subcategories for Vehicles
    INSERT INTO public.subcategories (category_id, name, slug, display_order) VALUES
        (v_vehicles_id, 'Cars', 'cars', 1),
        (v_vehicles_id, 'Motorcycles', 'motorcycles', 2),
        (v_vehicles_id, 'Bicycles', 'bicycles', 3),
        (v_vehicles_id, 'Vans & Trucks', 'vans-trucks', 4)
    ON CONFLICT (category_id, slug) DO NOTHING;

    -- Insert subcategories for Electronics
    INSERT INTO public.subcategories (category_id, name, slug, display_order) VALUES
        (v_electronics_id, 'Cameras', 'cameras', 1),
        (v_electronics_id, 'Laptops', 'laptops', 2),
        (v_electronics_id, 'Audio Equipment', 'audio-equipment', 3),
        (v_electronics_id, 'Gaming Consoles', 'gaming-consoles', 4)
    ON CONFLICT (category_id, slug) DO NOTHING;

    -- Insert subcategories for Equipment
    INSERT INTO public.subcategories (category_id, name, slug, display_order) VALUES
        (v_equipment_id, 'Power Tools', 'power-tools', 1),
        (v_equipment_id, 'Camping Gear', 'camping-gear', 2),
        (v_equipment_id, 'Sports Equipment', 'sports-equipment', 3),
        (v_equipment_id, 'Photography', 'photography', 4)
    ON CONFLICT (category_id, slug) DO NOTHING;

    -- Insert subcategories for Properties
    INSERT INTO public.subcategories (category_id, name, slug, display_order) VALUES
        (v_properties_id, 'Apartments', 'apartments', 1),
        (v_properties_id, 'Houses', 'houses', 2),
        (v_properties_id, 'Office Spaces', 'office-spaces', 3),
        (v_properties_id, 'Event Venues', 'event-venues', 4)
    ON CONFLICT (category_id, slug) DO NOTHING;

    -- Insert subcategories for Fashion
    INSERT INTO public.subcategories (category_id, name, slug, display_order) VALUES
        (v_fashion_id, 'Wedding Dresses', 'wedding-dresses', 1),
        (v_fashion_id, 'Suits & Tuxedos', 'suits-tuxedos', 2),
        (v_fashion_id, 'Designer Bags', 'designer-bags', 3),
        (v_fashion_id, 'Jewelry', 'jewelry', 4)
    ON CONFLICT (category_id, slug) DO NOTHING;

    -- Insert subcategories for Events
    INSERT INTO public.subcategories (category_id, name, slug, display_order) VALUES
        (v_events_id, 'Tents & Canopies', 'tents-canopies', 1),
        (v_events_id, 'Tables & Chairs', 'tables-chairs', 2),
        (v_events_id, 'Sound Systems', 'sound-systems', 3),
        (v_events_id, 'Decorations', 'decorations', 4)
    ON CONFLICT (category_id, slug) DO NOTHING;
END $$;

-- ============================================
-- 2. MOCK USERS (Note: These won't have auth.users entries)
-- ============================================
-- In production, users are created via Supabase Auth
-- This is just for demonstration - you'll need real auth users

-- Note: You'll need to create real users via signup form
-- Then you can update their profiles with this data

-- Example profile updates (run after users sign up):
/*
UPDATE public.user_profiles SET
    full_name = 'John Kamau',
    phone = '+254712345678',
    bio = 'Property owner in Nairobi with multiple listings',
    location = 'Nairobi, Kenya',
    role = 'owner',
    avatar_url = 'https://ik.imagekit.io/jsmasterypaul/avatars/user-1.jpg'
WHERE email = 'john@example.com';

UPDATE public.user_profiles SET
    full_name = 'Sarah Wanjiku',
    phone = '+254723456789',
    bio = 'Looking for quality rentals in Nairobi',
    location = 'Westlands, Nairobi',
    role = 'renter',
    avatar_url = 'https://ik.imagekit.io/jsmasterypaul/avatars/user-2.jpg'
WHERE email = 'sarah@example.com';
*/

-- ============================================
-- 3. MOCK LISTINGS
-- ============================================
-- Note: Replace owner_id with actual user UUIDs after creating users

-- Example listings (uncomment and replace UUIDs after creating users):
/*
DO $$
DECLARE
    v_owner_id UUID := 'your-user-uuid-here'; -- Replace with actual user UUID
    v_vehicles_id UUID;
    v_cars_id UUID;
    v_properties_id UUID;
    v_apartments_id UUID;
BEGIN
    SELECT id INTO v_vehicles_id FROM public.categories WHERE slug = 'vehicles';
    SELECT id INTO v_cars_id FROM public.subcategories WHERE slug = 'cars';
    SELECT id INTO v_properties_id FROM public.categories WHERE slug = 'properties';
    SELECT id INTO v_apartments_id FROM public.subcategories WHERE slug = 'apartments';

    -- Insert vehicle listings
    INSERT INTO public.listings (
        owner_id, category_id, subcategory_id, title, slug,
        description, price_per_day, price_per_week, price_per_month,
        location, latitude, longitude, images, features,
        deposit_amount, instant_booking, status
    ) VALUES
    (
        v_owner_id, v_vehicles_id, v_cars_id,
        'Toyota Corolla 2020 - Daily Rental',
        'toyota-corolla-2020-daily-rental',
        'Well-maintained Toyota Corolla 2020 available for daily rental. Perfect for city driving and long trips. Fuel efficient and reliable.',
        3500.00, 21000.00, 80000.00,
        'Nairobi CBD, Kenya', -1.2864, 36.8172,
        ARRAY[
            'https://ik.imagekit.io/jsmasterypaul/listings/corolla-main.jpg',
            'https://ik.imagekit.io/jsmasterypaul/listings/corolla-interior.jpg',
            'https://ik.imagekit.io/jsmasterypaul/listings/corolla-side.jpg'
        ],
        '{
            "year": 2020,
            "make": "Toyota",
            "model": "Corolla",
            "transmission": "Automatic",
            "fuel_type": "Petrol",
            "seats": 5,
            "mileage": "45000 km",
            "features": ["AC", "Power Windows", "Bluetooth", "Backup Camera"]
        }'::jsonb,
        10000.00, true, 'approved'
    ),
    (
        v_owner_id, v_vehicles_id, v_cars_id,
        'Honda CR-V 2021 - SUV Rental',
        'honda-crv-2021-suv-rental',
        'Spacious Honda CR-V 2021 perfect for family trips. Clean, comfortable, and well-maintained.',
        5000.00, 30000.00, 110000.00,
        'Westlands, Nairobi', -1.2674, 36.8108,
        ARRAY[
            'https://ik.imagekit.io/jsmasterypaul/listings/crv-main.jpg',
            'https://ik.imagekit.io/jsmasterypaul/listings/crv-interior.jpg'
        ],
        '{
            "year": 2021,
            "make": "Honda",
            "model": "CR-V",
            "transmission": "Automatic",
            "fuel_type": "Petrol",
            "seats": 7,
            "features": ["4WD", "Sunroof", "Leather Seats", "Navigation"]
        }'::jsonb,
        15000.00, true, 'approved'
    );

    -- Insert property listings
    INSERT INTO public.listings (
        owner_id, category_id, subcategory_id, title, slug,
        description, price_per_day, price_per_month,
        location, latitude, longitude, images, features,
        deposit_amount, instant_booking, status
    ) VALUES
    (
        v_owner_id, v_properties_id, v_apartments_id,
        'Luxury 3-Bedroom Apartment in Westlands',
        'luxury-3-bedroom-apartment-westlands',
        'Beautiful modern apartment with stunning city views. Fully furnished with high-end appliances. Located in the heart of Westlands.',
        NULL, 120000.00,
        'Westlands, Nairobi', -1.2674, 36.8108,
        ARRAY[
            'https://ik.imagekit.io/jsmasterypaul/listings/apt-main.jpg',
            'https://ik.imagekit.io/jsmasterypaul/listings/apt-bedroom.jpg',
            'https://ik.imagekit.io/jsmasterypaul/listings/apt-kitchen.jpg',
            'https://ik.imagekit.io/jsmasterypaul/listings/apt-bathroom.jpg'
        ],
        '{
            "bedrooms": 3,
            "bathrooms": 2,
            "parking": true,
            "wifi": true,
            "furnished": true,
            "security": "24/7",
            "amenities": ["Swimming Pool", "Gym", "Backup Generator", "DSTV"]
        }'::jsonb,
        120000.00, false, 'approved'
    );
END $$;
*/

-- ============================================
-- 4. SUBSCRIPTION PLANS (for reference)
-- ============================================

-- Example subscription plans data
/*
-- Basic Plan
{
    "plan_type": "basic",
    "price": 2000.00,
    "currency": "KES",
    "billing_cycle": "monthly",
    "max_listings": 5,
    "features": {
        "listings": 5,
        "photos_per_listing": 5,
        "featured_listings": 0,
        "priority_support": false,
        "analytics": false
    }
}

-- Premium Plan
{
    "plan_type": "premium",
    "price": 5000.00,
    "currency": "KES",
    "billing_cycle": "monthly",
    "max_listings": 20,
    "features": {
        "listings": 20,
        "photos_per_listing": 10,
        "featured_listings": 2,
        "priority_support": true,
        "analytics": true
    }
}

-- Enterprise Plan
{
    "plan_type": "enterprise",
    "price": 10000.00,
    "currency": "KES",
    "billing_cycle": "monthly",
    "max_listings": null,
    "features": {
        "listings": "unlimited",
        "photos_per_listing": 20,
        "featured_listings": 5,
        "priority_support": true,
        "analytics": true,
        "api_access": true
    }
}
*/

-- ============================================
-- NOTES
-- ============================================

/*
To use this mock data:

1. Run schema.sql first
2. Run helper-functions.sql
3. Create real users via the signup form
4. Get user UUIDs from user_profiles table
5. Replace 'your-user-uuid-here' in the listings section
6. Uncomment and run the listings INSERT statements

Example to get user UUIDs:
SELECT id, email, full_name FROM public.user_profiles;

Then use those UUIDs in the v_owner_id variable above.
*/

-- ============================================
-- END OF MOCK DATA
-- ============================================
