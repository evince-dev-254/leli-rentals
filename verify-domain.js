import { google } from "googleapis";
import { config } from "dotenv";
config({ path: ".env.local" });

const DOMAIN = "leli.rentals";

async function verifyKey(credentials, keyName) {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/siteverification"],
  });

  const client = await auth.getClient();
  const siteVerification = google.siteVerification({ version: "v1", auth: client });

  await siteVerification.webResource.insert({
    verificationMethod: "DNS_TXT",
    requestBody: {
      site: {
        type: "INET_DOMAIN",
        identifier: DOMAIN,
      },
    },
  });

  console.log(`✅ ${keyName} verified successfully!`);
}

async function verifyAll() {
  let i = 1;
  while (process.env[`GOOGLE_SERVICE_ACCOUNT_KEY_${i}`]) {
    const keyName = `GOOGLE_SERVICE_ACCOUNT_KEY_${i}`;
    try {
      const credentials = JSON.parse(process.env[keyName]);
      await verifyKey(credentials, keyName);
    } catch (err) {
      console.error(`❌ ${keyName} failed: ${err.message}`);
    }
    i++;
  }
  console.log(`\n🎉 Done! Attempted verification for ${i - 1} keys.`);
}

verifyAll().catch(console.error);