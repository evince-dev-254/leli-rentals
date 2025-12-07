-- Create admin_settings table for platform configuration
CREATE TABLE IF NOT EXISTS public.admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.user_profiles(id)
);

-- Enable RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Policies

-- Allow admins to do everything
CREATE POLICY "Admins can manage settings" 
ON public.admin_settings 
FOR ALL 
USING (
  public.is_admin()
);

-- Allow public to read SPECIFIC non-sensitive settings (like public keys, site info)
CREATE POLICY "Public can read public settings" 
ON public.admin_settings 
FOR SELECT 
USING (
  key IN (
    'paystack_public_key', 
    'site_name', 
    'support_email', 
    'support_phone', 
    'default_currency'
  )
);

-- Seed initial values (optional, avoids empty state)
INSERT INTO public.admin_settings (key, value, description)
VALUES 
    ('paystack_public_key', '', 'Paystack Public Key for client-side usage'),
    ('paystack_secret_key', '', 'Paystack Secret Key for server-side usage'),
    ('weekly_plan_price', '500', 'Price for weekly subscription'),
    ('weekly_plan_limit', '10', 'Listing limit for weekly subscription'),
    ('monthly_plan_price', '1000', 'Price for monthly subscription'),
    ('monthly_plan_limit', 'Unlimited', 'Listing limit for monthly subscription'),
    ('affiliate_commission_rate', '15', 'Percentage commission for affiliates'),
    ('site_name', 'Leli Rentals', 'Name of the platform'),
    ('support_email', 'support@lelirentals.com', 'Support contact email'),
    ('support_phone', '+254 700 000 000', 'Support contact phone'),
    ('default_currency', 'KSh', 'Default currency symbol')
ON CONFLICT (key) DO NOTHING;
