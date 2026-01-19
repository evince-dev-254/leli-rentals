-- Update category icons and images to match website data and mobile Lucide icon mapping

-- Update category metadata (icons, images, display_order)
UPDATE public.categories SET icon = 'Car', image_url = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', display_order = 1 WHERE slug = 'vehicles';
UPDATE public.categories SET icon = 'Home', image_url = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', display_order = 2 WHERE slug = 'homes';
UPDATE public.categories SET icon = 'Wrench', image_url = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&q=80', display_order = 3 WHERE slug = 'equipment';
UPDATE public.categories SET icon = 'Smartphone', image_url = 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=80', display_order = 4 WHERE slug = 'electronics';
UPDATE public.categories SET icon = 'Shirt', image_url = 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80', display_order = 5 WHERE slug = 'fashion';
UPDATE public.categories SET icon = 'Music', image_url = 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80', display_order = 6 WHERE slug = 'entertainment';
UPDATE public.categories SET icon = 'PartyPopper', image_url = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80', display_order = 7 WHERE slug = 'events';
UPDATE public.categories SET icon = 'Camera', image_url = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80', display_order = 8 WHERE slug = 'photography';
UPDATE public.categories SET icon = 'Dumbbell', image_url = 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80', display_order = 9 WHERE slug = 'fitness';
UPDATE public.categories SET icon = 'Baby', image_url = 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80', display_order = 10 WHERE slug = 'baby';
UPDATE public.categories SET icon = 'Briefcase', image_url = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', display_order = 11 WHERE slug = 'office';
UPDATE public.categories SET icon = 'Bike', image_url = 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80', display_order = 12 WHERE slug = 'bikes';

-- Ensure subcategories for VEHICLES
INSERT INTO public.subcategories (category_id, name, slug, display_order)
SELECT id, 'Sedans', 'sedans', 1 FROM public.categories WHERE slug = 'vehicles'
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name, display_order = EXCLUDED.display_order;

INSERT INTO public.subcategories (category_id, name, slug, display_order)
SELECT id, 'SUVs', 'suvs', 2 FROM public.categories WHERE slug = 'vehicles'
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name, display_order = EXCLUDED.display_order;

-- (Adding more logic for other subcategories if needed, but the priority is the display order)

-- Update subcategory metadata (limiting to core ones to keep script concise but functional)
UPDATE public.subcategories SET display_order = 1 WHERE slug = 'sedans' AND category_id = (SELECT id FROM public.categories WHERE slug = 'vehicles');
UPDATE public.subcategories SET display_order = 2 WHERE slug = 'suvs' AND category_id = (SELECT id FROM public.categories WHERE slug = 'vehicles');
