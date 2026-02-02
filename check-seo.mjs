
// import { parseStringPromise } from 'xml2js';
// Actually I'll use regex.

async function checkSeo() {
    try {
        const sitemapUrl = 'http://localhost:3000/sitemap.xml';
        console.log(`Fetching sitemap from ${sitemapUrl}...`);
        const res = await fetch(sitemapUrl);
        const xml = await res.text();

        // Debug: Print the XML lines to see what's wrong around line 190
        const lines = xml.split('\n');
        // print lines 185 to 195
        console.log('\n--- Sitemap XML Snippet (Lines 180-200) ---');
        lines.slice(180, 200).forEach((line, i) => {
            console.log(`${180 + i + 1}: ${line}`);
        });
        console.log('-------------------------------------------\n');

        // Extract URLs
        const regex = /<loc>(.*?)<\/loc>/g;
        let match;
        const urls = [];
        while ((match = regex.exec(xml)) !== null) {
            urls.push(match[1]);
        }

        console.log(`Found ${urls.length} URLs in sitemap.`);

        const results = [];

        for (const url of urls) {
            // Replace domain for local testing
            const localUrl = url.replace('https://www.leli.rentals', 'http://localhost:3000');

            try {
                const pageRes = await fetch(localUrl, { redirect: 'manual' });
                results.push({
                    url: url,
                    status: pageRes.status,
                    redirect: pageRes.headers.get('location')
                });
                console.log(`[${pageRes.status}] ${url}`);
            } catch (e) {
                console.error(`Error fetching ${localUrl}:`, e.message);
                results.push({ url, status: 'ERROR', error: e.message });
            }
        }

        console.log('\n--- Summary ---');
        const redirects = results.filter(r => r.status >= 300 && r.status < 400);
        const errors = results.filter(r => r.status >= 400 || r.status === 'ERROR');

        if (redirects.length > 0) {
            console.log('\nRedirects found:');
            redirects.forEach(r => console.log(`${r.url} -> ${r.redirect} (${r.status})`));
        } else {
            console.log('\nNo application-level redirects found.');
        }

        if (errors.length > 0) {
            console.log('\nErrors found:');
            errors.forEach(r => console.log(`${r.url} -> ${r.status}`));
        } else {
            console.log('\nNo errors found.');
        }

    } catch (err) {
        console.error('Script failed:', err);
    }
}

checkSeo();
