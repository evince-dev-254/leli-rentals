-- ============================================
-- FIX CATEGORY STRUCTURE AND IMAGES (REVISED)
-- ============================================

-- 1. Move Bikes & Scooters subcategories to Vehicles
-- Vehicles UUID: 11111111-1111-1111-1111-111111111111
-- Bikes UUID: cccccccc-cccc-cccc-cccc-cccccccccccc

-- Handle conflicts: If a slug already exists in Vehicles, we should delete it from Bikes 
-- (the source) before moving, or we assume the Vehicle one is the one to keep.
-- Let's delete the duplicate from Bikes first.
DELETE FROM public.subcategories
WHERE category_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc'
AND slug IN (
    SELECT slug 
    FROM public.subcategories 
    WHERE category_id = '11111111-1111-1111-1111-111111111111'
);

-- Now safe to move the remaining ones
UPDATE public.subcategories
SET category_id = '11111111-1111-1111-1111-111111111111'
WHERE category_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

-- 2. Delete Office & Business and Bikes & Scooters categories
-- Office UUID: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
-- We assume dependencies are handled or we don't care about orphans if cascades aren't set (though likely they are or we'd get an error).
-- Ideally we would delete subcategories first just in case.
DELETE FROM public.subcategories WHERE category_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
DELETE FROM public.categories WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
DELETE FROM public.categories WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';


-- 3. Update/Insert Subcategory Images
-- REVISION: Constraint is `subcategories_category_id_slug_key`, so we must use `ON CONFLICT (category_id, slug)`.

-- VEHICLES (ID: 11111111-1111-1111-1111-111111111111)
INSERT INTO public.subcategories (category_id, name, slug, image_url) VALUES
('11111111-1111-1111-1111-111111111111', 'Sedans', 'sedans', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'SUVs', 'suvs', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Luxury Cars', 'luxury-cars', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Sports Cars', 'sports-cars', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Motorcycles', 'motorcycles', 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Trucks', 'trucks', 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Vans', 'vans', 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Vans & Trucks', 'vans-trucks', 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Buses', 'buses', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Boats', 'boats', 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Pickups', 'pickups', 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Electric Vehicles', 'electric-vehicles', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Classic Cars', 'classic-cars', 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Private jets', 'private-jets', 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Helicopters', 'helicopters', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Mountain Bikes', 'mountain-bikes', 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Road Bikes', 'road-bikes', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'E-Bikes', 'e-bikes', 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Electric Scooters', 'electric-scooters', 'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Kids Bikes', 'kids-bikes', 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'BMX Bikes', 'bmx-bikes', 'https://images.unsplash.com/photo-1583467875263-d50dec37a88c?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Folding Bikes', 'folding-bikes', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Tandem Bikes', 'tandem-bikes', 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Cargo Bikes', 'cargo-bikes', 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Cruiser Bikes', 'cruiser-bikes', 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Hybrid Bikes', 'hybrid-bikes', 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&h=300&fit=crop'),
('11111111-1111-1111-1111-111111111111', 'Tricycles', 'tricycles', 'https://images.unsplash.com/photo-1565803974275-dccd2f933cbb?w=400&h=300&fit=crop')
ON CONFLICT (category_id, slug) DO UPDATE SET 
image_url = EXCLUDED.image_url;

-- LIVING SPACES (ID: 22222222-2222-2222-2222-222222222222)
INSERT INTO public.subcategories (category_id, name, slug, image_url) VALUES
('22222222-2222-2222-2222-222222222222', 'Apartments', 'apartments', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop'),
('22222222-2222-2222-2222-222222222222', 'Studio Flats', 'studio-flats', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'),
('22222222-2222-2222-2222-222222222222', 'Penthouses', 'penthouses', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop'),
('22222222-2222-2222-2222-222222222222', 'Duplexes', 'duplexes', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop'),
('22222222-2222-2222-2222-222222222222', 'Single-family Homes', 'single-family-homes', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop'),
('22222222-2222-2222-2222-222222222222', 'Townhouses', 'townhouses', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop'),
('22222222-2222-2222-2222-222222222222', 'Luxury Villas', 'luxury-villas', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop'),
('22222222-2222-2222-2222-222222222222', 'Bungalows', 'bungalows', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop'),
('22222222-2222-2222-2222-222222222222', 'Coliving Spaces', 'coliving-spaces', 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?w=400&h=300&fit=crop'),
('22222222-2222-2222-2222-222222222222', 'Student Hostels', 'student-hostels', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop'),
('22222222-2222-2222-2222-222222222222', 'Cottages', 'cottages', 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400&h=300&fit=crop'),
('22222222-2222-2222-2222-222222222222', 'Cabins', 'cabins', 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=300&fit=crop'),
('22222222-2222-2222-2222-222222222222', 'Beach Houses', 'beach-houses', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop'),
('22222222-2222-2222-2222-222222222222', 'Farmhouses', 'farmhouses', 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=400&h=300&fit=crop')
ON CONFLICT (category_id, slug) DO UPDATE SET 
image_url = EXCLUDED.image_url;

-- EQUIPMENT & TOOLS (ID: 33333333-3333-3333-3333-333333333333)
INSERT INTO public.subcategories (category_id, name, slug, image_url) VALUES
('33333333-3333-3333-3333-333333333333', 'Power Tools', 'power-tools', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop'),
('33333333-3333-3333-3333-333333333333', 'Hand Tools', 'hand-tools', 'https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?w=400&h=300&fit=crop'),
('33333333-3333-3333-3333-333333333333', 'Construction', 'construction', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop'),
('33333333-3333-3333-3333-333333333333', 'Landscaping', 'landscaping', 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=400&h=300&fit=crop'),
('33333333-3333-3333-3333-333333333333', 'Cleaning', 'cleaning', 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop'),
('33333333-3333-3333-3333-333333333333', 'Industrial', 'industrial', 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=300&fit=crop'),
('33333333-3333-3333-3333-333333333333', 'Generators', 'generators', 'https://images.unsplash.com/photo-1621905252472-943afaa20e20?w=400&h=300&fit=crop'),
('33333333-3333-3333-3333-333333333333', 'Compressors', 'compressors', 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&h=300&fit=crop'),
('33333333-3333-3333-3333-333333333333', 'Welding', 'welding', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop'),
('33333333-3333-3333-3333-333333333333', 'Painting', 'painting', 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop'),
('33333333-3333-3333-3333-333333333333', 'Plumbing', 'plumbing', 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop'),
('33333333-3333-3333-3333-333333333333', 'Electrical', 'electrical', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop'),
('33333333-3333-3333-3333-333333333333', 'Party Rentals', 'party-rentals', 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400&h=300&fit=crop'),
('33333333-3333-3333-3333-333333333333', 'Outdoor Gear', 'outdoor-gear', 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=300&fit=crop'),
('33333333-3333-3333-3333-333333333333', 'Photography Gear', 'photography-gear', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop'),
('33333333-3333-3333-3333-333333333333', 'Sports Equipment', 'sports-equipment', 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&h=300&fit=crop')
ON CONFLICT (category_id, slug) DO UPDATE SET 
image_url = EXCLUDED.image_url;

-- ELECTRONICS (ID: 44444444-4444-4444-4444-444444444444)
INSERT INTO public.subcategories (category_id, name, slug, image_url) VALUES
('44444444-4444-4444-4444-444444444444', 'Cameras', 'cameras', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop'),
('44444444-4444-4444-4444-444444444444', 'Laptops', 'laptops', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop'),
('44444444-4444-4444-4444-444444444444', 'Audio Equipment', 'audio-equipment', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop'),
('44444444-4444-4444-4444-444444444444', 'Gaming Consoles', 'gaming-consoles', 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=400&h=300&fit=crop'),
('44444444-4444-4444-4444-444444444444', 'Drones', 'drones', 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop'),
('44444444-4444-4444-4444-444444444444', 'Projectors', 'projectors', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop'),
('44444444-4444-4444-4444-444444444444', 'Tablets', 'tablets', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop'),
('44444444-4444-4444-4444-444444444444', 'VR Headsets', 'vr-headsets', 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&h=300&fit=crop'),
('44444444-4444-4444-4444-444444444444', 'Smart TVs', 'smart-tvs', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop'),
('44444444-4444-4444-4444-444444444444', 'Speakers', 'speakers', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop'),
('44444444-4444-4444-4444-444444444444', 'Microphones', 'microphones', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=300&fit=crop'),
('44444444-4444-4444-4444-444444444444', 'Lighting Equipment', 'lighting-equipment', 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=400&h=300&fit=crop')
ON CONFLICT (category_id, slug) DO UPDATE SET 
image_url = EXCLUDED.image_url;

-- FASHION & ACCESSORIES (ID: 55555555-5555-5555-5555-555555555555)
INSERT INTO public.subcategories (category_id, name, slug, image_url) VALUES
('55555555-5555-5555-5555-555555555555', 'Evening Dresses', 'evening-dresses', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=300&fit=crop'),
('55555555-5555-5555-5555-555555555555', 'Wedding Dresses', 'wedding-dresses', 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=400&h=300&fit=crop'),
('55555555-5555-5555-5555-555555555555', 'Suits', 'suits', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop'),
('55555555-5555-5555-5555-555555555555', 'Tuxedos', 'tuxedos', 'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=400&h=300&fit=crop'),
('55555555-5555-5555-5555-555555555555', 'Suits & Tuxedos', 'suits-tuxedos', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop'),
('55555555-5555-5555-5555-555555555555', 'Women''s Wear', 'womens-wear', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=300&fit=crop'),
('55555555-5555-5555-5555-555555555555', 'Jewelry', 'jewelry', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop'),
('55555555-5555-5555-5555-555555555555', 'Designer Bags', 'designer-bags', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop'),
('55555555-5555-5555-5555-555555555555', 'Shoes', 'shoes', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop'),
('55555555-5555-5555-5555-555555555555', 'Traditional Wear', 'traditional-wear', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop'),
('55555555-5555-5555-5555-555555555555', 'Costumes', 'costumes-fashion', 'https://images.unsplash.com/photo-1509783236416-c9ad59bae472?w=400&h=300&fit=crop'),
('55555555-5555-5555-5555-555555555555', 'Watches', 'watches', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop'),
('55555555-5555-5555-5555-555555555555', 'Sunglasses', 'sunglasses', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop'),
('55555555-5555-5555-5555-555555555555', 'Accessories', 'accessories', 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=300&fit=crop')
ON CONFLICT (category_id, slug) DO UPDATE SET 
image_url = EXCLUDED.image_url;

-- ENTERTAINMENT (ID: 66666666-6666-6666-6666-666666666666)
INSERT INTO public.subcategories (category_id, name, slug, image_url) VALUES
('66666666-6666-6666-6666-666666666666', 'Musical Instruments', 'musical-instruments', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=300&fit=crop'),
('66666666-6666-6666-6666-666666666666', 'DJ Equipment', 'dj-equipment', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'),
('66666666-6666-6666-6666-666666666666', 'Gaming Consoles', 'gaming-consoles', 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=400&h=300&fit=crop'),
('66666666-6666-6666-6666-666666666666', 'Karaoke Systems', 'karaoke-systems', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop'),
('66666666-6666-6666-6666-666666666666', 'Board Games', 'board-games', 'https://images.unsplash.com/photo-1611891487122-207579d67d98?w=400&h=300&fit=crop'),
('66666666-6666-6666-6666-666666666666', 'Party Supplies', 'party-supplies', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop'),
('66666666-6666-6666-6666-666666666666', 'Stage Lighting', 'stage-lighting', 'https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=400&h=300&fit=crop'),
('66666666-6666-6666-6666-666666666666', 'Bouncy Castles', 'bouncy-castles', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'),
('66666666-6666-6666-6666-666666666666', 'Photo Booths', 'photo-booths', 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&h=300&fit=crop'),
('66666666-6666-6666-6666-666666666666', 'Sound Systems', 'sound-systems', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop'),
('66666666-6666-6666-6666-666666666666', 'Fog Machines', 'fog-machines', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop'),
('66666666-6666-6666-6666-666666666666', 'Arcade Games', 'arcade-games', 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=400&h=300&fit=crop'),
('66666666-6666-6666-6666-666666666666', 'Party Lights', 'party-lights', 'https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=400&h=300&fit=crop')
ON CONFLICT (category_id, slug) DO UPDATE SET 
image_url = EXCLUDED.image_url;

-- UTILITY SPACES (ID: 77777777-7777-7777-7777-777777777777)
INSERT INTO public.subcategories (category_id, name, slug, image_url) VALUES
('77777777-7777-7777-7777-777777777777', 'Banquet Halls', 'banquet-halls', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop'),
('77777777-7777-7777-7777-777777777777', 'Conference Rooms', 'conference-rooms', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=300&fit=crop'),
('77777777-7777-7777-7777-777777777777', 'Wedding Venues', 'wedding-venues', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop'),
('77777777-7777-7777-7777-777777777777', 'Rooftop Terraces', 'rooftop-terraces', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=300&fit=crop'),
('77777777-7777-7777-7777-777777777777', 'Art Galleries', 'art-galleries', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop'),
('77777777-7777-7777-7777-777777777777', 'Creative Studios', 'creative-studios', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop'),
('77777777-7777-7777-7777-777777777777', 'Self-storage Units', 'self-storage-units', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop'),
('77777777-7777-7777-7777-777777777777', 'Parking Spaces', 'parking-spaces', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop'),
('77777777-7777-7777-7777-777777777777', 'Shipping Containers', 'shipping-containers', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop'),
('77777777-7777-7777-7777-777777777777', 'Tents & Canopies', 'tents-canopies', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop'),
('77777777-7777-7777-7777-777777777777', 'Tables & Chairs', 'tables-chairs', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop')
ON CONFLICT (category_id, slug) DO UPDATE SET 
image_url = EXCLUDED.image_url;

-- PHOTOGRAPHY (ID: 88888888-8888-8888-8888-888888888888)
INSERT INTO public.subcategories (category_id, name, slug, image_url) VALUES
('88888888-8888-8888-8888-888888888888', 'DSLR Cameras', 'dslr-cameras', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop'),
('88888888-8888-8888-8888-888888888888', 'Mirrorless Cameras', 'mirrorless-cameras', 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&h=300&fit=crop'),
('88888888-8888-8888-8888-888888888888', 'Lenses', 'lenses', 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=400&h=300&fit=crop'),
('88888888-8888-8888-8888-888888888888', 'Studio Lighting', 'studio-lighting', 'https://images.unsplash.com/photo-1513379733131-47fc74b45fc7?w=400&h=300&fit=crop'),
('88888888-8888-8888-8888-888888888888', 'Backdrops', 'backdrops', 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=300&fit=crop'),
('88888888-8888-8888-8888-888888888888', 'Tripods', 'tripods', 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop'),
('88888888-8888-8888-8888-888888888888', 'Gimbals', 'gimbals', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop'),
('88888888-8888-8888-8888-888888888888', 'Reflectors', 'reflectors', 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=300&fit=crop'),
('88888888-8888-8888-8888-888888888888', 'Light Stands', 'light-stands', 'https://images.unsplash.com/photo-1574717025058-2f8737d2e2b7?w=400&h=300&fit=crop'),
('88888888-8888-8888-8888-888888888888', 'Softboxes', 'softboxes', 'https://images.unsplash.com/photo-1603539947678-cd3954ed515d?w=400&h=300&fit=crop'),
('88888888-8888-8888-8888-888888888888', 'Flash Units', 'flash-units', 'https://images.unsplash.com/photo-1617575521317-d2974f3b56d2?w=400&h=300&fit=crop'),
('88888888-8888-8888-8888-888888888888', 'Video Cameras', 'video-cameras', 'https://images.unsplash.com/photo-1598743400863-0201c7e1445b?w=400&h=300&fit=crop')
ON CONFLICT (category_id, slug) DO UPDATE SET 
image_url = EXCLUDED.image_url;

-- FITNESS (ID: 99999999-9999-9999-9999-999999999999)
INSERT INTO public.subcategories (category_id, name, slug, image_url) VALUES
('99999999-9999-9999-9999-999999999999', 'Treadmills', 'treadmills', 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&h=300&fit=crop'),
('99999999-9999-9999-9999-999999999999', 'Exercise Bikes', 'exercise-bikes', 'https://images.unsplash.com/photo-1591291621164-2c6367723315?w=400&h=300&fit=crop'),
('99999999-9999-9999-9999-999999999999', 'Weight Sets', 'weight-sets', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop'),
('99999999-9999-9999-9999-999999999999', 'Yoga Equipment', 'yoga-equipment', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop'),
('99999999-9999-9999-9999-999999999999', 'Tennis Gear', 'tennis-gear', 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop'),
('99999999-9999-9999-9999-999999999999', 'Golf Clubs', 'golf-clubs', 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=300&fit=crop'),
('99999999-9999-9999-9999-999999999999', 'Camping Gear', 'camping-gear', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop'),
('99999999-9999-9999-9999-999999999999', 'Hiking Equipment', 'hiking-equipment', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop'),
('99999999-9999-9999-9999-999999999999', 'Swimming Gear', 'swimming-gear', 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400&h=300&fit=crop'),
('99999999-9999-9999-9999-999999999999', 'Football Equipment', 'football-equipment', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop'),
('99999999-9999-9999-9999-999999999999', 'Basketball Gear', 'basketball-gear', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop'),
('99999999-9999-9999-9999-999999999999', 'Water Sports', 'water-sports', 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop')
ON CONFLICT (category_id, slug) DO UPDATE SET 
image_url = EXCLUDED.image_url;

-- BABY & KIDS (ID: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa)
INSERT INTO public.subcategories (category_id, name, slug, image_url) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Strollers', 'strollers', 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Cribs', 'cribs', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Car Seats', 'car-seats', 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=300&fit=crop'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'High Chairs', 'high-chairs', 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=300&fit=crop'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Playpens', 'playpens', 'https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=400&h=300&fit=crop'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Baby Monitors', 'baby-monitors', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Toys', 'toys', 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Swings', 'swings', 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Baby Carriers', 'baby-carriers', 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=400&h=300&fit=crop'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Booster Seats', 'booster-seats', 'https://images.unsplash.com/photo-1590698933947-a202b069a861?w=400&h=300&fit=crop'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Changing Tables', 'changing-tables', 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&h=300&fit=crop'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Baby Walkers', 'baby-walkers', 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=300&fit=crop')
ON CONFLICT (category_id, slug) DO UPDATE SET 
image_url = EXCLUDED.image_url;

