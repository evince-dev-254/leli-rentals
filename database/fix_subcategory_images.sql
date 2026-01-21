-- Refresh subcategory images with high-quality premium visuals
-- Focusing on Business Spaces, Utility Spaces, Living Spaces and Construction

-- 1. Business Spaces (Specific Subcategories)
UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Private offices';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Coworking desks';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Executive suites';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Shop fronts';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Showrooms';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Pop-up shops';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Kiosks';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Warehouses';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Cold storage';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Workshops';

-- Older entries for fallback
UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Office Spaces';

-- 2. Utility Spaces
UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1603398938378-e54eab446f08?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Storage Units';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Parking Spaces';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Garages';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Workshop Spaces';

-- 3. Living Spaces
UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Apartments';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Houses & Villas';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1555854816-808225a3942b?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Hostels & Rooms';

-- 4. Construction (Common items)
UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1541625602330-2277a4c4b08d?auto=format&fit=crop&w=1200&q=80'
WHERE name ILIKE '%Construction%' OR name ILIKE '%Machinery%' OR name ILIKE '%Equipment%';

-- 5. Vehicles (Just in case)
UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Cars & SUVs';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1558981403-c5f91cbba527?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Motorcycles';
