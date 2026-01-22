-- ============================================
-- REMOVE OLD SUBCATEGORIES
-- ============================================
-- This script deactivates subcategories that are now redundant or replaced 
-- by more specific entries in the new category structure.

-- 3. VEHICLES (1111...)
-- Deactivate broad or renamed categories
UPDATE public.subcategories 
SET is_active = false 
WHERE category_id = '11111111-1111-1111-1111-111111111111'
AND slug IN ('cars', 'luxury-cars'); 

-- 4. UTILITY (7777...)
-- Explicitly handle 'studios-spaces' vs 'creative-studios'
UPDATE public.subcategories 
SET is_active = false 
WHERE category_id = '77777777-7777-7777-7777-777777777777'
AND slug IN ('corporate-spaces', 'party-venues', 'studios-spaces', 'outdoor-spaces');

-- 4. CLEANUP ANY ORPHANS
-- Deactivate any subcategory that doesn't have a valid category
UPDATE public.subcategories
SET is_active = false
WHERE category_id NOT IN (SELECT id FROM public.categories WHERE is_active = true);
