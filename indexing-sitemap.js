import { google } from "googleapis";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { config } from "dotenv";
config({ path: ".env.local" });

// ─── MULTI-KEY AUTH ────────────────────────────────────────
function loadAllKeys() {
  const keys = [];
  let i = 1;
  while (process.env[`GOOGLE_SERVICE_ACCOUNT_KEY_${i}`]) {
    keys.push(JSON.parse(process.env[`GOOGLE_SERVICE_ACCOUNT_KEY_${i}`]));
    i++;
  }
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

// ─── CLUSTER SORTING ───────────────────────────────────────
function getClusterPriority(url) {
  // Core pages
  const corePages = [
    'https://www.leli.rentals',
    'https://www.leli.rentals/explore',
    'https://www.leli.rentals/become-owner',
    'https://www.leli.rentals/categories',
    'https://www.leli.rentals/compare',
    'https://www.leli.rentals/review',
  ];
  if (corePages.includes(url)) return 0;

  // Cluster A - Competitor Killers
  if (url.includes('/compare/') || url.includes('/review/') ||
      url.includes('-alternative') || url.includes('/alternatives/')) return 1;

  // Earn pages
  if (url.includes('/earn/')) return 2;

  // Guides
  if (url.includes('/guides')) return 3;

  // Blog
  if (url.includes('/blog')) return 4;

  // Cluster B - High-Ticket Metropolitan
  const clusterB = [
    '/rent-a-car-in-', '/hire-a-car-in-', '/luxury-car-rental-in-', '/rent-suv-in-',
    '/rent-tesla-in-', '/rent-electric-vehicle-in-', '/peer-to-peer-car-rental-in-',
    '/self-drive-car-hire-in-', '/affordable-car-rental-in-', '/short-term-car-rental-in-',
    '/rent-a-van-in-', '/rent-a-minivan-in-', '/rent-a-pickup-truck-in-',
    '/rent-a-truck-for-moving-in-', '/cheap-car-hire-in-',
    '/vacation-rental-in-', '/holiday-rental-in-', '/rent-apartment-short-term-in-',
    '/rent-house-for-weekend-in-', '/short-stay-rental-in-', '/rent-furnished-apartment-in-',
    '/rent-villa-in-', '/affordable-holiday-home-in-', '/rent-beach-house-in-',
    '/corporate-housing-in-', '/rent-serviced-apartment-in-', '/luxury-home-rental-in-',
    '/rent-studio-apartment-in-', '/rent-penthouse-in-', '/monthly-rental-in-',
    '/hire-office-space-in-', '/hire-boardroom-in-', '/hire-coworking-desk-in-',
    '/hire-event-space-in-', '/hire-podcast-studio-in-', '/hire-pop-up-shop-space-in-',
    '/hire-presentation-room-in-', '/hire-seminar-room-in-', '/rent-conference-room-in-',
    '/rent-hot-desk-in-', '/rent-meeting-room-in-', '/rent-pop-up-office-in-',
    '/rent-private-office-in-', '/rent-studio-space-in-', '/rent-training-room-in-',
    '/rent-virtual-office-in-', '/rent-warehouse-space-in-', '/rent-workshop-space-in-',
    '/hire-loading-bay-in-', '/hire-parking-space-in-', '/hire-driveway-in-',
    '/hire-garage-in-', '/hire-secure-parking-in-',
  ];
  if (clusterB.some(p => url.includes(p))) return 5;

  // Cluster C - Specialized Gear
  const clusterC = [
    '/rent-camera-in-', '/rent-cinema-camera-in-', '/rent-dslr-in-', '/rent-drone-in-',
    '/rent-drone-for-photography-in-', '/rent-film-camera-in-', '/rent-mirrorless-camera-in-',
    '/rent-photo-booth-in-', '/rent-photoshoot-studio-in-', '/rent-video-camera-in-',
    '/hire-camera-bag-in-', '/hire-camera-lens-in-', '/hire-gimbal-in-',
    '/hire-lighting-equipment-in-', '/hire-photography-equipment-in-', '/hire-sony-a7-in-',
    '/hire-studio-flash-in-', '/rent-canon-r5-in-', '/rent-streaming-equipment-in-',
    '/hire-stage-lighting-in-', '/hire-laptop-in-', '/hire-vr-headset-in-',
    '/hire-4k-monitor-in-', '/hire-smart-tv-in-', '/rent-gaming-pc-in-',
    '/rent-gaming-console-in-', '/rent-ipad-in-', '/rent-macbook-in-',
    '/rent-projector-in-', '/rent-home-theatre-system-in-', '/hire-dj-equipment-in-',
    '/rent-dj-equipment-in-', '/rent-pa-system-in-', '/rent-audio-equipment-in-',
    '/hire-sound-system-in-', '/hire-construction-equipment-in-', '/hire-earth-mover-in-',
    '/hire-jackhammer-in-', '/hire-skid-steer-in-', '/rent-chainsaw-in-',
    '/rent-concrete-mixer-in-', '/rent-excavator-in-', '/rent-generator-in-',
    '/rent-heavy-machinery-in-', '/rent-lawn-equipment-in-', '/rent-power-tools-in-',
    '/rent-pressure-washer-in-', '/rent-scaffolding-in-', '/tool-hire-in-',
    '/construction-equipment-hire-in-', '/rent-camera-gear-in-',
    '/rent-photography-equipment-in-',
  ];
  if (clusterC.some(p => url.includes(p))) return 6;

  // Cluster D - Fashion & Entertainment
  const clusterD = [
    '/hire-evening-gown-in-', '/hire-formal-wear-in-', '/hire-gala-dress-in-',
    '/hire-luxury-shoes-in-', '/hire-prom-dress-in-', '/hire-tuxedo-in-',
    '/rent-accessories-in-', '/rent-bridesmaid-dress-in-', '/rent-designer-clothes-in-',
    '/rent-designer-dress-in-', '/rent-designer-suit-in-', '/rent-jewellery-in-',
    '/rent-luxury-handbag-in-', '/rent-wedding-outfit-in-', '/hire-costume-in-',
    '/hire-bouncy-castle-in-', '/hire-cocktail-bar-in-', '/hire-foam-machine-in-',
    '/hire-party-tent-in-', '/hire-popcorn-machine-in-', '/rent-arcade-games-in-',
    '/rent-carnival-games-in-', '/rent-event-furniture-in-', '/rent-karaoke-machine-in-',
    '/rent-outdoor-cinema-in-', '/rent-party-equipment-in-',
  ];
  if (clusterD.some(p => url.includes(p))) return 7;

  // Cluster E - Baby/Kids/Sports/Storage
  const clusterE = [
    '/hire-baby-monitor-in-', '/hire-baby-swing-in-', '/hire-crib-in-',
    '/hire-high-chair-in-', '/hire-kids-bicycle-in-', '/hire-play-gym-in-',
    '/hire-pram-in-', '/rent-baby-bath-in-', '/rent-baby-bouncer-in-',
    '/rent-baby-carrier-in-', '/rent-baby-cot-in-', '/rent-baby-gear-in-',
    '/rent-car-seat-in-', '/rent-stroller-in-', '/rent-toddler-toys-in-',
    '/hire-camping-gear-in-', '/hire-kayak-in-', '/hire-mountain-bike-in-',
    '/hire-rock-climbing-gear-in-', '/hire-ski-equipment-in-',
    '/hire-stand-up-paddleboard-in-', '/hire-sports-gear-in-',
    '/rent-bicycle-in-', '/rent-fitness-equipment-in-', '/rent-golf-clubs-in-',
    '/rent-gym-equipment-in-', '/rent-surfboard-in-', '/rent-tennis-equipment-in-',
    '/rent-treadmill-in-', '/rent-water-sports-equipment-in-',
    '/rent-cold-storage-in-', '/rent-commercial-storage-in-', '/rent-garden-storage-in-',
    '/rent-self-storage-in-', '/rent-storage-unit-in-',
    '/hire-studio-apartment-storage-in-',
  ];
  if (clusterE.some(p => url.includes(p))) return 8;

  // Everything else
  return 9;
}

function sortByCluster(urls) {
  return [...urls].sort((a, b) => getClusterPriority(a) - getClusterPriority(b));
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

  // Sort pending URLs by cluster priority before batching
  const sortedPending = sortByCluster(pending);
  console.log(`🎯 URLs sorted by cluster priority`);

  const todaysBatch = sortedPending.slice(0, totalQuota);
  console.log(`\n🚀 Submitting ${todaysBatch.length} URLs using ${allKeys.length} keys...\n`);

  const results = { success: [], failed: [] };
  let currentKeyIndex = 0;
  let countForCurrentKey = 0;
  let currentClient = await getAuthForKey(allKeys[0]).getClient();
  let currentIndexing = google.indexing({ version: "v3", auth: currentClient });

  for (const url of todaysBatch) {
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