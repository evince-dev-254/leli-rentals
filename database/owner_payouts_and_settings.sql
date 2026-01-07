-- Migration: Add payment info to user_profiles and create generic payout requests table

-- 1. Add payment_info to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS payment_info JSONB DEFAULT '{}'::jsonb;

-- 2. Create generic payout_requests table
CREATE TABLE IF NOT EXISTS public.payout_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 100),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
    payment_method TEXT NOT NULL, -- 'mpesa', 'bank'
    payment_details JSONB NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    role TEXT NOT NULL DEFAULT 'renter' -- To track if it's an owner payout or affiliate payout
);

-- 3. Enable RLS
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;

-- 4. Policies
CREATE POLICY "Users can view own payout requests" ON public.payout_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payout requests" ON public.payout_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Trigger for updated_at
DROP TRIGGER IF EXISTS update_payout_requests_updated_at ON public.payout_requests;
CREATE TRIGGER update_payout_requests_updated_at BEFORE UPDATE ON public.payout_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
