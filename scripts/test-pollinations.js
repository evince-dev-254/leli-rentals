const fs = require('fs');
const https = require('https');

async function testPollinations() {
    const prompt = 'futuristic flying car in nairobi';
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

    console.log(`Fetching: ${url}`);

    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            console.log(`Status Code: ${res.statusCode}`);
            if (res.statusCode === 200) {
                console.log("Image generation successful (status 200)");
                // We don't need to save it, just knowing it returns 200 is enough.
                resolve();
            } else {
                console.error("Failed to fetch image");
                reject(new Error(`Status ${res.statusCode}`));
            }
        }).on('error', (e) => {
            console.error("Error:", e);
            reject(e);
        });
    });
}

testPollinations();
