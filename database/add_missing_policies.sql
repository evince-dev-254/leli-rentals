-- Add missing RLS policies for verification_documents

-- Enable RLS
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;

-- Users can view their own documents
CREATE POLICY "Users can view their own verification documents"
    ON public.verification_documents FOR SELECT
    USING (auth.uid() = user_id);

-- Users can upload their own documents
CREATE POLICY "Users can upload their own verification documents"
    ON public.verification_documents FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own documents (optional, but good for retrying)
CREATE POLICY "Users can delete their own verification documents"
    ON public.verification_documents FOR DELETE
    USING (auth.uid() = user_id);

-- Trigger to update updated_at
DROP TRIGGER IF EXISTS update_verification_documents_updated_at ON public.verification_documents;
CREATE TRIGGER update_verification_documents_updated_at BEFORE UPDATE ON public.verification_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
