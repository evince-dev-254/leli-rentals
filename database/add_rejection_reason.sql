ALTER TABLE public.verification_documents
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
