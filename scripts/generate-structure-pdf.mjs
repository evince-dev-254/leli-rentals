import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 11px;
    color: #1a1a2e;
    background: #fff;
    padding: 40px 48px;
    line-height: 1.6;
  }
  .cover {
    text-align: center;
    padding: 60px 0 40px;
    border-bottom: 3px solid #e85d04;
    margin-bottom: 36px;
  }
  .cover h1 {
    font-size: 32px;
    font-weight: 800;
    color: #e85d04;
    letter-spacing: -0.5px;
  }
  .cover h2 {
    font-size: 15px;
    font-weight: 400;
    color: #555;
    margin-top: 6px;
  }
  .cover .badge {
    display: inline-block;
    margin-top: 16px;
    background: #fff4ec;
    color: #e85d04;
    border: 1px solid #e85d04;
    border-radius: 20px;
    padding: 4px 18px;
    font-size: 11px;
    font-weight: 600;
  }
  h2.section {
    font-size: 15px;
    font-weight: 700;
    color: #e85d04;
    margin: 28px 0 10px;
    padding-bottom: 4px;
    border-bottom: 2px solid #fde8d8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  h3.subsection {
    font-size: 12px;
    font-weight: 700;
    color: #1a1a2e;
    margin: 16px 0 6px;
  }
  pre {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-left: 3px solid #e85d04;
    border-radius: 4px;
    padding: 12px 16px;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 10px;
    line-height: 1.7;
    white-space: pre;
    overflow: hidden;
    margin-bottom: 8px;
  }
  .comment { color: #6c757d; }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0 20px;
    font-size: 10.5px;
  }
  th {
    background: #e85d04;
    color: #fff;
    padding: 7px 12px;
    text-align: left;
    font-weight: 600;
  }
  td {
    padding: 6px 12px;
    border-bottom: 1px solid #f0f0f0;
  }
  tr:nth-child(even) td { background: #fff9f5; }
  td:first-child { font-family: 'Consolas', monospace; font-weight: 600; color: #e85d04; }
  .footer {
    margin-top: 40px;
    padding-top: 12px;
    border-top: 1px solid #e9ecef;
    font-size: 9.5px;
    color: #aaa;
    text-align: center;
  }
  p { margin-bottom: 8px; color: #444; }
</style>
</head>
<body>

<div class="cover">
  <h1>Leli Rentals</h1>
  <h2>Full Code Structure Reference</h2>
  <div class="badge">GuruCrafts — April 2026</div>
</div>

<h2 class="section">Project Overview</h2>
<p>A full-stack Kenya-based rental marketplace built with Next.js 14 (App Router), backed by Supabase, with a companion Expo React Native mobile app and a Python OCR microservice.</p>

<h2 class="section">Root Directory</h2>
<pre>leli-rentals/
├── app/                    <span class="comment"># Next.js App Router (pages & API routes)</span>
├── components/             <span class="comment"># React UI components</span>
├── lib/                    <span class="comment"># Business logic, server actions, utilities</span>
├── hooks/                  <span class="comment"># Custom React hooks</span>
├── database/               <span class="comment"># SQL migrations, RLS policies, seeds</span>
├── leli-mobile/            <span class="comment"># Expo React Native mobile app</span>
├── ocr-service/            <span class="comment"># Python FastAPI OCR microservice</span>
├── public/                 <span class="comment"># Static assets (images, videos, icons)</span>
├── scripts/                <span class="comment"># Dev & admin utility scripts</span>
├── docs/                   <span class="comment"># Project documentation</span>
├── email-templates/        <span class="comment"># Supabase branded email HTML</span>
├── styles/                 <span class="comment"># Global CSS</span>
├── utils/supabase/         <span class="comment"># Supabase middleware helpers</span>
└── middleware.ts            <span class="comment"># Next.js auth middleware</span></pre>

<h2 class="section">app/ — Next.js Pages & API Routes</h2>
<pre>app/
├── (auth)/                 <span class="comment"># Auth group layout</span>
│   ├── login/page.tsx
│   ├── sign-in/page.tsx
│   ├── signup/page.tsx
│   └── verify/page.tsx
├── admin/                  <span class="comment"># Admin panel</span>
│   ├── admins/             ├── affiliates/[id]/ ├── blogs/
│   ├── bookings/           ├── communications/  ├── listings/
│   ├── paystack-settings/  ├── reviews/         ├── settings/
│   ├── staff/              ├── subscriptions/   ├── test-payment/
│   ├── users/[id]/         ├── verifications/[id]/ └── withdrawals/
├── api/
│   ├── ai/route.ts         <span class="comment"># AI assistant endpoint</span>
│   ├── blog/               <span class="comment"># generate/ | rate/ | route.ts</span>
│   ├── cron/reminders/     <span class="comment"># Booking reminder cron job</span>
│   ├── imagekit/auth/      <span class="comment"># ImageKit upload auth</span>
│   ├── paystack/verify/    <span class="comment"># Payment verification</span>
│   ├── sync-payments/      <span class="comment"># Payment sync utility</span>
│   ├── verifications/      <span class="comment"># ID verification handler</span>
│   └── webhooks/           <span class="comment"># paystack/ | google-risc/</span>
├── auth/callback/ & confirm/ <span class="comment"># Supabase OAuth & email confirm</span>
├── blog/                   <span class="comment"># [slug]/ | category/[category]/ | create/ | page.tsx</span>
├── categories/             <span class="comment"># [category]/ | page.tsx</span>
├── dashboard/              <span class="comment"># Full user dashboard</span>
│   ├── affiliate/          <span class="comment"># marketing/ referrals/ settings/ withdrawals/</span>
│   ├── bookings/           ├── earnings/        ├── listings/new/
│   ├── messages/           ├── notifications/   ├── owner/
│   ├── payments/           ├── renter/          ├── reviews/
│   ├── settings/           ├── subscription/    ├── switch-account/
│   └── verification/
├── listings/[id]/page.tsx  <span class="comment"># Listing detail</span>
├── search/page.tsx
├── staff/                  <span class="comment"># advertisers/ branding/ team/ settings/</span>
├── payment/                <span class="comment"># success/ | failed/</span>
├── users/[id]/page.tsx     <span class="comment"># Public user profile</span>
└── page.tsx                <span class="comment"># Home page</span></pre>

<h2 class="section">components/ — UI Components</h2>

<h3 class="subsection">Feature Components</h3>
<pre>components/
├── admin/          <span class="comment"># Management panels: users, listings, bookings, affiliates, etc.</span>
├── auth/           <span class="comment"># login-form, signup-form, turnstile-widget, verify-email</span>
├── blog/           <span class="comment"># blog-card, blog-hero, rating-component, social-share</span>
├── booking/        <span class="comment"># booking-modal</span>
├── categories/     <span class="comment"># categories-page-content, category-detail-content</span>
├── dashboard/      <span class="comment"># owner, renter, affiliate dashboards + sub-pages</span>
│   └── affiliate/  <span class="comment"># overview, referrals, marketing, settings, withdrawals</span>
├── emails/         <span class="comment"># React Email templates (18 templates via Resend)</span>
├── favorites/      <span class="comment"># favorites-content</span>
├── home/           <span class="comment"># hero, advanced-search, featured-listings, categories, newsletter</span>
├── icons/          <span class="comment"># Custom SVG icons</span>
├── layout/         <span class="comment"># header, footer, notification-dropdown</span>
├── listings/       <span class="comment"># listing-detail, favorite-button, policy-selector</span>
├── messages/       <span class="comment"># messages-content, messages-page-client</span>
├── pages/          <span class="comment"># about, careers, contact, help, become-owner</span>
├── payment/        <span class="comment"># paystack-button</span>
├── search/         <span class="comment"># search-content</span>
├── security/       <span class="comment"># console-warning</span>
├── seo/            <span class="comment"># structured-data</span>
└── staff/          <span class="comment"># advertisers, branding, team management</span></pre>

<h3 class="subsection">UI Primitives (shadcn/ui + custom)</h3>
<pre>components/ui/
  accordion  alert  alert-dialog  app-loader  avatar  badge
  breadcrumb  button  calendar  card  carousel  chart  checkbox
  command  date-of-birth-input  dialog  drawer  dropdown-menu
  empty  form  image-upload  input  label  leli-loader
  location-picker  location-search  offline-banner  otp-input
  pagination  phone-input  popover  progress  radio-group
  select  separator  sheet  sidebar  skeleton  slider  sonner
  spinner  switch  table  tabs  textarea  toast  tooltip  ...</pre>

<h2 class="section">lib/ — Business Logic</h2>
<pre>lib/
├── actions/                <span class="comment"># Next.js Server Actions</span>
│   ├── admin-actions.ts        ├── affiliate-actions.ts
│   ├── auth-actions.ts         ├── booking-actions.ts
│   ├── commission-actions.ts   ├── dashboard-actions.ts
│   ├── email-actions.ts        ├── invite-actions.ts
│   ├── reminder-actions.ts     ├── security-actions.ts
│   ├── settings-actions.ts     ├── staff-actions.ts
│   └── verification-actions.ts
├── supabase.ts             <span class="comment"># Client-side Supabase instance</span>
├── supabase-server.ts      <span class="comment"># Server-side Supabase (cookies)</span>
├── supabase-admin.ts       <span class="comment"># Admin Supabase (service role)</span>
├── resend.ts               <span class="comment"># Resend email client</span>
├── imagekit.ts             <span class="comment"># ImageKit CDN client</span>
├── types.ts                <span class="comment"># Global TypeScript types</span>
├── constants.ts            <span class="comment"># App-wide constants</span>
├── kenya-counties.ts       <span class="comment"># Location data</span>
├── categories-data.ts      <span class="comment"># Category definitions</span>
├── metadata.ts             <span class="comment"># SEO metadata helpers</span>
├── animations.ts           <span class="comment"># Framer Motion variants</span>
└── utils.ts                <span class="comment"># General utilities</span></pre>

<h2 class="section">leli-mobile/ — Expo React Native App</h2>
<pre>leli-mobile/
├── app/
│   ├── (auth)/             <span class="comment"># login, signup, forgot-password, role-selection</span>
│   ├── (tabs)/             <span class="comment"># home, categories, favorites, dashboard, profile</span>
│   ├── (user)/             <span class="comment"># edit-profile, settings, notifications, subscription</span>
│   ├── booking/[id].tsx
│   ├── listing/[category].tsx
│   ├── messages/           <span class="comment"># index + [id] (conversation)</span>
│   ├── property/[id].tsx
│   └── onboarding.tsx
├── components/ui/          <span class="comment"># BackButton, ScreenHeader, SideMenu, Toast</span>
├── context/                <span class="comment"># UserContext, MessageContext, NotificationContext, FavoritesContext</span>
├── constants/Colors.ts
└── lib/supabase.ts</pre>

<h2 class="section">database/ — SQL (Supabase / PostgreSQL)</h2>
<pre>database/
├── schema.sql              <span class="comment"># Main schema definition</span>
├── migrations/             <span class="comment"># Versioned ALTER TABLE migrations</span>
│   ├── create_payments_table.sql
│   ├── create_subscriptions_table.sql
│   ├── setup_commissions_and_withdrawals.sql
│   ├── add_admin_flags.sql
│   └── supabase_optimization.sql
├── seed_categories.sql     <span class="comment"># Category seed data</span>
├── seed_listings_part_*.sql
├── fix_*.sql               <span class="comment"># RLS & permission hotfixes</span>
└── commission_trigger.sql  <span class="comment"># Affiliate commission DB trigger</span></pre>

<h2 class="section">ocr-service/ — Python Microservice</h2>
<pre>ocr-service/
├── Dockerfile              <span class="comment"># Container definition</span>
├── main.py                 <span class="comment"># FastAPI app for ID card OCR</span>
└── requirements.txt</pre>

<h2 class="section">Tech Stack</h2>
<table>
  <tr><th>Layer</th><th>Technology</th></tr>
  <tr><td>Framework</td><td>Next.js 14 (App Router, SSR)</td></tr>
  <tr><td>Mobile</td><td>Expo (React Native)</td></tr>
  <tr><td>Database</td><td>Supabase (PostgreSQL + Row-Level Security)</td></tr>
  <tr><td>Auth</td><td>Supabase Auth (email OTP + Google OAuth)</td></tr>
  <tr><td>Payments</td><td>Paystack (webhooks + verification)</td></tr>
  <tr><td>Email</td><td>Resend + React Email</td></tr>
  <tr><td>CDN / Images</td><td>ImageKit</td></tr>
  <tr><td>UI Library</td><td>shadcn/ui + Tailwind CSS</td></tr>
  <tr><td>OCR</td><td>Python FastAPI microservice (Dockerized)</td></tr>
  <tr><td>Security</td><td>Cloudflare Turnstile (bot protection)</td></tr>
  <tr><td>Deployment</td><td>Vercel (web) + EAS (mobile)</td></tr>
</table>

<div class="footer">Generated by Claude Code &mdash; Leli Rentals / GuruCrafts &mdash; April 2026</div>
</body>
</html>`;

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle0' });

const outputPath = path.resolve(__dirname, '../leli-rentals-structure.pdf');
await page.pdf({
  path: outputPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '10mm', bottom: '10mm', left: '0mm', right: '0mm' },
});

await browser.close();
console.log('PDF saved to:', outputPath);
