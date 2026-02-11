-- Create blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image TEXT,
    category TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE
    SET NULL,
        author_name TEXT,
        author_role TEXT,
        author_avatar TEXT,
        reading_time TEXT,
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Create blog_ratings table
CREATE TABLE IF NOT EXISTS public.blog_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (
        rating >= 1
        AND rating <= 5
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(blog_id, user_id)
);
-- Enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_ratings ENABLE ROW LEVEL SECURITY;
-- Policies for blogs
CREATE POLICY "Allow public read access to blogs" ON public.blogs FOR
SELECT USING (true);
CREATE POLICY "Allow authenticated users to create blogs" ON public.blogs FOR
INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authors to update their blogs" ON public.blogs FOR
UPDATE USING (auth.uid() = author_id);
-- Policies for blog_ratings
CREATE POLICY "Allow public read access to ratings" ON public.blog_ratings FOR
SELECT USING (true);
CREATE POLICY "Allow authenticated users to rate blogs" ON public.blog_ratings FOR
INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow users to update their own ratings" ON public.blog_ratings FOR
UPDATE USING (auth.uid() = user_id);
-- Create a view for blog summaries with rating stats
CREATE OR REPLACE VIEW public.blog_index_view AS
SELECT b.*,
    COALESCE(AVG(r.rating), 0) as average_rating,
    COUNT(r.id) as review_count
FROM public.blogs b
    LEFT JOIN public.blog_ratings r ON b.id = r.blog_id
GROUP BY b.id;