# ⚠️ ACTION REQUIRED: Configure Vercel Environment Variables

Your deployment failed because Vercel doesn't have your API keys. You need to add them manually in the Vercel Dashboard.

## 🚀 How to Fix

1.  **Go to Vercel Dashboard**: [https://vercel.com/dashboard](https://vercel.com/dashboard)
2.  Click on your project (**leli-rentals**).
3.  Go to **Settings** -> **Environment Variables**.
4.  Copy the values from your local `.env.local` file and add them one by one.

## 📋 List of Variables to Add

Copy these exact values from your `.env.local` file:

### Supabase (Authentication & Database)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### ImageKit (Image Storage)
- `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`
- `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PRIVATE_KEY`

### Paystack (Payments)
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
- `PAYSTACK_SECRET_KEY`

### Google Services (Maps & Auth)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### Email (Resend)
- `RESEND_API_KEY`

### Application URLs
- `NEXT_PUBLIC_APP_URL` (Set to `https://your-project.vercel.app`)
- `NEXT_PUBLIC_SITE_URL` (Set to `https://your-project.vercel.app`)

---

## 💡 Quick Tip
You can copy the entire content of your `.env.local` file and paste it into Vercel's Environment Variables input, and it will automatically parse them!

1. Open `.env.local` on your computer.
2. Select All and Copy.
3. In Vercel Environment Variables, click "Import .env" or just paste into the key field (Vercel often detects multiple).
4. **Redeploy**: Go to **Deployments** tab and click **Redeploy** on the failed build.
