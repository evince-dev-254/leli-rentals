import { google } from "googleapis";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { config } from "dotenv";
config({ path: ".env.local" });

function getAuth() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_1) {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_1);
    return new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/indexing"],
    });
  }
  return new google.auth.GoogleAuth({
    keyFile: "./service-account.json",
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });
}

// ─── CONFIG ────────────────────────────────────────────────
const BATCH_SIZE = 200;
const PROGRESS_FILE = "./indexing-progress.json";

// ─── PRIORITY URL LIST ─────────────────────────────────────
const PRIORITY_URLS = [
  // Tier 1: Earn pages
  "https://www.leli.rentals/earn/vehicles",
  "https://www.leli.rentals/earn/photography",
  "https://www.leli.rentals/earn/living-spaces",
  "https://www.leli.rentals/earn/equipment-tools",
  "https://www.leli.rentals/earn/electronics",
  "https://www.leli.rentals/earn/fashion-accessories",
  "https://www.leli.rentals/earn/entertainment",
  "https://www.leli.rentals/earn/utility-spaces",
  "https://www.leli.rentals/earn/business-spaces",
  "https://www.leli.rentals/earn/fitness-sports",
  "https://www.leli.rentals/earn/baby-kids",

  // Tier 2: Compare pages
  "https://www.leli.rentals/compare/turo-vs-leli-rentals",
  "https://www.leli.rentals/compare/airbnb-vs-leli-rentals",
  "https://www.leli.rentals/compare/fat-llama-vs-leli-rentals",
  "https://www.leli.rentals/compare/rent-the-runway-vs-leli-rentals",
  "https://www.leli.rentals/compare/sharegrid-vs-leli-rentals",
  "https://www.leli.rentals/compare/wework-vs-leli-rentals",
  "https://www.leli.rentals/compare/babyquip-vs-leli-rentals",
  "https://www.leli.rentals/compare/spinlister-vs-leli-rentals",
  "https://www.leli.rentals/compare/neighbor-vs-leli-rentals",
  "https://www.leli.rentals/compare/peerspace-vs-leli-rentals",
  "https://www.leli.rentals/compare/getaround-vs-leli-rentals",

  // Tier 3: Review pages
  "https://www.leli.rentals/review/turo",
  "https://www.leli.rentals/review/airbnb",
  "https://www.leli.rentals/review/fat-llama",
  "https://www.leli.rentals/review/rent-the-runway",
  "https://www.leli.rentals/review/sharegrid",
  "https://www.leli.rentals/review/wework",
  "https://www.leli.rentals/review/babyquip",
  "https://www.leli.rentals/review/spinlister",
  "https://www.leli.rentals/review/neighbor",
  "https://www.leli.rentals/review/peerspace",
  "https://www.leli.rentals/review/getaround",

  // Tier 4: Hubs
  "https://www.leli.rentals/explore",
  "https://www.leli.rentals/compare",
  "https://www.leli.rentals/review",

  // Tier 5: Top renter pages
  "https://www.leli.rentals/rent-a-car-in-dubai",
  "https://www.leli.rentals/rent-a-car-in-london",
  "https://www.leli.rentals/rent-a-car-in-new-york",
  "https://www.leli.rentals/rent-a-car-in-los-angeles",
  "https://www.leli.rentals/rent-a-car-in-miami",
  "https://www.leli.rentals/airbnb-alternative",
  "https://www.leli.rentals/turo-alternative",
  "https://www.leli.rentals/rent-camera-gear-in-new-york",
  "https://www.leli.rentals/rent-camera-gear-in-los-angeles",
  "https://www.leli.rentals/rent-tools-in-london",
  "https://www.leli.rentals/rent-tools-in-new-york",
  "https://www.leli.rentals/rent-equipment-in-dubai",
  "https://www.leli.rentals/rent-photography-equipment-in-london",
  "https://www.leli.rentals/rent-a-van-in-london",
  "https://www.leli.rentals/rent-luxury-car-in-dubai",
];

// ─── LOAD PROGRESS ─────────────────────────────────────────
function loadProgress() {
  if (existsSync(PROGRESS_FILE)) {
    return JSON.parse(readFileSync(PROGRESS_FILE, "utf8"));
  }
  return { submitted: [], lastRun: null };
}

function saveProgress(progress) {
  writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// ─── MAIN ──────────────────────────────────────────────────
async function runIndexing() {
  const auth = getAuth();

  const client = await auth.getClient();
  const indexing = google.indexing({ version: "v3", auth: client });

  const progress = loadProgress();
  const alreadySubmitted = new Set(progress.submitted);

  const pending = PRIORITY_URLS.filter((url) => !alreadySubmitted.has(url));

  if (pending.length === 0) {
    console.log("✅ All priority URLs already submitted.");
    return;
  }

  const batch = pending.slice(0, BATCH_SIZE);
  console.log(`\n🚀 Submitting ${batch.length} URLs to Google Indexing API...\n`);

  const results = { success: [], failed: [] };

  for (const url of batch) {
    try {
      await indexing.urlNotifications.publish({
        requestBody: {
          url,
          type: "URL_UPDATED",
        },
      });

      results.success.push(url);
      progress.submitted.push(url);
      console.log(`  ✓ ${url}`);

      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      results.failed.push({ url, error: err.message });
      console.error(`  ✗ ${url} — ${err.message}`);
    }
  }

  progress.lastRun = new Date().toISOString();
  saveProgress(progress);

  console.log(`\n📊 Results:`);
  console.log(`  ✅ Success: ${results.success.length}`);
  console.log(`  ❌ Failed:  ${results.failed.length}`);
  console.log(`  📋 Remaining: ${pending.length - batch.length}`);

  if (results.failed.length > 0) {
    console.log("\n⚠️  Failed URLs:");
    results.failed.forEach((f) => console.log(`  - ${f.url}: ${f.error}`));
  }

  if (pending.length > BATCH_SIZE) {
    console.log(`\n⏳ Run again tomorrow for the next ${pending.length - BATCH_SIZE} URLs.`);
  }
}

runIndexing().catch(console.error);