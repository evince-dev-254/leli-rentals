-- ============================================
-- ENABLE DYNAMIC CATEGORY CREATION
-- ============================================

-- 1. Enable RLS on Categories and Subcategories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Public Read Access" ON public.categories;
DROP POLICY IF EXISTS "Authenticated Insert Access" ON public.categories;
DROP POLICY IF EXISTS "Public Read Access" ON public.subcategories;
DROP POLICY IF EXISTS "Authenticated Insert Access" ON public.subcategories;

-- 3. Create Policies for Categories
-- Allow anyone to read categories (renters, owners, anon)
CREATE POLICY "Public Read Access"
ON public.categories FOR SELECT
TO public
USING (true);

-- Allow any authenticated user (Owner) to create a new category
CREATE POLICY "Authenticated Insert Access"
ON public.categories FOR INSERT
TO authenticated
WITH CHECK (true);

-- 4. Create Policies for Subcategories
-- Allow anyone to read subcategories
CREATE POLICY "Public Read Access"
ON public.subcategories FOR SELECT
TO public
USING (true);

-- Allow any authenticated user (Owner) to create a new subcategory
CREATE POLICY "Authenticated Insert Access"
ON public.subcategories FOR INSERT
TO authenticated
WITH CHECK (true);

-- 5. Verification (Optional - creates a test category to confirm)
-- INSERT INTO public.categories (name, slug, description) VALUES ('Test Category', 'test-category', 'Test') ON CONFLICT DO NOTHING;
