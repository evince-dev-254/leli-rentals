-- ============================================
-- LELI RENTALS - HELPER SQL FUNCTIONS
-- ============================================
-- This file contains reusable SQL functions for common operations
-- Run this file AFTER running schema.sql

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to create a new listing (callable from application)
CREATE OR REPLACE FUNCTION create_listing(
    p_category_id UUID,
    p_subcategory_id UUID,
    p_title TEXT,
    p_description TEXT,
    p_price_per_day DECIMAL,
    p_location TEXT,
    p_latitude DECIMAL,
    p_longitude DECIMAL,
    p_images TEXT[],
    p_features JSONB
)
RETURNS UUID AS $$
DECLARE
    v_listing_id UUID;
    v_slug TEXT;
BEGIN
    -- Generate slug from title
    v_slug := lower(regexp_replace(p_title, '[^a-zA-Z0-9]+', '-', 'g'));
    v_slug := regexp_replace(v_slug, '^-+|-+$', '', 'g');
    
    -- Make slug unique by appending random string if needed
    WHILE EXISTS (SELECT 1 FROM public.listings WHERE slug = v_slug) LOOP
        v_slug := v_slug || '-' || substr(md5(random()::text), 1, 6);
    END LOOP;
    
    -- Insert listing
    INSERT INTO public.listings (
        owner_id,
        category_id,
        subcategory_id,
        title,
        slug,
        description,
        price_per_day,
        location,
        latitude,
        longitude,
        images,
        features
    ) VALUES (
        auth.uid(),
        p_category_id,
        p_subcategory_id,
        p_title,
        v_slug,
        p_description,
        p_price_per_day,
        p_location,
        p_latitude,
        p_longitude,
        p_images,
        p_features
    ) RETURNING id INTO v_listing_id;
    
    RETURN v_listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update profile with avatar
CREATE OR REPLACE FUNCTION update_profile(
    p_full_name TEXT DEFAULT NULL,
    p_phone TEXT DEFAULT NULL,
    p_avatar_url TEXT DEFAULT NULL,
    p_bio TEXT DEFAULT NULL,
    p_location TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.user_profiles
    SET 
        full_name = COALESCE(p_full_name, full_name),
        phone = COALESCE(p_phone, phone),
        avatar_url = COALESCE(p_avatar_url, avatar_url),
        bio = COALESCE(p_bio, bio),
        location = COALESCE(p_location, location),
        updated_at = NOW()
    WHERE id = auth.uid();
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to submit verification document
CREATE OR REPLACE FUNCTION submit_verification_document(
    p_document_type TEXT,
    p_document_url TEXT,
    p_document_number TEXT DEFAULT NULL,
    p_expires_at DATE DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_doc_id UUID;
BEGIN
    INSERT INTO public.verification_documents (
        user_id,
        document_type,
        document_url,
        document_number,
        expires_at
    ) VALUES (
        auth.uid(),
        p_document_type,
        p_document_url,
        p_document_number,
        p_expires_at
    ) RETURNING id INTO v_doc_id;
    
    RETURN v_doc_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's verification status
CREATE OR REPLACE FUNCTION get_verification_status()
RETURNS TABLE (
    document_type TEXT,
    status TEXT,
    submitted_at TIMESTAMPTZ,
    verified_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        vd.document_type,
        vd.status,
        vd.created_at as submitted_at,
        vd.verified_at
    FROM public.verification_documents vd
    WHERE vd.user_id = auth.uid()
    ORDER BY vd.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- END OF HELPER FUNCTIONS
-- ============================================

-- For usage examples, see: database/examples.sql
