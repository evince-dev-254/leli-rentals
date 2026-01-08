-- Add service fee percentage to admin_settings
INSERT INTO public.admin_settings (key, value, description)
VALUES ('renter_service_fee_percentage', '5', 'Percentage fee charged to renters on each booking')
ON CONFLICT (key) DO NOTHING;
