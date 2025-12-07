-- ============================================
-- LELI RENTALS - SQL EXAMPLES
-- ============================================
-- This file contains example queries and INSERT statements
-- DO NOT RUN THIS FILE - These are examples only!
-- Copy individual queries as needed

-- ============================================
-- 1. CREATE NEW LISTING (with ImageKit URLs)
-- ============================================

/*
-- Example: Insert a new listing with ImageKit image URLs
-- Replace 'user-uuid-here', 'category-uuid-here', etc. with actual UUIDs
INSERT INTO public.listings (
    owner_id,
    category_id,
    subcategory_id,
    title,
    slug,
    description,
    price_per_day,
    price_per_week,
    price_per_month,
    location,
    latitude,
    longitude,
    images,
    features,
    deposit_amount,
    insurance_required,
    instant_booking,
    min_rental_period,
    max_rental_period
) VALUES (
    auth.uid(), -- Current user
    'category-uuid-here'::UUID,
    'subcategory-uuid-here'::UUID,
    'Luxury 3-Bedroom Apartment in Westlands',
    'luxury-3-bedroom-apartment-westlands',
    'Beautiful modern apartment with stunning city views...',
    5000.00,
    30000.00,
    100000.00,
    'Westlands, Nairobi',
    -1.2674,
    36.8108,
    ARRAY[
        'https://ik.imagekit.io/jsmasterypaul/listings/apartment-main.jpg',
        'https://ik.imagekit.io/jsmasterypaul/listings/apartment-bedroom.jpg',
        'https://ik.imagekit.io/jsmasterypaul/listings/apartment-kitchen.jpg',
        'https://ik.imagekit.io/jsmasterypaul/listings/apartment-bathroom.jpg'
    ],
    '{
        "bedrooms": 3,
        "bathrooms": 2,
        "parking": true,
        "wifi": true,
        "furnished": true,
        "security": "24/7",
        "amenities": ["Swimming Pool", "Gym", "Backup Generator"]
    }'::jsonb,
    10000.00,
    false,
    true,
    1,
    30
);
*/

-- ============================================
-- 2. UPDATE PROFILE IMAGE (ImageKit URL)
-- ============================================

/*
-- Example: Update user profile avatar with ImageKit URL
UPDATE public.user_profiles
SET 
    avatar_url = 'https://ik.imagekit.io/jsmasterypaul/avatars/user-123.jpg',
    updated_at = NOW()
WHERE id = auth.uid();
*/

-- ============================================
-- 3. UPLOAD VERIFICATION DOCUMENT (ImageKit URL)
-- ============================================

/*
-- Example: Insert verification document with ImageKit URL
INSERT INTO public.verification_documents (
    user_id,
    document_type,
    document_url,
    document_number,
    expires_at
) VALUES (
    auth.uid(),
    'id_card',
    'https://ik.imagekit.io/jsmasterypaul/verifications/id-card-123.jpg',
    '12345678',
    '2030-12-31'
);
*/

-- ============================================
-- 4. ADD REVIEW WITH IMAGES (ImageKit URLs)
-- ============================================

/*
-- Example: Create a review with ImageKit image URLs
-- Replace 'listing-uuid-here' and 'booking-uuid-here' with actual UUIDs
INSERT INTO public.reviews (
    listing_id,
    booking_id,
    reviewer_id,
    rating,
    title,
    comment,
    pros,
    cons,
    images,
    is_verified_booking
) VALUES (
    'listing-uuid-here'::UUID,
    'booking-uuid-here'::UUID,
    auth.uid(),
    5,
    'Amazing place!',
    'The apartment exceeded all expectations. Clean, modern, and great location.',
    'Great location, modern amenities, responsive owner',
    'Parking can be tight during peak hours',
    ARRAY[
        'https://ik.imagekit.io/jsmasterypaul/reviews/review-1.jpg',
        'https://ik.imagekit.io/jsmasterypaul/reviews/review-2.jpg'
    ],
    true
);
*/

-- ============================================
-- 5. UPDATE LISTING IMAGES
-- ============================================

/*
-- Example: Add new images to existing listing
UPDATE public.listings
SET 
    images = images || ARRAY[
        'https://ik.imagekit.io/jsmasterypaul/listings/new-image-1.jpg',
        'https://ik.imagekit.io/jsmasterypaul/listings/new-image-2.jpg'
    ],
    updated_at = NOW()
WHERE id = 'listing-uuid-here'::UUID
AND owner_id = auth.uid();

-- Example: Replace all images
UPDATE public.listings
SET 
    images = ARRAY[
        'https://ik.imagekit.io/jsmasterypaul/listings/updated-main.jpg',
        'https://ik.imagekit.io/jsmasterypaul/listings/updated-2.jpg',
        'https://ik.imagekit.io/jsmasterypaul/listings/updated-3.jpg'
    ],
    updated_at = NOW()
WHERE id = 'listing-uuid-here'::UUID
AND owner_id = auth.uid();
*/

-- ============================================
-- 6. USEFUL QUERIES
-- ============================================

-- Get all listings by current user (owner dashboard)
/*
SELECT 
    l.id,
    l.title,
    l.slug,
    l.price_per_day,
    l.images[1] as main_image,
    l.status,
    l.availability_status,
    l.views_count,
    l.favorites_count,
    l.rating_average,
    l.rating_count,
    l.created_at,
    c.name as category_name,
    sc.name as subcategory_name
FROM public.listings l
LEFT JOIN public.categories c ON l.category_id = c.id
LEFT JOIN public.subcategories sc ON l.subcategory_id = sc.id
WHERE l.owner_id = auth.uid()
ORDER BY l.created_at DESC;
*/

-- Get user profile with avatar
/*
SELECT 
    id,
    email,
    full_name,
    phone,
    avatar_url,
    bio,
    location,
    role,
    account_status,
    email_verified,
    phone_verified,
    created_at
FROM public.user_profiles
WHERE id = auth.uid();
*/

-- Get all verification documents for current user
/*
SELECT 
    id,
    document_type,
    document_url,
    document_number,
    status,
    rejection_reason,
    verified_at,
    expires_at,
    created_at
FROM public.verification_documents
WHERE user_id = auth.uid()
ORDER BY created_at DESC;
*/

-- Get pending verification documents (admin view)
/*
SELECT 
    vd.id,
    vd.document_type,
    vd.document_url,
    vd.document_number,
    vd.created_at,
    up.email,
    up.full_name,
    up.avatar_url
FROM public.verification_documents vd
JOIN public.user_profiles up ON vd.user_id = up.id
WHERE vd.status = 'pending'
ORDER BY vd.created_at ASC;
*/

-- ============================================
-- 7. USING HELPER FUNCTIONS
-- ============================================

/*
-- Create listing using helper function
SELECT create_listing(
    'category-uuid'::UUID,
    'subcategory-uuid'::UUID,
    'Toyota Corolla 2020 - Daily Rental',
    'Well-maintained Toyota Corolla available for daily rental.',
    3500.00,
    'Nairobi CBD',
    -1.2864,
    36.8172,
    ARRAY[
        'https://ik.imagekit.io/jsmasterypaul/listings/corolla-main.jpg',
        'https://ik.imagekit.io/jsmasterypaul/listings/corolla-interior.jpg'
    ],
    '{
        "year": 2020,
        "make": "Toyota",
        "model": "Corolla",
        "transmission": "Automatic",
        "fuel_type": "Petrol",
        "seats": 5
    }'::jsonb
);

-- Update profile using helper function
SELECT update_profile(
    p_full_name := 'John Doe',
    p_avatar_url := 'https://ik.imagekit.io/jsmasterypaul/avatars/user-123.jpg'
);

-- Submit verification document using helper function
SELECT submit_verification_document(
    'id_card',
    'https://ik.imagekit.io/jsmasterypaul/verifications/id-123.jpg',
    '12345678',
    '2030-12-31'
);

-- Get verification status
SELECT * FROM get_verification_status();
*/

-- ============================================
-- END OF EXAMPLES
-- ============================================
