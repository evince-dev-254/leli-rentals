-- Create table for tracking affiliate withdrawals
CREATE TABLE IF NOT EXISTS public.affiliate_withdrawals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 100), -- Enforce minimum withdrawal at DB level
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
    payment_method TEXT NOT NULL, -- e.g. 'paystack_transfer', 'mpesa', 'bank'
    payment_details JSONB, -- Stores recipient code, phone number, etc.
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.affiliate_withdrawals ENABLE ROW LEVEL SECURITY;

-- Policy: Affiliates can view their own withdrawals
CREATE POLICY "Affiliates can view own withdrawals" ON public.affiliate_withdrawals
    FOR SELECT USING (
        affiliate_id IN (
            SELECT id FROM public.affiliates WHERE user_id = auth.uid()
        )
    );

-- Policy: Admin can view all
-- (Assuming admin check is done via role in user_profiles, but for simplicity we rely on service role for admin dashboard usually)

-- Trigger for updated_at
CREATE TRIGGER update_affiliate_withdrawals_updated_at BEFORE UPDATE ON public.affiliate_withdrawals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
