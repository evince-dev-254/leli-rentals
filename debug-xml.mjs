
// Simple script to just fetch and print the relevant XML lines
async function checkSeoXml() {
    try {
        const sitemapUrl = 'http://localhost:3000/sitemap.xml';
        console.log(`Fetching sitemap from ${sitemapUrl}...`);
        const res = await fetch(sitemapUrl);
        const xml = await res.text();

        const lines = xml.split('\n');
        // Find line with 'Safety & Trust' or similar if possible, or just print the block
        // The user said line 190.
        console.log('\n--- Sitemap XML Snippet (Lines 185-195) ---');
        lines.slice(185, 195).forEach((line, i) => {
            console.log(`${185 + i + 1}: ${line}`);
        });
        console.log('-------------------------------------------\n');

        // Also look for lines containing '& ' or '&' not followed by amp
        console.log('Searching for unescaped ampersands...');
        lines.forEach((line, i) => {
            if (line.includes('&') && !line.includes('&amp;')) {
                console.log(`Potential error on line ${i + 1}: ${line}`);
            }
        });

    } catch (err) {
        console.error('Script failed:', err);
    }
}

checkSeoXml();
