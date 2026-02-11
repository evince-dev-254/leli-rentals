import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tdtjevpnqrwqcjnuywrn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkdGpldnBucXJ3cWNqbnV5d3JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NzA0NzcsImV4cCI6MjA4MDQ0NjQ3N30.YX1s_FIYlL7L86mlEWI5cFeiGUCfuj458tvk3Ahonvs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
