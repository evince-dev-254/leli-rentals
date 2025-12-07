-- Add columns for back image and selfie to verification_documents table
ALTER TABLE public.verification_documents
ADD COLUMN IF NOT EXISTS back_image_url TEXT,
ADD COLUMN IF NOT EXISTS selfie_image_url TEXT;

-- Verify columns were added (optional select, just for confirmation if run in tool)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'verification_documents';
