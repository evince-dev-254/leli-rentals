import { google } from "googleapis";

const KEY_FILE = "./service-account.json";
const DOMAIN = "leli.rentals";

async function verify() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ["https://www.googleapis.com/auth/siteverification"],
  });

  const client = await auth.getClient();
  const siteVerification = google.siteVerification({ version: "v1", auth: client });

  const response = await siteVerification.webResource.insert({
    verificationMethod: "DNS_TXT",
    requestBody: {
      site: {
        type: "INET_DOMAIN",
        identifier: DOMAIN,
      },
    },
  });

  console.log("✅ Verified! Service account is now a verified owner.");
  console.log(response.data);
}

verify().catch(console.error);