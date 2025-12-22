const fs = require('fs');
const https = require('https');
const crypto = require('crypto');

/**
 * Google RISC Registration Script
 * This script registers your Webhook URL with Google's Cross-Account Protection service.
 */

const WEBHOOK_URL = 'https://www.leli.rentals/api/webhooks/google-risc';
const SERVICE_ACCOUNT_FILE = process.argv[2];

if (!SERVICE_ACCOUNT_FILE) {
    console.error('Error: Please provide the path to your Service Account JSON file.');
    console.log('Usage: node scripts/register-risc.js path/to/service-account.json');
    process.exit(1);
}

async function register() {
    try {
        const key = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_FILE, 'utf8'));

        console.log(`Starting RISC registration for: ${WEBHOOK_URL}`);
        console.log(`Using Service Account: ${key.client_email}`);

        // 1. Create JWT for Authorization
        const now = Math.floor(Date.now() / 1000);
        const header = { alg: 'RS256', typ: 'JWT' };
        const payload = {
            iss: key.client_email,
            sub: key.client_email,
            aud: 'https://risc.googleapis.com/google.identity.risc.v1beta.RiscManagementService',
            iat: now,
            exp: now + 3600,
        };

        const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
        const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
        const signatureInput = `${encodedHeader}.${encodedPayload}`;

        const signer = crypto.createSign('RSA-SHA256');
        signer.update(signatureInput);
        const signature = signer.sign(key.private_key, 'base64url');

        const jwt = `${signatureInput}.${signature}`;

        // 2. Call RISC Update API
        const postData = JSON.stringify({
            delivery: {
                delivery_method: 'https://schemas.openid.net/secevent/risc/delivery-method/push',
                url: WEBHOOK_URL,
            },
            events_requested: [
                'https://schemas.openid.net/secevent/risc/event-type/account-disabled',
                'https://schemas.openid.net/secevent/risc/event-type/account-enabled',
                'https://schemas.openid.net/secevent/risc/event-type/account-credential-change-required',
                'https://schemas.openid.net/secevent/risc/event-type/tokens-revoked'
            ],
        });

        const options = {
            hostname: 'risc.googleapis.com',
            port: 443,
            path: '/v1beta/stream:update',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json',
                'Content-Length': postData.length,
            },
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('\n✅ SUCCESS! Your RISC Webhook is now registered.');
                    console.log('Google will now send security events to your endpoint.');
                } else {
                    console.error(`\n❌ FAILED (Status ${res.statusCode})`);
                    console.error('Response:', data);
                    if (data.includes('not enabled')) {
                        console.log('\nTIP: Make sure you enabled the "RISC API" in the Google Cloud Console.');
                    }
                }
            });
        });

        req.on('error', (e) => console.error('Request error:', e));
        req.write(postData);
        req.end();

    } catch (error) {
        console.error('Error:', error.message);
    }
}

register();
