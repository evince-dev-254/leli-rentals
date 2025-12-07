-- Add missing RLS policies for verification_documents
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own verification documents"
ON public.verification_documents FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own verification documents"
ON public.verification_documents FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own verification documents"
ON public.verification_documents FOR DELETE
USING (auth.uid() = user_id);

-- Add new columns for enhanced verification
ALTER TABLE public.verification_documents
ADD COLUMN IF NOT EXISTS back_image_url TEXT,
ADD COLUMN IF NOT EXISTS selfie_image_url TEXT;

COMMENT ON COLUMN public.verification_documents.document_url IS 'Stores the URL of the Front ID image';
