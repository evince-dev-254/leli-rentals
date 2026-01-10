-- ============================================
-- SETUP CRON JORS (Supabase pg_cron)
-- Description: Enables necessary extensions and schedules the email reminder job.
-- PREREQUISITES: 
-- 1. Enable 'pg_cron' and 'pg_net' extensions in your Supabase Dashboard -> Database -> Extensions.
-- 2. You MUST replace 'YOUR_SITE_URL' and 'YOUR_CRON_SECRET' below with your actual values.
-- ============================================

-- 1. Enable Extensions (If not already enabled via Dashboard)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Schedule the Job (Runs Daily at 10:00 AM UTC)
-- NOTE: Update the URL to your deployed domain (e.g., https://your-site.com/api/cron/reminders)
-- NOTE: Update the Bearer token to match your CRON_SECRET env variable.

SELECT cron.schedule(
    'daily-email-reminders',   -- Job name
    '0 10 * * *',              -- Schedule (10:00 AM Daily)
    $$
    SELECT
        net.http_get(
            -- URL to your API route
            url:='YOUR_SITE_URL/api/cron/reminders?type=all',
            
            -- Headers (Auth)
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_CRON_SECRET"}'::jsonb
        ) as request_id;
    $$
);

-- TO VERIFY:
-- select * from cron.job;

-- TO UNSCHEDULE:
-- select cron.unschedule('daily-email-reminders');
