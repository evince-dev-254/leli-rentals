-- Add missing RLS policies for verification_documents

-- Allow users to view their own verification documents
CREATE POLICY "Users can view their own verification documents"
ON public.verification_documents
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to upload their own verification documents
CREATE POLICY "Users can upload their own verification documents"
ON public.verification_documents
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own verification documents (if needed)
CREATE POLICY "Users can delete their own verification documents"
ON public.verification_documents
FOR DELETE
USING (auth.uid() = user_id);
