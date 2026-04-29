import { google } from "googleapis";
import { readFileSync, writeFileSync, existsSync } from "fs";

const KEY_FILE = "./service-account.json";
const BATCH_SIZE = 200;
const PROGRESS_FILE = "./indexing-progress.json";
const SITEMAP_URL = "https://www.leli.rentals/sitemap.xml";

function loadProgress() {
  if (existsSync(PROGRESS_FILE)) {
    return JSON.parse(readFileSync(PROGRESS_FILE, "utf8"));
  }
  return { submitted: [], lastRun: null };
}

function saveProgress(progress) {
  writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

async function fetchSitemapUrls() {
  console.log("📡 Fetching sitemap...");
  const res = await fetch(SITEMAP_URL);
  const xml = await res.text();

  // Extract all <loc> URLs
  const matches = xml.matchAll(/<loc>(.*?)<\/loc>/g);
  const urls = [];
  for (const match of matches) {
    urls.push(match[1].trim());
  }

  // If sitemap index (contains <sitemap> tags), fetch sub-sitemaps
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

async function runIndexing() {
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

  const batch = pending.slice(0, BATCH_SIZE);
  console.log(`\n🚀 Submitting ${batch.length} URLs...\n`);

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });

  const client = await auth.getClient();
  const indexing = google.indexing({ version: "v3", auth: client });

  const results = { success: [], failed: [] };

  for (const url of batch) {
    try {
      await indexing.urlNotifications.publish({
        requestBody: { url, type: "URL_UPDATED" },
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
  console.log(`  📋 Remaining after today: ${pending.length - batch.length}`);

  const daysLeft = Math.ceil((pending.length - batch.length) / BATCH_SIZE);
  if (daysLeft > 0) {
    console.log(`  ⏳ Days to complete at 200/day: ~${daysLeft} days`);
    console.log(`  👉 Run this script again tomorrow.`);
  } else {
    console.log(`  🎉 All URLs submitted!`);
  }
}

runIndexing().catch(console.error);