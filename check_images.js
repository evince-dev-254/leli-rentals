const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkListings() {
    const { data, error } = await supabase
        .from('listings')
        .select('id, title, images')
        .limit(10);

    if (error) {
        console.error('Error fetching listings:', error);
        return;
    }

    console.log('List of 10 listings and their images:');
    data.forEach(l => {
        console.log(`ID: ${l.id}, Title: ${l.title}, Images: ${JSON.stringify(l.images)}`);
    });
}

checkListings();
