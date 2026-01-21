-- ==============================================================================
-- SUPABASE OPTIMIZATION MIGRATION (Phase 6 - ZERO-OVERLAP REFINEMENT)
-- Resolves the final "Multiple Permissive Policies" by separating roles.
-- ==============================================================================

-- 1. SECURITY: Set fixed search_path for critical functions
ALTER FUNCTION public.is_admin() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.update_listing_rating() SET search_path = public;
ALTER FUNCTION public.create_listing(uuid, uuid, text, text, numeric, text, numeric, numeric, text[], jsonb) SET search_path = public;
ALTER FUNCTION public.update_profile(text, text, text, text, text) SET search_path = public;
ALTER FUNCTION public.submit_verification_document(text, text, text, date) SET search_path = public;
ALTER FUNCTION public.get_verification_status() SET search_path = public;
ALTER FUNCTION public.check_verification_deadlines() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.handle_new_user_referral() SET search_path = public;
ALTER FUNCTION public.calculate_affiliate_commission(uuid, numeric, uuid) SET search_path = public;
ALTER FUNCTION public.get_available_balance(uuid, varchar) SET search_path = public;

-- 2. SECURITY: Force Security Invoker View
DROP VIEW IF EXISTS public.category_id_mapping;
CREATE OR REPLACE VIEW public.category_id_mapping WITH (security_invoker = on) AS 
SELECT id, name FROM public.categories;
ALTER VIEW public.category_id_mapping OWNER TO postgres;

-- 3. SECURITY: Extension Schema Hardening
CREATE SCHEMA IF NOT EXISTS extensions;
DO $$ 
BEGIN
    EXECUTE 'ALTER EXTENSION cube SET SCHEMA extensions';
    EXECUTE 'ALTER EXTENSION earthdistance SET SCHEMA extensions';
EXCEPTION WHEN OTHERS THEN 
    RAISE NOTICE 'Extension schema move skipped or failed for some extensions.';
END $$;

-- Safe attempt for pg_net (Supabase system extension)
DO $$ 
BEGIN
    EXECUTE 'ALTER EXTENSION pg_net SET SCHEMA extensions';
EXCEPTION WHEN OTHERS THEN 
    RAISE NOTICE 'Skipping pg_net schema move as it might be restricted by Supabase.';
END $$;

-- 4. PERFORMANCE & SECURITY: Nuclear Reset of ALL RLS Policies
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN 
    FOR policy_record IN (
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_record.policyname, policy_record.tablename);
    END LOOP;
END $$;

-- 5. ZERO-OVERLAP RLS REFINEMENT
-- We use 'anon' for гостей and 'authenticated' for users. 
-- Since a user cannot be both at the same time in Supabase logic, 
-- this eliminates the "multiple permissive policies" warning perfectly.

-- [User Profiles]
CREATE POLICY "profiles_anon_read" ON public.user_profiles FOR SELECT TO anon USING (true);
CREATE POLICY "profiles_auth_master" ON public.user_profiles FOR ALL TO authenticated 
USING (true) WITH CHECK ((SELECT public.is_admin()) OR (SELECT auth.uid()) = id);

-- [Listings]
CREATE POLICY "listings_anon_read" ON public.listings FOR SELECT TO anon USING (status = 'approved');
CREATE POLICY "listings_auth_master" ON public.listings FOR ALL TO authenticated 
USING ((SELECT public.is_admin()) OR (SELECT auth.uid()) = owner_id OR status = 'approved') 
WITH CHECK ((SELECT public.is_admin()) OR (SELECT auth.uid()) = owner_id);

-- [Bookings]
CREATE POLICY "bookings_auth_master" ON public.bookings FOR ALL TO authenticated 
USING ((SELECT public.is_admin()) OR (SELECT auth.uid()) = renter_id OR (SELECT auth.uid()) = owner_id)
WITH CHECK ((SELECT public.is_admin()) OR (SELECT auth.uid()) = renter_id);

-- [Categories & Subcategories]
CREATE POLICY "categories_anon_read" ON public.categories FOR SELECT TO anon USING (true);
CREATE POLICY "categories_auth_master" ON public.categories FOR ALL TO authenticated 
USING (true) WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "subcategories_anon_read" ON public.subcategories FOR SELECT TO anon USING (true);
CREATE POLICY "subcategories_auth_master" ON public.subcategories FOR ALL TO authenticated 
USING (true) WITH CHECK ((SELECT public.is_admin()));

-- [Support Tickets & Messages]
CREATE POLICY "tickets_auth_master" ON public.support_tickets FOR ALL TO authenticated 
USING ((SELECT public.is_admin()) OR (SELECT auth.uid()) = user_id);

CREATE POLICY "ticket_messages_auth_master" ON public.support_ticket_messages FOR ALL TO authenticated 
USING ((SELECT public.is_admin()) OR EXISTS (SELECT 1 FROM public.support_tickets WHERE id = ticket_id AND user_id = (SELECT auth.uid())));

-- [Conversations & Messages]
CREATE POLICY "conversations_auth_master" ON public.conversations FOR ALL TO authenticated 
USING ((SELECT auth.uid()) = participant_1_id OR (SELECT auth.uid()) = participant_2_id);

CREATE POLICY "messages_auth_master" ON public.messages FOR ALL TO authenticated 
USING ((SELECT auth.uid()) = sender_id OR (SELECT auth.uid()) = receiver_id)
WITH CHECK ((SELECT auth.uid()) = sender_id);

-- [Verification Documents]
CREATE POLICY "verification_auth_master" ON public.verification_documents FOR ALL TO authenticated 
USING ((SELECT public.is_admin()) OR (SELECT auth.uid()) = user_id);

-- [Affiliates & Commissions]
CREATE POLICY "affiliates_auth_master" ON public.affiliates FOR ALL TO authenticated 
USING ((SELECT public.is_admin()) OR (SELECT auth.uid()) = user_id);

CREATE POLICY "commissions_auth_master" ON public.affiliate_commissions FOR ALL TO authenticated 
USING ((SELECT public.is_admin()) OR (SELECT auth.uid()) = affiliate_id);

-- [Finances: Payments & Withdrawals]
CREATE POLICY "payments_auth_master" ON public.payments FOR ALL TO authenticated 
USING ((SELECT public.is_admin()) OR (SELECT auth.uid()) = user_id);

CREATE POLICY "payout_requests_auth_master" ON public.payout_requests FOR ALL TO authenticated 
USING ((SELECT public.is_admin()) OR (SELECT auth.uid()) = user_id);

CREATE POLICY "withdrawals_auth_master" ON public.withdrawals FOR ALL TO authenticated 
USING ((SELECT public.is_admin()) OR (SELECT auth.uid()) = user_id);

CREATE POLICY "affiliate_withdrawals_auth_master" ON public.affiliate_withdrawals FOR ALL TO authenticated 
USING ((SELECT public.is_admin()) OR affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = (SELECT auth.uid())));

-- [Misc: Notifications, Drafts, Settings]
CREATE POLICY "notifications_auth_master" ON public.notifications FOR ALL TO authenticated 
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "drafts_auth_master" ON public.listing_drafts FOR ALL TO authenticated 
USING ((SELECT auth.uid()) = owner_id);

CREATE POLICY "admin_settings_anon_read" ON public.admin_settings FOR SELECT TO anon 
USING (key IN ('paystack_public_key', 'site_name', 'support_email', 'support_phone', 'default_currency'));
CREATE POLICY "admin_settings_auth_master" ON public.admin_settings FOR ALL TO authenticated 
USING ((SELECT public.is_admin()) OR key IN ('paystack_public_key', 'site_name', 'support_email', 'support_phone', 'default_currency'));

-- [Subscriptions]
CREATE POLICY "subscriptions_auth_master" ON public.subscriptions FOR ALL TO authenticated 
USING ((SELECT public.is_admin()) OR (SELECT auth.uid()) = user_id);

-- [Reviews]
CREATE POLICY "reviews_anon_read" ON public.reviews FOR SELECT TO anon USING (status = 'published');
CREATE POLICY "reviews_auth_master" ON public.reviews FOR ALL TO authenticated 
USING ((SELECT public.is_admin()) OR (SELECT auth.uid()) = reviewer_id OR status = 'published')
WITH CHECK ((SELECT public.is_admin()) OR (SELECT auth.uid()) = reviewer_id);

-- [Favorites]
CREATE POLICY "favorites_auth_master" ON public.favorites FOR ALL TO authenticated 
USING ((SELECT auth.uid()) = user_id);

-- [Transactions]
CREATE POLICY "transactions_auth_master" ON public.transactions FOR ALL TO authenticated 
USING ((SELECT public.is_admin()) OR (SELECT auth.uid()) = user_id);


-- 6. PERFORMANCE: Final Index Cleanup
DROP INDEX IF EXISTS public.idx_bookings_listing; 
DROP INDEX IF EXISTS public.idx_bookings_owner; 
DROP INDEX IF EXISTS public.idx_bookings_renter; 
DROP INDEX IF EXISTS public.idx_favorites_listing; 
DROP INDEX IF EXISTS public.idx_favorites_user; 
DROP INDEX IF EXISTS public.idx_listings_availability; 
DROP INDEX IF EXISTS public.idx_listings_category; 
DROP INDEX IF EXISTS public.idx_listings_owner; 
DROP INDEX IF EXISTS public.idx_listings_subcategory; 
DROP INDEX IF EXISTS public.idx_messages_conversation; 
DROP INDEX IF EXISTS public.idx_messages_receiver; 
DROP INDEX IF EXISTS public.idx_messages_sender; 
DROP INDEX IF EXISTS public.idx_notifications_user; 
DROP INDEX IF EXISTS public.idx_notifications_is_read; 
DROP INDEX IF EXISTS public.idx_reviews_listing; 
DROP INDEX IF EXISTS public.idx_reviews_reviewer; 

-- Trigger reload
NOTIFY pgrst, 'reload schema';
