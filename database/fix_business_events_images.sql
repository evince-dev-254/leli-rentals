-- Fix images for Business Events (formerly classified under Utility) and remaining items

-- Business Events Venues
UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Banquet Halls';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Conference Rooms';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Wedding Venues';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Rooftop Terraces';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Art Galleries';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Creative Studios';

-- Utility Items (Name corrections/Additions)
UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Self-storage Units';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Parking Spaces';

UPDATE subcategories 
SET image_url = 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1200&q=80'
WHERE name = 'Shipping Containers';
