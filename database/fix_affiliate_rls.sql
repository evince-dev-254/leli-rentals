-- Add RLS policies for affiliates table to allow users to read their own data

-- Enable RLS if not already enabled
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own affiliate data" ON public.affiliates;
DROP POLICY IF EXISTS "Users can create their own affiliate record" ON public.affiliates;
DROP POLICY IF EXISTS "Users can update their own affiliate data" ON public.affiliates;
DROP POLICY IF EXISTS "Affiliates can view their own referrals" ON public.affiliate_referrals;

-- Allow users to view their own affiliate data
CREATE POLICY "Users can view their own affiliate data"
    ON public.affiliates FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own affiliate record (for self-registration)
CREATE POLICY "Users can create their own affiliate record"
    ON public.affiliates FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own affiliate data
CREATE POLICY "Users can update their own affiliate data"
    ON public.affiliates FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Add policy for affiliate_referrals table
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;

-- Allow affiliates to view their own referrals
CREATE POLICY "Affiliates can view their own referrals"
    ON public.affiliate_referrals FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.affiliates
            WHERE affiliates.id = affiliate_referrals.affiliate_id
            AND affiliates.user_id = auth.uid()
        )
    );
