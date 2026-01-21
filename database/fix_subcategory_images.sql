-- Fix duplicate and mismatched images for subcategories
-- Focusing on Business Spaces, Utility Spaces and Living Spaces

-- 1. Business Spaces
UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
WHERE name = 'Office Spaces';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=800&q=80'
WHERE name = 'Meeting Rooms';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1527192491265-7e15cdef5f1d?auto=format&fit=crop&w=800&q=80'
WHERE name = 'Coworking Spaces';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'
WHERE name = 'Retail Spaces';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80'
WHERE name = 'Event Venues';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
WHERE name = 'Warehouse Spaces';

-- 2. Utility Spaces
UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1603398938378-e54eab446f08?auto=format&fit=crop&w=800&q=80'
WHERE name = 'Storage Units';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80'
WHERE name = 'Parking Spaces';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80'
WHERE name = 'Garages';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80'
WHERE name = 'Workshop Spaces';

-- 3. Living Spaces (Ensuring uniqueness)
UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
WHERE name = 'Apartments';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
WHERE name = 'Houses & Villas';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1555854816-808225a3942b?auto=format&fit=crop&w=800&q=80'
WHERE name = 'Hostels & Rooms';
