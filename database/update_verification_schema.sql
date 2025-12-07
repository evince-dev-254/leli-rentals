-- Update user_profiles table with verification related fields
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS next_of_kin_name TEXT,
ADD COLUMN IF NOT EXISTS next_of_kin_phone TEXT,
ADD COLUMN IF NOT EXISTS next_of_kin_relationship TEXT;

-- Ensure verification_documents has document_number (it should, but just in case)
ALTER TABLE public.verification_documents
ADD COLUMN IF NOT EXISTS document_number TEXT;
