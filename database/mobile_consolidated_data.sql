-- ============================================
-- LELI RENTALS - CONSOLIDATED MOBILE DATABASE
-- ============================================
-- This file contains all database schema and seed data
-- consolidated for mobile application use
-- Generated: February 6, 2026
-- ============================================
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "cube";
CREATE EXTENSION IF NOT EXISTS "earthdistance";
-- ============================================
-- TABLE DEFINITIONS
-- ============================================
-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    date_of_birth DATE,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    role TEXT DEFAULT 'renter' CHECK (
        role IN ('renter', 'owner', 'affiliate', 'admin')
    ),
    account_status TEXT DEFAULT 'active' CHECK (
        account_status IN ('active', 'suspended', 'pending')
    ),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_minimum_age CHECK (
        date_of_birth IS NULL
        OR date_of_birth <= CURRENT_DATE - INTERVAL '18 years'
    )
);
-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Subcategories table
CREATE TABLE IF NOT EXISTS public.subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(category_id, slug)
);
-- Listings table
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id),
    subcategory_id UUID REFERENCES public.subcategories(id),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price_per_day DECIMAL(10, 2) NOT NULL,
    price_per_week DECIMAL(10, 2),
    price_per_month DECIMAL(10, 2),
    currency TEXT DEFAULT 'KES',
    location TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    images TEXT [],
    features JSONB,
    availability_status TEXT DEFAULT 'available' CHECK (
        availability_status IN (
            'available',
            'rented',
            'maintenance',
            'unavailable'
        )
    ),
    min_rental_period INTEGER DEFAULT 1,
    max_rental_period INTEGER,
    deposit_amount DECIMAL(10, 2),
    insurance_required BOOLEAN DEFAULT FALSE,
    instant_booking BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3, 2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'pending' CHECK (
        status IN ('pending', 'approved', 'rejected', 'archived')
    ),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    renter_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.user_profiles(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    price_per_day DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    service_fee DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    deposit_amount DECIMAL(10, 2),
    currency TEXT DEFAULT 'KES',
    status TEXT DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'confirmed',
            'active',
            'completed',
            'cancelled',
            'refunded'
        )
    ),
    payment_status TEXT DEFAULT 'pending' CHECK (
        payment_status IN (
            'pending',
            'paid',
            'partially_paid',
            'refunded',
            'failed'
        )
    ),
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES public.user_profiles(id),
    cancelled_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE
    SET NULL,
        user_id UUID NOT NULL REFERENCES public.user_profiles(id),
        transaction_type TEXT NOT NULL CHECK (
            transaction_type IN (
                'booking_payment',
                'deposit',
                'refund',
                'payout',
                'subscription',
                'fee'
            )
        ),
        amount DECIMAL(10, 2) NOT NULL,
        currency TEXT DEFAULT 'KES',
        payment_method TEXT CHECK (
            payment_method IN (
                'paystack',
                'mpesa',
                'card',
                'bank_transfer',
                'wallet'
            )
        ),
        payment_provider TEXT,
        provider_transaction_id TEXT,
        provider_reference TEXT,
        status TEXT DEFAULT 'pending' CHECK (
            status IN (
                'pending',
                'processing',
                'completed',
                'failed',
                'refunded',
                'cancelled'
            )
        ),
        metadata JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE
    SET NULL,
        reviewer_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (
            rating >= 1
            AND rating <= 5
        ),
        title TEXT,
        comment TEXT,
        pros TEXT,
        cons TEXT,
        images TEXT [],
        is_verified_booking BOOLEAN DEFAULT FALSE,
        helpful_count INTEGER DEFAULT 0,
        response TEXT,
        responded_at TIMESTAMPTZ,
        status TEXT DEFAULT 'published' CHECK (
            status IN ('pending', 'published', 'hidden', 'flagged')
        ),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, listing_id)
);
-- Conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES public.listings(id) ON DELETE
    SET NULL,
        participant_1_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
        participant_2_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
        last_message_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(participant_1_id, participant_2_id, listing_id)
);
-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachments TEXT [],
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'premium', 'enterprise')),
    status TEXT DEFAULT 'active' CHECK (
        status IN ('active', 'cancelled', 'expired', 'suspended')
    ),
    price DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'KES',
    billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
    max_listings INTEGER,
    features JSONB,
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    auto_renew BOOLEAN DEFAULT TRUE,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Affiliates table
CREATE TABLE IF NOT EXISTS public.affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE
    SET NULL,
        email TEXT NOT NULL UNIQUE,
        invite_code TEXT UNIQUE NOT NULL,
        referral_code TEXT UNIQUE,
        status TEXT DEFAULT 'pending' CHECK (
            status IN ('pending', 'active', 'suspended', 'rejected')
        ),
        commission_rate DECIMAL(5, 2) DEFAULT 10.00,
        total_referrals INTEGER DEFAULT 0,
        total_earnings DECIMAL(10, 2) DEFAULT 0,
        pending_earnings DECIMAL(10, 2) DEFAULT 0,
        paid_earnings DECIMAL(10, 2) DEFAULT 0,
        payment_method TEXT,
        payment_details JSONB,
        invited_by UUID REFERENCES public.user_profiles(id),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Affiliate referrals table
CREATE TABLE IF NOT EXISTS public.affiliate_referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
    referred_user_id UUID REFERENCES public.user_profiles(id) ON DELETE
    SET NULL,
        booking_id UUID REFERENCES public.bookings(id) ON DELETE
    SET NULL,
        commission_amount DECIMAL(10, 2) DEFAULT 0,
        commission_status TEXT DEFAULT 'pending' CHECK (
            commission_status IN ('pending', 'approved', 'paid', 'cancelled')
        ),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        paid_at TIMESTAMPTZ
);
-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_listings_owner ON public.listings(owner_id);
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_subcategory ON public.listings(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_availability ON public.listings(availability_status);
CREATE INDEX IF NOT EXISTS idx_listings_featured ON public.listings(is_featured)
WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_bookings_listing ON public.bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_bookings_renter ON public.bookings(renter_id);
CREATE INDEX IF NOT EXISTS idx_bookings_owner ON public.bookings(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON public.messages(receiver_id, is_read)
WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_reviews_listing ON public.reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON public.reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_listing ON public.favorites(listing_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read)
WHERE is_read = FALSE;
-- ============================================
-- SEED DATA - CATEGORIES
-- ============================================
INSERT INTO public.categories (
        id,
        name,
        slug,
        description,
        display_order,
        is_active,
        created_at,
        updated_at
    )
VALUES (
        '11111111-1111-1111-1111-111111111111',
        'Vehicles',
        'vehicles',
        'Cars, motorcycles, trucks, and more for your transportation needs',
        1,
        true,
        NOW(),
        NOW()
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Living Spaces',
        'living',
        'Homes, apartments, and vacation stays',
        2,
        true,
        NOW(),
        NOW()
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'Equipment & Tools',
        'equipment',
        'Professional tools and machinery for any project',
        3,
        true,
        NOW(),
        NOW()
    ),
    (
        '44444444-4444-4444-4444-444444444444',
        'Electronics',
        'electronics',
        'Gadgets, cameras, and tech gear for rent',
        4,
        true,
        NOW(),
        NOW()
    ),
    (
        '55555555-5555-5555-5555-555555555555',
        'Fashion & Accessories',
        'fashion',
        'Designer clothing, accessories, and jewelry',
        5,
        true,
        NOW(),
        NOW()
    ),
    (
        '66666666-6666-6666-6666-666666666666',
        'Entertainment',
        'entertainment',
        'Music instruments, gaming, and party equipment',
        6,
        true,
        NOW(),
        NOW()
    ),
    (
        '77777777-7777-7777-7777-777777777777',
        'Utility Spaces',
        'utility',
        'Venues and spaces for all occasions',
        7,
        true,
        NOW(),
        NOW()
    ),
    (
        '88888888-8888-8888-8888-888888888888',
        'Photography',
        'photography',
        'Cameras, lighting, and studio equipment',
        8,
        true,
        NOW(),
        NOW()
    ),
    (
        '99999999-9999-9999-9999-999999999999',
        'Fitness & Sports',
        'fitness',
        'Gym equipment and sports gear',
        9,
        true,
        NOW(),
        NOW()
    ),
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'Baby & Kids',
        'baby',
        'Strollers, cribs, and children''s items',
        10,
        true,
        NOW(),
        NOW()
    ),
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'Business Spaces',
        'business',
        'Professional spaces for businesses and entrepreneurs',
        11,
        true,
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO NOTHING;
-- ============================================
-- SEED DATA - SUBCATEGORIES
-- ============================================
INSERT INTO public.subcategories (
        category_id,
        name,
        slug,
        description,
        display_order
    )
VALUES -- VEHICLES
    (
        '11111111-1111-1111-1111-111111111111',
        'Sedans',
        'sedans',
        'Comfortable sedans for daily use',
        1
    ),
    (
        '11111111-1111-1111-1111-111111111111',
        'SUVs',
        'suvs',
        'Spacious SUVs for families',
        2
    ),
    (
        '11111111-1111-1111-1111-111111111111',
        'Luxury Cars',
        'luxury-cars',
        'Premium vehicles for special occasions',
        3
    ),
    (
        '11111111-1111-1111-1111-111111111111',
        'Motorcycles',
        'motorcycles',
        'Bikes and cruisers',
        4
    ),
    (
        '11111111-1111-1111-1111-111111111111',
        'Trucks',
        'trucks',
        'For transporting goods',
        5
    ),
    (
        '11111111-1111-1111-1111-111111111111',
        'Vans',
        'vans',
        'Group transport vehicles',
        6
    ),
    -- LIVING SPACES
    (
        '22222222-2222-2222-2222-222222222222',
        'Apartments',
        'apartments',
        'City living spaces',
        1
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Villas',
        'villas',
        'Luxury standalone homes',
        2
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Cottages',
        'cottages',
        'Cozy getaways',
        3
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Shared Rooms',
        'shared-rooms',
        'Budget friendly options',
        4
    ),
    -- EQUIPMENT & TOOLS
    (
        '33333333-3333-3333-3333-333333333333',
        'Power Tools',
        'power-tools',
        'Drills, saws, and sanders',
        1
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'Construction',
        'construction',
        'Mixers, generators, and scaffolding',
        2
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'Gardening',
        'gardening',
        'Mowers and trimmers',
        3
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'Cleaning',
        'cleaning',
        'Pressure washers and vacuums',
        4
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'Ladders',
        'ladders',
        'Ladders and platforms',
        5
    ),
    -- ELECTRONICS
    (
        '44444444-4444-4444-4444-444444444444',
        'Cameras',
        'cameras',
        'DSLR and professional cameras',
        1
    ),
    (
        '44444444-4444-4444-4444-444444444444',
        'Laptops',
        'laptops',
        'MacBooks and PCs',
        2
    ),
    (
        '44444444-4444-4444-4444-444444444444',
        'Audio Equipment',
        'audio',
        'Speakers and microphones',
        3
    ),
    (
        '44444444-4444-4444-4444-444444444444',
        'Gaming Consoles',
        'gaming',
        'Consoles and VR',
        4
    ),
    (
        '44444444-4444-4444-4444-444444444444',
        'Drones',
        'drones',
        'Aerial photography',
        5
    ),
    -- FASHION & ACCESSORIES
    (
        '55555555-5555-5555-5555-555555555555',
        'Men''s Wear',
        'mens-wear',
        'Suits and tuxedos',
        1
    ),
    (
        '55555555-5555-5555-5555-555555555555',
        'Women''s Wear',
        'womens-wear',
        'Gowns and dresses',
        2
    ),
    (
        '55555555-5555-5555-5555-555555555555',
        'Jewelry',
        'jewelry',
        'Watches and necklaces',
        3
    ),
    (
        '55555555-5555-5555-5555-555555555555',
        'Designer Bags',
        'bags',
        'Handbags and accessories',
        4
    ),
    -- ENTERTAINMENT
    (
        '66666666-6666-6666-6666-666666666666',
        'Musical Instruments',
        'instruments',
        'Guitars, drums, pianos',
        1
    ),
    (
        '66666666-6666-6666-6666-666666666666',
        'DJ Equipment',
        'dj-gear',
        'Decks and mixers',
        2
    ),
    (
        '66666666-6666-6666-6666-666666666666',
        'Party Lights',
        'party-lights',
        'Lasers and spots',
        3
    ),
    (
        '66666666-6666-6666-6666-666666666666',
        'Games',
        'games',
        'Board games and arcade',
        4
    ),
    -- UTILITY SPACES
    (
        '77777777-7777-7777-7777-777777777777',
        'Wedding Venues',
        'wedding-venues',
        'Gardens and halls',
        1
    ),
    (
        '77777777-7777-7777-7777-777777777777',
        'Conference Rooms',
        'corporate-spaces',
        'Meeting rooms and conference halls',
        2
    ),
    (
        '77777777-7777-7777-7777-777777777777',
        'Party Venues',
        'party-venues',
        'Clubs and lounges',
        3
    ),
    -- PHOTOGRAPHY
    (
        '88888888-8888-8888-8888-888888888888',
        'DSLR Cameras',
        'dslr',
        'Professional DSLR cameras',
        1
    ),
    (
        '88888888-8888-8888-8888-888888888888',
        'Lenses',
        'lenses',
        'Prime and zoom lenses',
        2
    ),
    (
        '88888888-8888-8888-8888-888888888888',
        'Lighting',
        'lighting-photo',
        'Strobes and continuous',
        3
    ),
    (
        '88888888-8888-8888-8888-888888888888',
        'Tripods',
        'tripods',
        'Stands and stabilizers',
        4
    ),
    -- FITNESS & SPORTS
    (
        '99999999-9999-9999-9999-999999999999',
        'Gym Equipment',
        'gym-equipment',
        'Treadmills and weights',
        1
    ),
    (
        '99999999-9999-9999-9999-999999999999',
        'Outdoor Sports',
        'outdoor-sports',
        'Camping and hiking',
        2
    ),
    (
        '99999999-9999-9999-9999-999999999999',
        'Team Sports',
        'team-sports',
        'Football and basketball',
        3
    ),
    (
        '99999999-9999-9999-9999-999999999999',
        'Yoga',
        'yoga',
        'Mats and blocks',
        4
    ),
    -- BABY & KIDS
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'Strollers',
        'strollers',
        'Travel systems',
        1
    ),
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'Car Seats',
        'car-seats',
        'Safety seats',
        2
    ),
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'Baby Furniture',
        'baby-furniture',
        'Cribs and high chairs',
        3
    ),
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'Toys',
        'toys',
        'Educational and fun',
        4
    ),
    -- BUSINESS SPACES
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'Private Offices',
        'offices',
        'Desks and private rooms',
        1
    ),
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'Coworking Desks',
        'coworking',
        'Shared workspace',
        2
    ),
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'Warehouses',
        'warehouses',
        'Storage and distribution',
        3
    ),
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'Showrooms',
        'showrooms',
        'Display spaces',
        4
    ) ON CONFLICT (category_id, slug) DO NOTHING;
-- ============================================
-- CATEGORY UUID MAPPING VIEW
-- ============================================
CREATE OR REPLACE VIEW category_id_mapping AS
SELECT 'vehicles' as string_id,
    '11111111-1111-1111-1111-111111111111'::uuid as uuid_id,
    'Vehicles' as name
UNION ALL
SELECT 'living',
    '22222222-2222-2222-2222-222222222222'::uuid,
    'Living Spaces'
UNION ALL
SELECT 'equipment',
    '33333333-3333-3333-3333-333333333333'::uuid,
    'Equipment & Tools'
UNION ALL
SELECT 'electronics',
    '44444444-4444-4444-4444-444444444444'::uuid,
    'Electronics'
UNION ALL
SELECT 'fashion',
    '55555555-5555-5555-5555-555555555555'::uuid,
    'Fashion & Accessories'
UNION ALL
SELECT 'entertainment',
    '66666666-6666-6666-6666-666666666666'::uuid,
    'Entertainment'
UNION ALL
SELECT 'utility',
    '77777777-7777-7777-7777-777777777777'::uuid,
    'Utility Spaces'
UNION ALL
SELECT 'photography',
    '88888888-8888-8888-8888-888888888888'::uuid,
    'Photography'
UNION ALL
SELECT 'fitness',
    '99999999-9999-9999-9999-999999999999'::uuid,
    'Fitness & Sports'
UNION ALL
SELECT 'baby',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
    'Baby & Kids'
UNION ALL
SELECT 'business',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
    'Business Spaces';
-- ============================================
-- END OF CONSOLIDATED MOBILE DATABASE
-- ============================================
-- 
-- NOTES:
-- 1. This file contains schema and seed data only
-- 2. RLS policies are excluded for mobile - handle auth client-side
-- 3. Triggers and functions are excluded - implement in application logic
-- 4. Sample listings are excluded - will be fetched from API
-- 5. Use Supabase client libraries for authentication
-- 6. Category UUIDs are fixed for consistency across platforms
-- ============================================