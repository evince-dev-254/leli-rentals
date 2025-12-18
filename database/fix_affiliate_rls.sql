-- RLS Policies for Affiliates table
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own affiliate record" ON public.affiliates;
CREATE POLICY "Users can view their own affiliate record"
    ON public.affiliates FOR SELECT
    USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can join the affiliate program" ON public.affiliates;
CREATE POLICY "Users can join the affiliate program"
    ON public.affiliates FOR INSERT
    WITH CHECK (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can update their own affiliate record" ON public.affiliates;
CREATE POLICY "Users can update their own affiliate record"
    ON public.affiliates FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for Affiliate Referrals table
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Affiliates can view their own referrals" ON public.affiliate_referrals;
CREATE POLICY "Affiliates can view their own referrals"
    ON public.affiliate_referrals FOR SELECT
    USING (
        affiliate_id IN (
            SELECT id FROM public.affiliates WHERE user_id = auth.uid()
        )
    );
