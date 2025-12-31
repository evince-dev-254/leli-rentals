-- ============================================
-- SEED SUBCATEGORIES
-- ============================================

INSERT INTO public.subcategories (category_id, name, slug, description, display_order)
VALUES
    -- 1. VEHICLES (1111...)
    ('11111111-1111-1111-1111-111111111111', 'Cars', 'cars', 'Sedans, SUVs, and hatchbacks', 1),
    ('11111111-1111-1111-1111-111111111111', 'Motorcycles', 'motorcycles', 'Bikes and cruisers', 2),
    ('11111111-1111-1111-1111-111111111111', 'Trucks & Lorries', 'trucks', 'For transporting goods', 3),
    ('11111111-1111-1111-1111-111111111111', 'Vans & Buses', 'vans', 'Group transport vehicles', 4),
    ('11111111-1111-1111-1111-111111111111', 'Luxury & Vintage', 'luxury-cars', 'For special occasions', 5),

    -- 2. HOMES & APARTMENTS (2222...)
    ('22222222-2222-2222-2222-222222222222', 'Apartments', 'apartments', 'City living spaces', 1),
    ('22222222-2222-2222-2222-222222222222', 'Villas', 'villas', 'Luxury standalone homes', 2),
    ('22222222-2222-2222-2222-222222222222', 'Cottages', 'cottages', 'Cozy getaways', 3),
    ('22222222-2222-2222-2222-222222222222', 'Shared Rooms', 'shared-rooms', 'Budget friendly options', 4),
    ('22222222-2222-2222-2222-222222222222', 'Event Houses', 'event-houses', 'Houses for parties', 5),

    -- 3. EQUIPMENT & TOOLS (3333...)
    ('33333333-3333-3333-3333-333333333333', 'Power Tools', 'power-tools', 'Drills, saws, and sanders', 1),
    ('33333333-3333-3333-3333-333333333333', 'Construction', 'construction', 'Mixers, generators, and scaffolding', 2),
    ('33333333-3333-3333-3333-333333333333', 'Gardening', 'gardening', 'Mowers and trimmers', 3),
    ('33333333-3333-3333-3333-333333333333', 'Cleaning', 'cleaning', 'Pressure washers and vacuums', 4),
    ('33333333-3333-3333-3333-333333333333', 'Ladders & Access', 'ladders', 'Ladders and platforms', 5),
    ('33333333-3333-3333-3333-333333333333', 'Party Rentals', 'party-rentals', 'Tents, chairs, and tables', 6),
    ('33333333-3333-3333-3333-333333333333', 'Outdoor Gear', 'outdoor-gear', 'Camping and hiking equipment', 7),

    -- 4. ELECTRONICS (4444...)
    ('44444444-4444-4444-4444-444444444444', 'Audio & Sound', 'audio', 'Speakers and microphones', 1),
    ('44444444-4444-4444-4444-444444444444', 'Computers & Laptops', 'computers', 'MacBooks and PCs', 2),
    ('44444444-4444-4444-4444-444444444444', 'Gaming', 'gaming', 'Consoles and VR', 3),
    ('44444444-4444-4444-4444-444444444444', 'Projectors & Screens', 'projectors', 'Visual equipment', 4),
    ('44444444-4444-4444-4444-444444444444', 'Drones', 'drones', 'Aerial photography', 5),

    -- 5. FASHION & ACCESSORIES (5555...)
    ('55555555-5555-5555-5555-555555555555', 'Men''s Wear', 'mens-wear', 'Suits and tuxedos', 1),
    ('55555555-5555-5555-5555-555555555555', 'Women''s Wear', 'womens-wear', 'Gowns and dresses', 2),
    ('55555555-5555-5555-5555-555555555555', 'Jewelry', 'jewelry', 'Watches and necklaces', 3),
    ('55555555-5555-5555-5555-555555555555', 'Costumes', 'costumes-fashion', 'Themed outfits', 4),
    ('55555555-5555-5555-5555-555555555555', 'Bags & Accessories', 'accessories', 'Handbags and belts', 5),

    -- 6. ENTERTAINMENT (6666...)
    ('66666666-6666-6666-6666-666666666666', 'Musical Instruments', 'instruments', 'Guitars, drums, pianos', 1),
    ('66666666-6666-6666-6666-666666666666', 'DJ Equipment', 'dj-gear', 'Decks and mixers', 2),
    ('66666666-6666-6666-6666-666666666666', 'Party Lights', 'party-lights', 'Lasers and spots', 3),
    ('66666666-6666-6666-6666-666666666666', 'Games', 'games', 'Board games and arcade', 4),
    ('66666666-6666-6666-6666-666666666666', 'Inflatables', 'inflatables', 'Bouncy castles', 5),

    -- 7. EVENT SPACES (7777...)
    ('77777777-7777-7777-7777-777777777777', 'Wedding Venues', 'wedding-venues', 'Gardens and halls', 1),
    ('77777777-7777-7777-7777-777777777777', 'Corporate', 'corporate-spaces', 'Meeting rooms and conference halls', 2),
    ('77777777-7777-7777-7777-777777777777', 'Party Venues', 'party-venues', 'Clubs and lounges', 3),
    ('77777777-7777-7777-7777-777777777777', 'Studios', 'studios-spaces', 'Photo and video studios', 4),
    ('77777777-7777-7777-7777-777777777777', 'Outdoor', 'outdoor-spaces', 'Parks and fields', 5),

    -- 8. PHOTOGRAPHY (8888...)
    ('88888888-8888-8888-8888-888888888888', 'Cameras', 'cameras', 'DSLR and Mirrorless', 1),
    ('88888888-8888-8888-8888-888888888888', 'Lenses', 'lenses', 'Prime and zoom lenses', 2),
    ('88888888-8888-8888-8888-888888888888', 'Lighting', 'lighting-photo', 'Strobes and continuous', 3),
    ('88888888-8888-8888-8888-888888888888', 'Tripods & Support', 'tripods', 'Stands and stabilizers', 4),
    ('88888888-8888-8888-8888-888888888888', 'Accessories', 'photo-accessories', 'Filters and bags', 5),

    -- 9. FITNESS & SPORTS (9999...)
    ('99999999-9999-9999-9999-999999999999', 'Gym Equipment', 'gym-equipment', 'Treadmills and weights', 1),
    ('99999999-9999-9999-9999-999999999999', 'Outdoor Sports', 'outdoor-sports', 'Camping and hiking', 2),
    ('99999999-9999-9999-9999-999999999999', 'Team Sports', 'team-sports', 'Football and basketball', 3),
    ('99999999-9999-9999-9999-999999999999', 'Water Sports', 'water-sports', 'Kayaks and surfboards', 4),
    ('99999999-9999-9999-9999-999999999999', 'Yoga & Pilates', 'yoga', 'Mats and blocks', 5),

    -- 10. BABY & KIDS (aaaa...)
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Strollers & Prams', 'strollers', 'Travel systems', 1),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Car Seats', 'car-seats', 'Safety seats', 2),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Furniture', 'baby-furniture', 'Cribs and high chairs', 3),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Toys', 'toys', 'Educational and fun', 4),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Feeding & Care', 'feeding', 'Pumps and sterilizers', 5),

    -- 11. OFFICE & BUSINESS (bbbb...)
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Furniture', 'office-furniture', 'Desks and chairs', 1),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Electronics', 'office-electronics', 'Printers and shredders', 2),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Meeting Supplies', 'meeting-supplies', 'Projectors and whiteboards', 3),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Storage', 'office-storage', 'Cabinets and safes', 4),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Breakroom', 'breakroom', 'Coffee machines and dispensers', 5),

    -- 12. BIKES & SCOOTERS (cccc...)
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Bicycles', 'bicycles', 'Road and mountain bikes', 1),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'E-Bikes', 'e-bikes', 'Electric bicycles', 2),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Scooters', 'scooters', 'Electric and kick scooters', 3),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Kids', 'kids-bikes', 'Small bikes and trikes', 4),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Gear', 'bike-gear', 'Helmets and racks', 5)

ON CONFLICT (category_id, slug) DO NOTHING;
