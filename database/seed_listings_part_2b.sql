-- ============================================
-- SEED SAMPLE LISTINGS - PART 2B (Categories 10-12)
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

        -- 10. BABY & KIDS
        INSERT INTO public.listings (owner_id, category_id, subcategory_id, title, slug, description, price_per_day, images, status, location) VALUES
        (v_owner_id, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM public.subcategories WHERE slug = 'strollers' LIMIT 1), 'Travel Stroller', 'stroller-' || substring(md5(random()::text) from 1 for 6), 'Compact foldable stroller.', 800, ARRAY['https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800'], 'approved', 'Westlands, Nairobi'),
        (v_owner_id, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM public.subcategories WHERE slug = 'car-seats' LIMIT 1), 'Car Seat', 'car-seat-' || substring(md5(random()::text) from 1 for 6), 'Safe car seat for infants.', 600, ARRAY['https://images.unsplash.com/photo-1520692850980-8742b6623631?auto=format&fit=crop&q=80&w=800'], 'approved', 'Kilimani, Nairobi'),
        (v_owner_id, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM public.subcategories WHERE slug = 'baby-furniture' LIMIT 1), 'Baby Crib', 'baby-crib-' || substring(md5(random()::text) from 1 for 6), 'Portable travel crib.', 1000, ARRAY['https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800'], 'approved', 'Lavington, Nairobi'),
        (v_owner_id, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM public.subcategories WHERE slug = 'baby-furniture' LIMIT 1), 'High Chair', 'high-chair-' || substring(md5(random()::text) from 1 for 6), 'Feeding chair.', 400, ARRAY['https://images.unsplash.com/photo-1522858807900-5e60802c0bde?auto=format&fit=crop&q=80&w=800'], 'approved', 'South C, Nairobi'),
        (v_owner_id, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM public.subcategories WHERE slug = 'toys' LIMIT 1), 'Kids Bicycle', 'kids-bike-' || substring(md5(random()::text) from 1 for 6), 'Bike with training wheels.', 500, ARRAY['https://images.unsplash.com/photo-1563200782-b7a4216839af?auto=format&fit=crop&q=80&w=800'], 'approved', 'Langata, Nairobi'),
        (v_owner_id, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM public.subcategories WHERE slug = 'toys' LIMIT 1), 'Toy Car', 'toy-car-electric-' || substring(md5(random()::text) from 1 for 6), 'Electric ride-on car.', 1500, ARRAY['https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800'], 'approved', 'Karen, Nairobi'),
        (v_owner_id, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM public.subcategories WHERE slug = 'feeding' LIMIT 1), 'Breast Pump', 'breast-pump-' || substring(md5(random()::text) from 1 for 6), 'Electric breast pump.', 800, ARRAY['https://images.unsplash.com/photo-1628146950275-d14c278c772e?auto=format&fit=crop&q=80&w=800'], 'approved', 'Parklands, Nairobi'),
        (v_owner_id, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM public.subcategories WHERE slug = 'baby-furniture' LIMIT 1), 'Baby Monitor', 'baby-monitor-' || substring(md5(random()::text) from 1 for 6), 'Video baby monitor.', 400, ARRAY['https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800'], 'approved', 'Westlands, Nairobi'),
        (v_owner_id, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM public.subcategories WHERE slug = 'baby-furniture' LIMIT 1), 'Playpen', 'playpen-' || substring(md5(random()::text) from 1 for 6), 'Safe play area.', 600, ARRAY['https://images.unsplash.com/photo-1563200782-b7a4216839af?auto=format&fit=crop&q=80&w=800'], 'approved', 'South B, Nairobi'),
        (v_owner_id, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM public.subcategories WHERE slug = 'feeding' LIMIT 1), 'Bottle Sterilizer', 'sterilizer-' || substring(md5(random()::text) from 1 for 6), 'Steam sterilizer.', 300, ARRAY['https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800'], 'approved', 'Buruburu, Nairobi');

        -- 11. OFFICE & BUSINESS
        INSERT INTO public.listings (owner_id, category_id, subcategory_id, title, slug, description, price_per_day, images, status, location) VALUES
        (v_owner_id, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (SELECT id FROM public.subcategories WHERE slug = 'office-furniture' LIMIT 1), 'Ergonomic Chair', 'office-chair-' || substring(md5(random()::text) from 1 for 6), 'Comfortable work chair.', 500, ARRAY['https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800'], 'approved', 'Westlands, Nairobi'),
        (v_owner_id, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (SELECT id FROM public.subcategories WHERE slug = 'office-furniture' LIMIT 1), 'Office Desk', 'office-desk-' || substring(md5(random()::text) from 1 for 6), 'Large wooden desk.', 800, ARRAY['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800'], 'approved', 'Kilimani, Nairobi'),
        (v_owner_id, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (SELECT id FROM public.subcategories WHERE slug = 'office-electronics' LIMIT 1), 'Printer Scanner', 'printer-canon-' || substring(md5(random()::text) from 1 for 6), 'Multifunction printer.', 1000, ARRAY['https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800'], 'approved', 'CBD, Nairobi'),
        (v_owner_id, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (SELECT id FROM public.subcategories WHERE slug = 'meeting-supplies' LIMIT 1), 'Whiteboard', 'whiteboard-' || substring(md5(random()::text) from 1 for 6), 'Large magnetic whiteboard.', 300, ARRAY['https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800'], 'approved', 'Upper Hill, Nairobi'),
        (v_owner_id, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (SELECT id FROM public.subcategories WHERE slug = 'office-electronics' LIMIT 1), 'Paper Shredder', 'shredder-' || substring(md5(random()::text) from 1 for 6), 'High capacity shredder.', 400, ARRAY['https://images.unsplash.com/photo-1629898084666-4191a32a67e7?auto=format&fit=crop&q=80&w=800'], 'approved', 'Mombasa Road, Nairobi'),
        (v_owner_id, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (SELECT id FROM public.subcategories WHERE slug = 'breakroom' LIMIT 1), 'Water Dispenser', 'water-dispenser-' || substring(md5(random()::text) from 1 for 6), 'Hot and cold water.', 300, ARRAY['https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&q=80&w=800'], 'approved', 'Industrial Area, Nairobi'),
        (v_owner_id, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (SELECT id FROM public.subcategories WHERE slug = 'office-storage' LIMIT 1), 'Filing Cabinet', 'filing-cabinet-' || substring(md5(random()::text) from 1 for 6), 'Steel 4-drawer cabinet.', 400, ARRAY['https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=800'], 'approved', 'CBD, Nairobi'),
        (v_owner_id, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (SELECT id FROM public.subcategories WHERE slug = 'breakroom' LIMIT 1), 'Coffee Machine', 'coffee-maker-' || substring(md5(random()::text) from 1 for 6), 'Espresso machine.', 1500, ARRAY['https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800'], 'approved', 'Westlands, Nairobi'),
        (v_owner_id, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (SELECT id FROM public.subcategories WHERE slug = 'office-storage' LIMIT 1), 'Safe Box', 'safe-box-' || substring(md5(random()::text) from 1 for 6), 'Digital security safe.', 500, ARRAY['https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=800'], 'approved', 'Lavington, Nairobi'),
        (v_owner_id, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (SELECT id FROM public.subcategories WHERE slug = 'office-furniture' LIMIT 1), 'Standing Desk', 'standing-desk-' || substring(md5(random()::text) from 1 for 6), 'Electric adjustable desk.', 1200, ARRAY['https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=800'], 'approved', 'Karen, Nairobi');

        -- 12. BIKES & SCOOTERS
        INSERT INTO public.listings (owner_id, category_id, subcategory_id, title, slug, description, price_per_day, images, status, location) VALUES
        (v_owner_id, 'cccccccc-cccc-cccc-cccc-cccccccccccc', (SELECT id FROM public.subcategories WHERE slug = 'bicycles' LIMIT 1), 'Mountain Bike', 'mtb-bike-' || substring(md5(random()::text) from 1 for 6), '21-speed mountain bike.', 800, ARRAY['https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80&w=800'], 'approved', 'Karura, Nairobi'),
        (v_owner_id, 'cccccccc-cccc-cccc-cccc-cccccccccccc', (SELECT id FROM public.subcategories WHERE slug = 'scooters' LIMIT 1), 'Electric Scooter', 'e-scooter-' || substring(md5(random()::text) from 1 for 6), 'Xiaomi M365.', 1000, ARRAY['https://images.unsplash.com/photo-1557551817-495209bd3c95?auto=format&fit=crop&q=80&w=800'], 'approved', 'Westlands, Nairobi'),
        (v_owner_id, 'cccccccc-cccc-cccc-cccc-cccccccccccc', (SELECT id FROM public.subcategories WHERE slug = 'bicycles' LIMIT 1), 'Road Bike', 'road-bike-' || substring(md5(random()::text) from 1 for 6), 'Carbon fiber road bike.', 1500, ARRAY['https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800'], 'approved', 'Lavington, Nairobi'),
        (v_owner_id, 'cccccccc-cccc-cccc-cccc-cccccccccccc', (SELECT id FROM public.subcategories WHERE slug = 'bicycles' LIMIT 1), 'City Bike', 'city-bike-' || substring(md5(random()::text) from 1 for 6), 'Comfortable cruiser.', 600, ARRAY['https://images.unsplash.com/photo-1496167117681-944f702be1f4?auto=format&fit=crop&q=80&w=800'], 'approved', 'CBD, Nairobi'),
        (v_owner_id, 'cccccccc-cccc-cccc-cccc-cccccccccccc', (SELECT id FROM public.subcategories WHERE slug = 'scooters' LIMIT 1), 'Vespa Scooter', 'vespa-' || substring(md5(random()::text) from 1 for 6), 'Classic styled scooter.', 2500, ARRAY['https://images.unsplash.com/photo-1480112727145-2f64fa588523?auto=format&fit=crop&q=80&w=800'], 'approved', 'Old Town, Mombasa'),
        (v_owner_id, 'cccccccc-cccc-cccc-cccc-cccccccccccc', (SELECT id FROM public.subcategories WHERE slug = 'kids-bikes' LIMIT 1), 'Kids Scooter', 'kids-scooter-' || substring(md5(random()::text) from 1 for 6), '3-wheel scooter.', 300, ARRAY['https://images.unsplash.com/photo-1596706037009-38b479bb84c5?auto=format&fit=crop&q=80&w=800'], 'approved', 'Langata, Nairobi'),
        (v_owner_id, 'cccccccc-cccc-cccc-cccc-cccccccccccc', (SELECT id FROM public.subcategories WHERE slug = 'bike-gear' LIMIT 1), 'Motorcycle Helmet', 'helmet-' || substring(md5(random()::text) from 1 for 6), 'Safety helmet.', 200, ARRAY['https://images.unsplash.com/photo-1589436402434-7a353683f2dc?auto=format&fit=crop&q=80&w=800'], 'approved', 'CBD, Nairobi'),
        (v_owner_id, 'cccccccc-cccc-cccc-cccc-cccccccccccc', (SELECT id FROM public.subcategories WHERE slug = 'bike-gear' LIMIT 1), 'Bike Rack', 'bike-rack-' || substring(md5(random()::text) from 1 for 6), 'Car mount for bikes.', 500, ARRAY['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800'], 'approved', 'Westlands, Nairobi'),
        (v_owner_id, 'cccccccc-cccc-cccc-cccc-cccccccccccc', (SELECT id FROM public.subcategories WHERE slug = 'scooters' LIMIT 1), 'Roller Skates', 'roller-skates-' || substring(md5(random()::text) from 1 for 6), 'Size 42-43.', 400, ARRAY['https://images.unsplash.com/photo-1520352823747-27f26f4c134e?auto=format&fit=crop&q=80&w=800'], 'approved', 'South B, Nairobi'),
        (v_owner_id, 'cccccccc-cccc-cccc-cccc-cccccccccccc', (SELECT id FROM public.subcategories WHERE slug = 'scooters' LIMIT 1), 'Skateboard', 'skateboard-pro-' || substring(md5(random()::text) from 1 for 6), 'Complete setup.', 500, ARRAY['https://images.unsplash.com/photo-1520045864981-8d696fc4148e?auto=format&fit=crop&q=80&w=800'], 'approved', 'Langata, Nairobi');

    END IF;
END $$;
