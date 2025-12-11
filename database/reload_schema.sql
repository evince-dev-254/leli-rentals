-- Force a reload of the PostgREST schema cache
-- This is necessary when adding new columns (like date_of_birth, last_login_at) so the API knows about them.

NOTIFY pgrst, 'reload schema';
