import { google } from "googleapis";

const KEY_FILE = "./service-account.json";
const DOMAIN = "leli.rentals";

async function getToken() {
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

  console.log("\n✅ Your DNS TXT verification token:");
  console.log(response.data.token);
}

getToken().catch(console.error);