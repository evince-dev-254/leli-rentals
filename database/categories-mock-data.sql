-- ================================================================
-- CATEGORIES MOCK DATA
-- ================================================================
-- Comprehensive categories for the Leli Rentals platform
-- This includes diverse rental categories with icons and descriptions

-- Create categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies (if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'categories' AND policyname = 'Anyone can view active categories'
    ) THEN
        CREATE POLICY "Anyone can view active categories" ON categories
          FOR SELECT USING (is_active = true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'categories' AND policyname = 'Admins can manage categories'
    ) THEN
        CREATE POLICY "Admins can manage categories" ON categories
          FOR ALL USING (
            auth.jwt() ->> 'role' = 'admin' OR 
            (SELECT role FROM user_profiles WHERE user_id = auth.uid()::text) = 'admin'
          );
    END IF;
END $$;

-- Clear existing categories (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE categories CASCADE;

-- Insert comprehensive categories
INSERT INTO categories (name, slug, description, icon, image_url, is_active, display_order) VALUES
-- Vehicles
('Cars', 'cars', 'Rent cars for any occasion - from economy to luxury vehicles', '🚗', '/categories/cars.jpg', true, 1),
('Motorcycles', 'motorcycles', 'Two-wheelers for quick and efficient transportation', '🏍️', '/categories/motorcycles.jpg', true, 2),
('Bicycles', 'bicycles', 'Eco-friendly bikes for leisure and fitness', '🚴', '/categories/bicycles.jpg', true, 3),
('Trucks & Vans', 'trucks-vans', 'Moving trucks, cargo vans, and commercial vehicles', '🚚', '/categories/trucks.jpg', true, 4),
('Boats & Watercraft', 'boats-watercraft', 'Boats, jet skis, and water sports equipment', '⛵', '/categories/boats.jpg', true, 5),

-- Accommodation
('Apartments', 'apartments', 'Short-term and vacation apartment rentals', '🏢', '/categories/apartments.jpg', true, 6),
('Houses', 'houses', 'Entire houses for families and groups', '🏠', '/categories/houses.jpg', true, 7),
('Vacation Homes', 'vacation-homes', 'Holiday villas and beach houses', '🏖️', '/categories/vacation-homes.jpg', true, 8),
('Event Venues', 'event-venues', 'Spaces for weddings, parties, and corporate events', '🎉', '/categories/venues.jpg', true, 9),
('Office Spaces', 'office-spaces', 'Co-working spaces and private offices', '🏢', '/categories/offices.jpg', true, 10),

-- Electronics & Gadgets
('Cameras & Photography', 'cameras-photography', 'Professional cameras, lenses, and photography equipment', '📷', '/categories/cameras.jpg', true, 11),
('Audio Equipment', 'audio-equipment', 'Speakers, microphones, DJ equipment, and sound systems', '🎵', '/categories/audio.jpg', true, 12),
('Gaming Consoles', 'gaming-consoles', 'PlayStation, Xbox, Nintendo, and gaming accessories', '🎮', '/categories/gaming.jpg', true, 13),
('Laptops & Computers', 'laptops-computers', 'Laptops, desktops, and computer accessories', '💻', '/categories/computers.jpg', true, 14),
('Drones', 'drones', 'Aerial photography and videography drones', '🚁', '/categories/drones.jpg', true, 15),

-- Tools & Equipment
('Power Tools', 'power-tools', 'Drills, saws, sanders, and construction tools', '🔨', '/categories/power-tools.jpg', true, 16),
('Garden Equipment', 'garden-equipment', 'Lawn mowers, trimmers, and gardening tools', '🌱', '/categories/garden.jpg', true, 17),
('Cleaning Equipment', 'cleaning-equipment', 'Pressure washers, carpet cleaners, and industrial cleaners', '🧹', '/categories/cleaning.jpg', true, 18),
('Construction Equipment', 'construction-equipment', 'Heavy machinery and construction tools', '🏗️', '/categories/construction.jpg', true, 19),
('Generators', 'generators', 'Portable and industrial power generators', '⚡', '/categories/generators.jpg', true, 20),

-- Party & Events
('Party Supplies', 'party-supplies', 'Tents, tables, chairs, and party decorations', '🎈', '/categories/party.jpg', true, 21),
('Costumes', 'costumes', 'Halloween, cosplay, and themed costumes', '🎭', '/categories/costumes.jpg', true, 22),
('Inflatables', 'inflatables', 'Bounce houses, slides, and inflatable games', '🎪', '/categories/inflatables.jpg', true, 23),
('Catering Equipment', 'catering-equipment', 'Commercial kitchen equipment and serving supplies', '🍽️', '/categories/catering.jpg', true, 24),

-- Sports & Recreation
('Sports Equipment', 'sports-equipment', 'Bikes, skis, surfboards, and sports gear', '⚽', '/categories/sports.jpg', true, 25),
('Camping Gear', 'camping-gear', 'Tents, sleeping bags, and outdoor equipment', '⛺', '/categories/camping.jpg', true, 26),
('Fitness Equipment', 'fitness-equipment', 'Treadmills, weights, and home gym equipment', '💪', '/categories/fitness.jpg', true, 27),
('Water Sports', 'water-sports', 'Kayaks, paddleboards, and snorkeling gear', '🏄', '/categories/water-sports.jpg', true, 28),

-- Baby & Kids
('Baby Equipment', 'baby-equipment', 'Strollers, car seats, cribs, and baby gear', '👶', '/categories/baby.jpg', true, 29),
('Kids Toys', 'kids-toys', 'Educational toys, ride-ons, and play equipment', '🧸', '/categories/toys.jpg', true, 30),

-- Fashion & Accessories
('Designer Bags', 'designer-bags', 'Luxury handbags and designer accessories', '👜', '/categories/bags.jpg', true, 31),
('Jewelry', 'jewelry', 'Fine jewelry for special occasions', '💎', '/categories/jewelry.jpg', true, 32),
('Formal Wear', 'formal-wear', 'Tuxedos, gowns, and formal attire', '👔', '/categories/formal-wear.jpg', true, 33),

-- Medical & Health
('Medical Equipment', 'medical-equipment', 'Wheelchairs, crutches, and medical devices', '🏥', '/categories/medical.jpg', true, 34),
('Mobility Aids', 'mobility-aids', 'Walkers, scooters, and accessibility equipment', '♿', '/categories/mobility.jpg', true, 35),

-- Miscellaneous
('Books & Media', 'books-media', 'Textbooks, audiobooks, and educational materials', '📚', '/categories/books.jpg', true, 36),
('Musical Instruments', 'musical-instruments', 'Guitars, pianos, drums, and band instruments', '🎸', '/categories/instruments.jpg', true, 37),
('Art Supplies', 'art-supplies', 'Easels, canvases, and professional art equipment', '🎨', '/categories/art.jpg', true, 38),
('Storage Units', 'storage-units', 'Personal and business storage spaces', '📦', '/categories/storage.jpg', true, 39),
('Other', 'other', 'Miscellaneous items and unique rentals', '📋', '/categories/other.jpg', true, 40)

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  image_url = EXCLUDED.image_url,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- ================================================================
-- VERIFICATION
-- ================================================================
-- Check how many categories were inserted
DO $$
DECLARE
  category_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO category_count FROM categories;
  RAISE NOTICE '✅ Total categories in database: %', category_count;
END $$;

-- Display all categories
SELECT 
  id,
  name,
  slug,
  icon,
  is_active,
  display_order
FROM categories
ORDER BY display_order;
