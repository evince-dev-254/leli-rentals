import { google } from "googleapis";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { config } from "dotenv";
config({ path: ".env.local" });

// ─── MULTI-KEY AUTH ────────────────────────────────────────
function loadAllKeys() {
  const keys = [];

  // Load all numbered keys from env
  let i = 1;
  while (process.env[`GOOGLE_SERVICE_ACCOUNT_KEY_${i}`]) {
    keys.push(JSON.parse(process.env[`GOOGLE_SERVICE_ACCOUNT_KEY_${i}`]));
    i++;
  }

  // Fallback to single key for backward compatibility
  if (keys.length === 0 && process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    keys.push(JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY));
  }

  if (keys.length === 0) {
    throw new Error("No service account keys found in .env.local");
  }

  console.log(`🔑 Loaded ${keys.length} service account key(s)`);
  return keys;
}

function getAuthForKey(credentials) {
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });
}

// ─── CONFIG ────────────────────────────────────────────────
const QUOTA_PER_KEY = 200;
const PROGRESS_FILE = "./indexing-progress.json";
const SITEMAP_URL = "https://www.leli.rentals/sitemap.xml";

// ─── LOAD / SAVE PROGRESS ──────────────────────────────────
function loadProgress() {
  if (existsSync(PROGRESS_FILE)) {
    return JSON.parse(readFileSync(PROGRESS_FILE, "utf8"));
  }
  return { submitted: [], lastRun: null };
}

function saveProgress(progress) {
  writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// ─── FETCH SITEMAP ─────────────────────────────────────────
async function fetchSitemapUrls() {
  console.log("📡 Fetching sitemap...");
  const res = await fetch(SITEMAP_URL);
  const xml = await res.text();

  const matches = xml.matchAll(/<loc>(.*?)<\/loc>/g);
  const urls = [];
  for (const match of matches) {
    urls.push(match[1].trim());
  }

  if (xml.includes("<sitemapindex")) {
    console.log("📡 Detected sitemap index, fetching sub-sitemaps...");
    const subUrls = [];
    for (const url of urls) {
      const subRes = await fetch(url);
      const subXml = await subRes.text();
      const subMatches = subXml.matchAll(/<loc>(.*?)<\/loc>/g);
      for (const match of subMatches) {
        subUrls.push(match[1].trim());
      }
    }
    return subUrls;
  }

  return urls;
}

// ─── MAIN ──────────────────────────────────────────────────
async function runIndexing() {
  const allKeys = loadAllKeys();
  const totalQuota = allKeys.length * QUOTA_PER_KEY;
  console.log(`📊 Total quota today: ${totalQuota} URLs (${allKeys.length} keys × ${QUOTA_PER_KEY})`);

  const allUrls = await fetchSitemapUrls();
  console.log(`✅ Found ${allUrls.length} URLs in sitemap`);

  const progress = loadProgress();
  const alreadySubmitted = new Set(progress.submitted);

  const pending = allUrls.filter((url) => !alreadySubmitted.has(url));
  console.log(`📋 Already submitted: ${alreadySubmitted.size}`);
  console.log(`📋 Pending: ${pending.length}`);

  if (pending.length === 0) {
    console.log("✅ All sitemap URLs have been submitted!");
    return;
  }

  // Take up to totalQuota URLs for today
  const todaysBatch = pending.slice(0, totalQuota);
  console.log(`\n🚀 Submitting ${todaysBatch.length} URLs using ${allKeys.length} keys...\n`);

  const results = { success: [], failed: [] };
  let currentKeyIndex = 0;
  let countForCurrentKey = 0;
  let currentClient = await getAuthForKey(allKeys[0]).getClient();
  let currentIndexing = google.indexing({ version: "v3", auth: currentClient });

  for (const url of todaysBatch) {
    // Rotate key after every 200 requests
    if (countForCurrentKey >= QUOTA_PER_KEY) {
      currentKeyIndex++;
      countForCurrentKey = 0;
      console.log(`\n🔄 Switching to key ${currentKeyIndex + 1} of ${allKeys.length}...\n`);
      currentClient = await getAuthForKey(allKeys[currentKeyIndex]).getClient();
      currentIndexing = google.indexing({ version: "v3", auth: currentClient });
    }

    try {
      await currentIndexing.urlNotifications.publish({
        requestBody: { url, type: "URL_UPDATED" },
      });
      results.success.push(url);
      progress.submitted.push(url);
      countForCurrentKey++;
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      results.failed.push({ url, error: err.message });
      countForCurrentKey++;
    }
  }

  progress.lastRun = new Date().toISOString();
  saveProgress(progress);

  console.log(`\n📊 Results:`);
  console.log(`  ✅ Success: ${results.success.length}`);
  console.log(`  ❌ Failed:  ${results.failed.length}`);
  console.log(`  📋 Remaining after today: ${pending.length - todaysBatch.length}`);

  const daysLeft = Math.ceil((pending.length - todaysBatch.length) / totalQuota);
  if (daysLeft > 0) {
    console.log(`  ⏳ Days to complete at ${totalQuota}/day: ~${daysLeft} days`);
    console.log(`  👉 Run this script again tomorrow.`);
  } else {
    console.log(`  🎉 All URLs submitted!`);
  }

}

runIndexing().catch(console.error);