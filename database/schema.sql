-- ============================================
-- LELI RENTALS - COMPREHENSIVE DATABASE SCHEMA
-- ============================================
-- This SQL script creates all necessary tables, indexes, and policies
-- for the Leli Rentals application using Supabase/PostgreSQL

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "cube";
CREATE EXTENSION IF NOT EXISTS "earthdistance";

-- ============================================
-- 1. USERS & AUTHENTICATION
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
    role TEXT DEFAULT 'renter' CHECK (role IN ('renter', 'owner', 'affiliate', 'admin')),
    account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'pending')),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_minimum_age CHECK (date_of_birth IS NULL OR date_of_birth <= CURRENT_DATE - INTERVAL '18 years')
);

-- ============================================
-- 2. CATEGORIES & SUBCATEGORIES
-- ============================================

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

-- ============================================
-- 3. LISTINGS
-- ============================================

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
    images TEXT[], -- Array of image URLs
    features JSONB, -- Flexible JSON for listing-specific features
    availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'rented', 'maintenance', 'unavailable')),
    min_rental_period INTEGER DEFAULT 1, -- in days
    max_rental_period INTEGER, -- in days
    deposit_amount DECIMAL(10, 2),
    insurance_required BOOLEAN DEFAULT FALSE,
    instant_booking BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3, 2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. BOOKINGS & RESERVATIONS
-- ============================================

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
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'refunded')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partially_paid', 'refunded', 'failed')),
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES public.user_profiles(id),
    cancelled_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. PAYMENTS & TRANSACTIONS
-- ============================================

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id),
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('booking_payment', 'deposit', 'refund', 'payout', 'subscription', 'fee')),
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'KES',
    payment_method TEXT CHECK (payment_method IN ('paystack', 'mpesa', 'card', 'bank_transfer', 'wallet')),
    payment_provider TEXT,
    provider_transaction_id TEXT,
    provider_reference TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. REVIEWS & RATINGS
-- ============================================

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    reviewer_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    pros TEXT,
    cons TEXT,
    images TEXT[],
    is_verified_booking BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    response TEXT, -- Owner's response
    responded_at TIMESTAMPTZ,
    status TEXT DEFAULT 'published' CHECK (status IN ('pending', 'published', 'hidden', 'flagged')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. FAVORITES / WISHLIST
-- ============================================

CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, listing_id)
);

-- ============================================
-- 8. MESSAGES & CHAT
-- ============================================

CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
    participant_1_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    participant_2_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(participant_1_id, participant_2_id, listing_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachments TEXT[],
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. SUBSCRIPTIONS (for Owners)
-- ============================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'premium', 'enterprise')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'suspended')),
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

-- ============================================
-- 10. AFFILIATES
-- ============================================

CREATE TABLE IF NOT EXISTS public.affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    email TEXT NOT NULL UNIQUE,
    invite_code TEXT UNIQUE NOT NULL,
    referral_code TEXT UNIQUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
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

CREATE TABLE IF NOT EXISTS public.affiliate_referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
    referred_user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    commission_amount DECIMAL(10, 2) DEFAULT 0,
    commission_status TEXT DEFAULT 'pending' CHECK (commission_status IN ('pending', 'approved', 'paid', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ
);

-- ============================================
-- 11. SUPPORT TICKETS
-- ============================================

CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT CHECK (category IN ('technical', 'billing', 'booking', 'account', 'other')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    assigned_to UUID REFERENCES public.user_profiles(id),
    attachments TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.support_ticket_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    attachments TEXT[],
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 12. NOTIFICATIONS
-- ============================================

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
-- 13. VERIFICATION DOCUMENTS (for Owners)
-- ============================================

CREATE TABLE IF NOT EXISTS public.verification_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('id_card', 'passport', 'drivers_license', 'business_license', 'proof_of_address')),
    document_url TEXT NOT NULL,
    document_number TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    verified_by UUID REFERENCES public.user_profiles(id),
    verified_at TIMESTAMPTZ,
    expires_at DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- User profiles
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);

-- Listings
CREATE INDEX idx_listings_owner ON public.listings(owner_id);
CREATE INDEX idx_listings_category ON public.listings(category_id);
CREATE INDEX idx_listings_subcategory ON public.listings(subcategory_id);
CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_listings_availability ON public.listings(availability_status);
CREATE INDEX idx_listings_featured ON public.listings(is_featured) WHERE is_featured = TRUE;
-- Geographic index for location-based searches (requires earthdistance extension)
-- If earthdistance is not available, comment this out and use separate lat/lng indexes
CREATE INDEX IF NOT EXISTS idx_listings_location ON public.listings USING GIST(ll_to_earth(latitude, longitude));
-- Alternative: Simple indexes for lat/lng if earthdistance is not available
-- CREATE INDEX IF NOT EXISTS idx_listings_latitude ON public.listings(latitude);
-- CREATE INDEX IF NOT EXISTS idx_listings_longitude ON public.listings(longitude);

-- Bookings
CREATE INDEX idx_bookings_listing ON public.bookings(listing_id);
CREATE INDEX idx_bookings_renter ON public.bookings(renter_id);
CREATE INDEX idx_bookings_owner ON public.bookings(owner_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_dates ON public.bookings(start_date, end_date);

-- Messages
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX idx_messages_unread ON public.messages(receiver_id, is_read) WHERE is_read = FALSE;

-- Reviews
CREATE INDEX idx_reviews_listing ON public.reviews(listing_id);
CREATE INDEX idx_reviews_reviewer ON public.reviews(reviewer_id);

-- Favorites
CREATE INDEX idx_favorites_user ON public.favorites(user_id);
CREATE INDEX idx_favorites_listing ON public.favorites(listing_id);

-- Notifications
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Enable insert for users based on user_id"
    ON public.user_profiles FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable read access for all users"
    ON public.user_profiles FOR SELECT 
    TO public 
    USING (true);

CREATE POLICY "Enable update for users based on user_id"
    ON public.user_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable delete for users based on user_id"
    ON public.user_profiles FOR DELETE
    TO authenticated
    USING (auth.uid() = id);

-- Listings Policies
CREATE POLICY "Anyone can view approved listings" ON public.listings
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Owners can view their own listings" ON public.listings
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Owners can create listings" ON public.listings
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own listings" ON public.listings
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own listings" ON public.listings
    FOR DELETE USING (auth.uid() = owner_id);

-- Bookings Policies
CREATE POLICY "Users can view their own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = renter_id OR auth.uid() = owner_id);

CREATE POLICY "Renters can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
    FOR UPDATE USING (auth.uid() = renter_id OR auth.uid() = owner_id);

-- Favorites Policies
CREATE POLICY "Users can view their own favorites" ON public.favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites" ON public.favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites" ON public.favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Messages Policies
CREATE POLICY "Users can view their own messages" ON public.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Reviews Policies
CREATE POLICY "Anyone can view published reviews" ON public.reviews
    FOR SELECT USING (status = 'published');

CREATE POLICY "Users can create reviews for their bookings" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = reviewer_id);

-- Notifications Policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON public.listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON public.affiliates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update listing rating
CREATE OR REPLACE FUNCTION update_listing_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.listings
    SET 
        rating_average = (
            SELECT AVG(rating)::DECIMAL(3,2)
            FROM public.reviews
            WHERE listing_id = NEW.listing_id AND status = 'published'
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM public.reviews
            WHERE listing_id = NEW.listing_id AND status = 'published'
        )
    WHERE id = NEW.listing_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_listing_rating_on_review
    AFTER INSERT OR UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_listing_rating();

-- ============================================
-- INITIAL DATA SEEDS (Optional)
-- ============================================

-- Insert default categories (example)
INSERT INTO public.categories (name, slug, description, display_order) VALUES
    ('Vehicles', 'vehicles', 'Cars, motorcycles, and other vehicles', 1),
    ('Electronics', 'electronics', 'Cameras, laptops, and gadgets', 2),
    ('Equipment', 'equipment', 'Tools and machinery', 3),
    ('Properties', 'properties', 'Homes and apartments', 4),
    ('Fashion', 'fashion', 'Clothing and accessories', 5),
    ('Events', 'events', 'Party supplies and event equipment', 6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- END OF SCHEMA
-- ============================================
