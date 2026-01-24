
const fs = require('fs');
const path = require('path');
const https = require('https');

const FILES_TO_CHECK = [
    path.join(__dirname, '..', 'lib', 'categories-data.ts'),
    path.join(__dirname, '..', 'database', 'reset_and_seed_subcategory_images.sql')
];

let checkCount = 0;
let errorCount = 0;

async function checkUrl(url) {
    return new Promise((resolve) => {
        const req = https.request(url, { method: 'HEAD', headers: { 'User-Agent': 'Bot' } }, (res) => {
            if (res.statusCode >= 400) {
                console.log(`[${res.statusCode}] Broken: ${url}`);
                errorCount++;
            }
            resolve();
        });
        req.on('error', (e) => {
            console.log(`[Error] ${e.message}: ${url}`);
            errorCount++;
            resolve();
        });
        req.end();
    });
}

async function main() {
    let allUrls = new Set();

    for (const filePath of FILES_TO_CHECK) {
        if (fs.existsSync(filePath)) {
            console.log(`Scanning ${path.basename(filePath)}...`);
            const content = fs.readFileSync(filePath, 'utf8');
            const urlRegex = /https:\/\/images\.unsplash\.com\/[^"']+/g;
            const matches = content.match(urlRegex) || [];
            matches.forEach(url => allUrls.add(url));
        } else {
            console.error(`File not found: ${filePath}`);
        }
    }

    const urls = [...allUrls];
    console.log(`Found ${urls.length} unique URLs to check across all files.`);

    // Process in chunks
    const CHUNK_SIZE = 10;
    for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
        const chunk = urls.slice(i, i + CHUNK_SIZE);
        await Promise.all(chunk.map(checkUrl));
        checkCount += chunk.length;
        if (checkCount % 50 === 0 || checkCount === urls.length) {
            console.log(`Checked ${checkCount}/${urls.length}`);
        }
    }
    console.log('\nDone.');

    if (errorCount > 0) {
        console.log(`Found ${errorCount} broken URLs.`);
        process.exit(1);
    } else {
        console.log('All URLs are valid.');
    }
}

main();
