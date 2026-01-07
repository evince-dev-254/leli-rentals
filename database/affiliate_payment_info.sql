-- Add payment_info column to affiliates table to store JSONB details
ALTER TABLE public.affiliates 
ADD COLUMN IF NOT EXISTS payment_info JSONB DEFAULT '{}'::jsonb;

-- Comment on column for clarity
COMMENT ON COLUMN public.affiliates.payment_info IS 'Stores payment details like { type, provider, account_number, account_name }';

-- Function to update payment info (optional wrapper, but direct update via RLS is fine too)
-- Ensure RLS allows update of this column (usually "Users can update own affiliate record" policy exists)
-- If not, we might need a specific policy, but typically the "update own" covers all columns.
