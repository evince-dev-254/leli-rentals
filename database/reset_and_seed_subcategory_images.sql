-- ============================================
-- RESET AND SEED SUBCATEGORY IMAGES (COMPLETE)
-- ============================================

-- 1. Reset all images to NULL to ensure no duplicates or old images remain
UPDATE public.subcategories SET image_url = NULL;

-- 2. Update images for each subcategory by slug

-- ============================================
-- CATEGORY IMAGES (Top Level)
-- ============================================
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80' WHERE slug = 'vehicles';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' WHERE slug = 'living';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&q=80' WHERE slug = 'equipment';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=80' WHERE slug = 'electronics';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80' WHERE slug = 'fashion';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80' WHERE slug = 'entertainment';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80' WHERE slug = 'utility';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' WHERE slug = 'business';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80' WHERE slug = 'photography';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80' WHERE slug = 'fitness';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80' WHERE slug = 'baby';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80' WHERE slug = 'office';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80' WHERE slug = 'bikes';

-- VEHICLES
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=80' WHERE slug = 'cars';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80' WHERE slug = 'motorcycles';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80' WHERE slug = 'trucks';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80' WHERE slug = 'vans';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80' WHERE slug = 'sedans';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80' WHERE slug = 'suvs';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80' WHERE slug = 'luxury-cars';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80' WHERE slug = 'private-jets';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80' WHERE slug = 'helicopters';

-- LIVING SPACES (Formerly Homes & Apartments)
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80' WHERE slug = 'apartments';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80' WHERE slug = 'villas';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80' WHERE slug = 'cottages';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80' WHERE slug = 'shared-rooms';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80' WHERE slug = 'event-houses';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80' WHERE slug = 'studio-flats';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' WHERE slug = 'penthouses';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' WHERE slug = 'duplexes';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80' WHERE slug = 'single-family-homes';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=800&q=80' WHERE slug = 'townhouses';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80' WHERE slug = 'luxury-villas';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80' WHERE slug = 'bungalows';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80' WHERE slug = 'coliving-spaces';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80' WHERE slug = 'student-hostels';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=800&q=80' WHERE slug = 'cabins';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80' WHERE slug = 'beach-houses';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=80' WHERE slug = 'farmhouses';

-- UTILITY SPACES (Formerly Event Spaces. Note: some overlap with old slugs)
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80' WHERE slug = 'wedding-venues';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80' WHERE slug = 'corporate-spaces';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80' WHERE slug = 'party-venues';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80' WHERE slug = 'studios-spaces';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=800&q=80' WHERE slug = 'outdoor-spaces';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80' WHERE slug = 'banquet-halls';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80' WHERE slug = 'conference-rooms';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80' WHERE slug = 'rooftop-terraces';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=800&q=80' WHERE slug = 'art-galleries';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80' WHERE slug = 'creative-studios';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80' WHERE slug = 'self-storage-units';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80' WHERE slug = 'shipping-containers';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80' WHERE slug = 'parking-spaces';

-- BUSINESS SPACES
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80' WHERE slug = 'private-offices';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80' WHERE slug = 'coworking-desks';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=800&q=80' WHERE slug = 'executive-suites';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80' WHERE slug = 'shop-fronts';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80' WHERE slug = 'showrooms';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80' WHERE slug = 'pop-up-shops';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?auto=format&fit=crop&w=800&q=80' WHERE slug = 'kiosks';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80' WHERE slug = 'warehouses';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&w=800&q=80' WHERE slug = 'cold-storage';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80' WHERE slug = 'workshops';

-- EQUIPMENT & TOOLS
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80' WHERE slug = 'power-tools';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80' WHERE slug = 'construction';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80' WHERE slug = 'gardening';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1528747045269-390fe33c19f2?auto=format&fit=crop&w=800&q=80' WHERE slug = 'cleaning';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80' WHERE slug = 'ladders';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=800&q=80' WHERE slug = 'party-rentals';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80' WHERE slug = 'decorations';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80' WHERE slug = 'outdoor-gear';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80' WHERE slug = 'camping-gear';

-- ELECTRONICS
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80' WHERE slug = 'audio';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80' WHERE slug = 'audio-equipment';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80' WHERE slug = 'computers';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80' WHERE slug = 'laptops';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80' WHERE slug = 'gaming';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=800&q=80' WHERE slug = 'gaming-consoles';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80' WHERE slug = 'projectors';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80' WHERE slug = 'drones';

-- FASHION & ACCESSORIES
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=800&q=80' WHERE slug = 'mens-wear';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=80' WHERE slug = 'womens-wear';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80' WHERE slug = 'wedding-gowns';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80' WHERE slug = 'suits';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=800&q=80' WHERE slug = 'tuxedos';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80' WHERE slug = 'handbags';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80' WHERE slug = 'jewelry';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=800&q=80' WHERE slug = 'costumes-fashion';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80' WHERE slug = 'suits';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=800&q=80' WHERE slug = 'tuxedos';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80' WHERE slug = 'handbags';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&w=800&q=80' WHERE slug = 'accessories';

-- ENTERTAINMENT
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80' WHERE slug = 'instruments';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=800&q=80' WHERE slug = 'dj-gear';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1504509546545-e000b4a62425?auto=format&fit=crop&w=800&q=80' WHERE slug = 'stage-lighting';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80' WHERE slug = 'party-supplies';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80' WHERE slug = 'sound-systems';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80' WHERE slug = 'games';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1533245270348-821d4d5c7514?auto=format&fit=crop&w=800&q=80' WHERE slug = 'inflatables';

-- PHOTOGRAPHY
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80' WHERE slug = 'cameras';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80' WHERE slug = 'lenses';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?auto=format&fit=crop&w=800&q=80' WHERE slug = 'lighting-photo';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1500634245200-e5245c7574ef?auto=format&fit=crop&w=800&q=80' WHERE slug = 'tripods';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?auto=format&fit=crop&w=800&q=80' WHERE slug = 'photo-accessories';

-- FITNESS & SPORTS
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80' WHERE slug = 'gym-equipment';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80' WHERE slug = 'outdoor-sports';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=800&q=80' WHERE slug = 'team-sports';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80' WHERE slug = 'water-sports';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80' WHERE slug = 'yoga';

-- BABY & KIDS
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80' WHERE slug = 'strollers';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80' WHERE slug = 'car-seats';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=800&q=80' WHERE slug = 'baby-furniture';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80' WHERE slug = 'toys';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80' WHERE slug = 'feeding';

-- OFFICE & BUSINESS
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80' WHERE slug = 'office-furniture';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&w=800&q=80' WHERE slug = 'office-electronics';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80' WHERE slug = 'meeting-supplies';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80' WHERE slug = 'office-storage';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80' WHERE slug = 'breakroom';

-- BIKES & SCOOTERS
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&w=800&q=80' WHERE slug = 'bicycles';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80' WHERE slug = 'e-bikes';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=80' WHERE slug = 'scooters';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1523740856324-f2ce89135981?auto=format&fit=crop&w=800&q=80' WHERE slug = 'kids-bikes';
UPDATE public.subcategories SET image_url = 'https://images.unsplash.com/photo-1511994714008-b6d68a8b32a2?auto=format&fit=crop&w=800&q=80' WHERE slug = 'bike-gear';
