-- Enable RLS on verification_documents table
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean slate
DROP POLICY IF EXISTS "Users can view their own verification documents" ON public.verification_documents;
DROP POLICY IF EXISTS "Users can upload their own verification documents" ON public.verification_documents;
DROP POLICY IF EXISTS "Users can delete their own verification documents" ON public.verification_documents;
DROP POLICY IF EXISTS "Admins can view all verification documents" ON public.verification_documents;
DROP POLICY IF EXISTS "Admins can update verification documents" ON public.verification_documents;

-- Policy 1: Users can view their own documents
CREATE POLICY "Users can view their own verification documents"
ON public.verification_documents
FOR SELECT
USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own documents
CREATE POLICY "Users can upload their own verification documents"
ON public.verification_documents
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own documents (if needed, e.g. re-submission)
CREATE POLICY "Users can update their own verification documents"
ON public.verification_documents
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy 4: Admins can view ALL documents
CREATE POLICY "Admins can view all verification documents"
ON public.verification_documents
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() 
    AND (role = 'admin' OR is_admin = true)
  )
);

-- Policy 5: Admins can update ALL documents (approve/reject)
CREATE POLICY "Admins can update verification documents"
ON public.verification_documents
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() 
    AND (role = 'admin' OR is_admin = true)
  )
);

-- Verify policies
SELECT * FROM pg_policies WHERE tablename = 'verification_documents';
