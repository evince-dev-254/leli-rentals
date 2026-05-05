import { readFileSync, writeFileSync, existsSync } from "fs";
import { config } from "dotenv";
config({ path: ".env.local" });

const INDEXNOW_KEY = "f996acd3-12a1-42fc-bfbe-ac5cf0ad766a";
const HOST = "www.leli.rentals";
const SITEMAP_URL = "https://www.leli.rentals/sitemap.xml";
const PROGRESS_FILE = "./indexnow-progress.json";
const BATCH_SIZE = 10000;

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

async function submitToIndexNow(urls) {
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
  });

  return response.status;
}

async function runIndexNow() {
  const allUrls = await fetchSitemapUrls();
  console.log(`✅ Found ${allUrls.length} URLs in sitemap`);

  const progress = loadProgress();
  const alreadySubmitted = new Set(progress.submitted);

  const pending = allUrls.filter((url) => !alreadySubmitted.has(url));
  console.log(`📋 Already submitted: ${alreadySubmitted.size}`);
  console.log(`📋 Pending: ${pending.length}`);

  if (pending.length === 0) {
    console.log("✅ All URLs already submitted to IndexNow!");
    return;
  }

  const batch = pending.slice(0, BATCH_SIZE);
  console.log(`\n🚀 Submitting ${batch.length} URLs to IndexNow...\n`);

  const status = await submitToIndexNow(batch);

  if (status === 200 || status === 202) {
    batch.forEach((url) => progress.submitted.push(url));
    progress.lastRun = new Date().toISOString();
    saveProgress(progress);

    console.log(`📊 Results:`);
    console.log(`  ✅ Submitted: ${batch.length}`);
    console.log(`  📋 Remaining: ${pending.length - batch.length}`);

    if (pending.length - batch.length > 0) {
      console.log(`  ⏳ Run again tomorrow for remaining URLs`);
    } else {
      console.log(`  🎉 All URLs submitted to IndexNow!`);
    }
  } else {
    console.log(`  ❌ IndexNow returned status: ${status}`);
    console.log(`  ⚠️  URLs not saved to progress — try again`);
  }
}

runIndexNow().catch(console.error);