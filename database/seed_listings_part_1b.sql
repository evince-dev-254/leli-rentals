-- ============================================
-- SEED SAMPLE LISTINGS - PART 1B (Categories 4-6)
-- ============================================

DO $$
DECLARE
    v_owner_id UUID;
    v_sub_id UUID;
BEGIN
    -- Get specific owner ID for testing (1kihiupaul@gmail.com)
    SELECT id INTO v_owner_id FROM public.user_profiles WHERE email = '1kihiupaul@gmail.com' LIMIT 1;
    
    -- Fallback: Get any owner if specific user not found
    IF v_owner_id IS NULL THEN
        SELECT id INTO v_owner_id FROM public.user_profiles WHERE role = 'owner' LIMIT 1;
    END IF;
    
    -- Fallback: Get any user if no owner found
    IF v_owner_id IS NULL THEN
        SELECT id INTO v_owner_id FROM public.user_profiles LIMIT 1;
    END IF;

    IF v_owner_id IS NOT NULL THEN

        -- 4. ELECTRONICS
        INSERT INTO public.listings (owner_id, category_id, subcategory_id, title, slug, description, price_per_day, images, status, location) VALUES
        (v_owner_id, '44444444-4444-4444-4444-444444444444', (SELECT id FROM public.subcategories WHERE slug = 'computers' LIMIT 1), 'MacBook Pro M1', 'macbook-pro-' || substring(md5(random()::text) from 1 for 6), 'High performance laptop for editing.', 2000, ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=800'], 'approved', 'Kilimani, Nairobi'),
        (v_owner_id, '44444444-4444-4444-4444-444444444444', (SELECT id FROM public.subcategories WHERE slug = 'cameras' LIMIT 1), 'Canon 5D Mark IV', 'canon-5d-' || substring(md5(random()::text) from 1 for 6), 'Professional DSLR camera body.', 3500, ARRAY['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800'], 'approved', 'CBD, Nairobi'),
        (v_owner_id, '44444444-4444-4444-4444-444444444444', (SELECT id FROM public.subcategories WHERE slug = 'gaming' LIMIT 1), 'Sony PlayStation 5', 'ps5-console-' || substring(md5(random()::text) from 1 for 6), 'Gaming console with 2 controllers.', 1500, ARRAY['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=800'], 'approved', 'Westlands, Nairobi'),
        (v_owner_id, '44444444-4444-4444-4444-444444444444', (SELECT id FROM public.subcategories WHERE slug = 'audio' LIMIT 1), 'JBL PartyBox', 'jbl-partybox-' || substring(md5(random()::text) from 1 for 6), 'Massive sound for parties.', 2500, ARRAY['https://images.unsplash.com/photo-1629235921869-79a6d07d6d37?auto=format&fit=crop&q=80&w=800'], 'approved', 'Nyali, Mombasa'),
        (v_owner_id, '44444444-4444-4444-4444-444444444444', (SELECT id FROM public.subcategories WHERE slug = 'projectors' LIMIT 1), 'Projector 4K', 'projector-4k-' || substring(md5(random()::text) from 1 for 6), 'High definition projector.', 3000, ARRAY['https://images.unsplash.com/photo-1517604931442-7105376f2611?auto=format&fit=crop&q=80&w=800'], 'approved', 'Parklands, Nairobi'),
        (v_owner_id, '44444444-4444-4444-4444-444444444444', (SELECT id FROM public.subcategories WHERE slug = 'drones' LIMIT 1), 'Drone Mavic Air', 'drone-mavic-' || substring(md5(random()::text) from 1 for 6), 'Camera drone for aerial shots.', 4000, ARRAY['https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&q=80&w=800'], 'approved', 'Karen, Nairobi'),
        (v_owner_id, '44444444-4444-4444-4444-444444444444', (SELECT id FROM public.subcategories WHERE slug = 'computers' LIMIT 1), 'iPad Pro 12.9', 'ipad-pro-' || substring(md5(random()::text) from 1 for 6), 'Tablet for creative work.', 1500, ARRAY['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800'], 'approved', 'Lavington, Nairobi'),
        (v_owner_id, '44444444-4444-4444-4444-444444444444', (SELECT id FROM public.subcategories WHERE slug = 'gaming' LIMIT 1), 'VR Headset Quest 2', 'vr-quest-2-' || substring(md5(random()::text) from 1 for 6), 'Virtual reality experience.', 1200, ARRAY['https://images.unsplash.com/photo-1622979135225-d2ba269fb1bd?auto=format&fit=crop&q=80&w=800'], 'approved', 'Westlands, Nairobi'),
        (v_owner_id, '44444444-4444-4444-4444-444444444444', (SELECT id FROM public.subcategories WHERE slug = 'cameras' LIMIT 1), 'GoPro Hero 10', 'gopro-10-' || substring(md5(random()::text) from 1 for 6), 'Action camera.', 1000, ARRAY['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&q=80&w=800'], 'approved', 'Diani, Mombasa'),
        (v_owner_id, '44444444-4444-4444-4444-444444444444', (SELECT id FROM public.subcategories WHERE slug = 'audio' LIMIT 1), 'Noise Cancelling Headphones', 'headphones-sony-' || substring(md5(random()::text) from 1 for 6), 'Sony WH-1000XM4.', 500, ARRAY['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800'], 'approved', 'CBD, Nairobi');

        -- 5. FASHION & ACCESSORIES
        INSERT INTO public.listings (owner_id, category_id, subcategory_id, title, slug, description, price_per_day, images, status, location) VALUES
        (v_owner_id, '55555555-5555-5555-5555-555555555555', (SELECT id FROM public.subcategories WHERE slug = 'womens-wear' LIMIT 1), 'Wedding Gown', 'wedding-gown-' || substring(md5(random()::text) from 1 for 6), 'Elegant white wedding dress size M.', 5000, ARRAY['https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&q=80&w=800'], 'approved', 'Karen, Nairobi'),
        (v_owner_id, '55555555-5555-5555-5555-555555555555', (SELECT id FROM public.subcategories WHERE slug = 'mens-wear' LIMIT 1), 'Tuxedo Suit', 'tuxedo-suit-' || substring(md5(random()::text) from 1 for 6), 'Black slim fit tuxedo.', 2500, ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800'], 'approved', 'Westlands, Nairobi'),
        (v_owner_id, '55555555-5555-5555-5555-555555555555', (SELECT id FROM public.subcategories WHERE slug = 'accessories' LIMIT 1), 'Designer Handbag', 'gucci-bag-' || substring(md5(random()::text) from 1 for 6), 'Authentic luxury handbag.', 3000, ARRAY['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800'], 'approved', 'Lavington, Nairobi'),
        (v_owner_id, '55555555-5555-5555-5555-555555555555', (SELECT id FROM public.subcategories WHERE slug = 'jewelry' LIMIT 1), 'Gold Jewelry Set', 'gold-jewelry-' || substring(md5(random()::text) from 1 for 6), 'Necklace and earrings set.', 4000, ARRAY['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'], 'approved', 'Muthaiga, Nairobi'),
        (v_owner_id, '55555555-5555-5555-5555-555555555555', (SELECT id FROM public.subcategories WHERE slug = 'womens-wear' LIMIT 1), 'Evening Gown', 'evening-gown-red-' || substring(md5(random()::text) from 1 for 6), 'Red carpet ready dress.', 2000, ARRAY['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800'], 'approved', 'Kilimani, Nairobi'),
        (v_owner_id, '55555555-5555-5555-5555-555555555555', (SELECT id FROM public.subcategories WHERE slug = 'jewelry' LIMIT 1), 'Luxury Watch', 'rolex-rental-' || substring(md5(random()::text) from 1 for 6), 'Classic timepiece.', 5000, ARRAY['https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800'], 'approved', 'Westlands, Nairobi'),
        (v_owner_id, '55555555-5555-5555-5555-555555555555', (SELECT id FROM public.subcategories WHERE slug = 'mens-wear' LIMIT 1), 'Masai Shuka', 'masai-shuka-' || substring(md5(random()::text) from 1 for 6), 'Traditional wear.', 200, ARRAY['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800'], 'approved', 'City Market, Nairobi'),
        (v_owner_id, '55555555-5555-5555-5555-555555555555', (SELECT id FROM public.subcategories WHERE slug = 'mens-wear' LIMIT 1), 'Winter Jacket', 'winter-jacket-' || substring(md5(random()::text) from 1 for 6), 'Heavy jacket for cold weather travel.', 500, ARRAY['https://images.unsplash.com/photo-1551488852-d81a403b3560?auto=format&fit=crop&q=80&w=800'], 'approved', 'Ngong Road, Nairobi'),
        (v_owner_id, '55555555-5555-5555-5555-555555555555', (SELECT id FROM public.subcategories WHERE slug = 'accessories' LIMIT 1), 'High Heels', 'high-heels-' || substring(md5(random()::text) from 1 for 6), 'Designer stiletto heels size 7.', 800, ARRAY['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800'], 'approved', 'Westlands, Nairobi'),
        (v_owner_id, '55555555-5555-5555-5555-555555555555', (SELECT id FROM public.subcategories WHERE slug = 'costumes-fashion' LIMIT 1), 'Costume Set', 'superhero-costume-' || substring(md5(random()::text) from 1 for 6), 'Full body costume for parties.', 1500, ARRAY['https://images.unsplash.com/photo-1605218427368-35b80a37452d?auto=format&fit=crop&q=80&w=800'], 'approved', 'Langata, Nairobi');

        -- 6. ENTERTAINMENT
        INSERT INTO public.listings (owner_id, category_id, subcategory_id, title, slug, description, price_per_day, images, status, location) VALUES
        (v_owner_id, '66666666-6666-6666-6666-666666666666', (SELECT id FROM public.subcategories WHERE slug = 'dj-gear' LIMIT 1), 'DJ Controller', 'dj-controller-' || substring(md5(random()::text) from 1 for 6), 'Pioneer DDJ-400.', 2500, ARRAY['https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&q=80&w=800'], 'approved', 'Westlands, Nairobi'),
        (v_owner_id, '66666666-6666-6666-6666-666666666666', (SELECT id FROM public.subcategories WHERE slug = 'instruments' LIMIT 1), 'Acoustic Guitar', 'acoustic-guitar-' || substring(md5(random()::text) from 1 for 6), 'Yamaha F310.', 800, ARRAY['https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=800'], 'approved', 'Sarit Centre, Nairobi'),
        (v_owner_id, '66666666-6666-6666-6666-666666666666', (SELECT id FROM public.subcategories WHERE slug = 'instruments' LIMIT 1), 'Keyboard Piano', 'keyboard-piano-' || substring(md5(random()::text) from 1 for 6), 'Yamaha PSR Series.', 1500, ARRAY['https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800'], 'approved', 'Garden City, Nairobi'),
        (v_owner_id, '66666666-6666-6666-6666-666666666666', (SELECT id FROM public.subcategories WHERE slug = 'instruments' LIMIT 1), 'Drum Set', 'drum-set-' || substring(md5(random()::text) from 1 for 6), '5-piece drum kit.', 3000, ARRAY['https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&q=80&w=800'], 'approved', 'Langata, Nairobi'),
        (v_owner_id, '66666666-6666-6666-6666-666666666666', (SELECT id FROM public.subcategories WHERE slug = 'dj-gear' LIMIT 1), 'Karaoke Machine', 'karaoke-machine-' || substring(md5(random()::text) from 1 for 6), 'Portable party karaoke.', 2000, ARRAY['https://images.unsplash.com/photo-1534484374439-6b8cd79be97c?auto=format&fit=crop&q=80&w=800'], 'approved', 'Kilimani, Nairobi'),
        (v_owner_id, '66666666-6666-6666-6666-666666666666', (SELECT id FROM public.subcategories WHERE slug = 'games' LIMIT 1), 'Board Games Set', 'board-games-' || substring(md5(random()::text) from 1 for 6), 'Collection of 10 popular games.', 500, ARRAY['https://images.unsplash.com/photo-1610890716254-4b13891c3596?auto=format&fit=crop&q=80&w=800'], 'approved', 'CBD, Nairobi'),
        (v_owner_id, '66666666-6666-6666-6666-666666666666', (SELECT id FROM public.subcategories WHERE slug = 'inflatables' LIMIT 1), 'Bouncy Castle', 'bouncy-castle-' || substring(md5(random()::text) from 1 for 6), 'For kids parties.', 4000, ARRAY['https://images.unsplash.com/photo-1574635136894-358cb9f191b9?auto=format&fit=crop&q=80&w=800'], 'approved', 'Karen, Nairobi'),
        (v_owner_id, '66666666-6666-6666-6666-666666666666', (SELECT id FROM public.subcategories WHERE slug = 'instruments' LIMIT 1), 'Violin', 'violin-4-4-' || substring(md5(random()::text) from 1 for 6), 'Full size violin.', 1000, ARRAY['https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?auto=format&fit=crop&q=80&w=800'], 'approved', 'Westlands, Nairobi'),
        (v_owner_id, '66666666-6666-6666-6666-666666666666', (SELECT id FROM public.subcategories WHERE slug = 'party-lights' LIMIT 1), 'Stage Lights', 'stage-lights-' || substring(md5(random()::text) from 1 for 6), 'LED par lights set.', 1500, ARRAY['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800'], 'approved', 'Industrial Area, Nairobi'),
        (v_owner_id, '66666666-6666-6666-6666-666666666666', (SELECT id FROM public.subcategories WHERE slug = 'games' LIMIT 1), 'Video Poker Table', 'poker-table-' || substring(md5(random()::text) from 1 for 6), 'Professional table.', 3000, ARRAY['https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&q=80&w=800'], 'approved', 'Lavington, Nairobi');

    END IF;
END $$;
