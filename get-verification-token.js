import { google } from "googleapis";
import { config } from "dotenv";
config({ path: ".env.local" });

const KEY_FILE = process.argv[2];
const DOMAIN = "leli.rentals";

async function getToken() {
  if (!KEY_FILE) {
    console.error("❌ Please provide a key file path:");
    console.error("   node get-token.js ./path-to-key.json");
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ["https://www.googleapis.com/auth/siteverification"],
  });

  const client = await auth.getClient();
  const siteVerification = google.siteVerification({ version: "v1", auth: client });

  const response = await siteVerification.webResource.getToken({
    requestBody: {
      site: {
        type: "INET_DOMAIN",
        identifier: DOMAIN,
      },
      verificationMethod: "DNS_TXT",
    },
  });

  console.log("\n✅ DNS TXT verification token for:", KEY_FILE);
  console.log(response.data.token);
  console.log("\n📋 Add this TXT record to Cloudflare DNS:");
  console.log("   Type: TXT");
  console.log("   Name: @");
  console.log("   Value:", response.data.token);
}

getToken().catch(console.error);