# Clerk Webhook Setup for Production

## Step 1: Get Your Webhook Endpoint URL

Your production webhook URL will be:
```
https://leli.rentals/api/webhooks/clerk
```

## Step 2: Configure Webhook in Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **Webhooks** in the left sidebar
4. Click **Add Endpoint**

### Webhook Configuration:

**Endpoint URL:**
```
https://leli.rentals/api/webhooks/clerk
```

**Events to Subscribe:**
Select these events:
- ✅ `user.created` - When a new user signs up
- ✅ `user.updated` - When user data is updated
- ✅ `user.deleted` - When a user is deleted
- ✅ `session.created` - When a user signs in
- ✅ `session.ended` - When a user signs out

**Description:** (optional)
```
Production webhook for Leli Rentals user sync
```

## Step 3: Get the Signing Secret

After creating the webhook:
1. Click on the webhook you just created
2. Copy the **Signing Secret** (starts with `whsec_`)
3. This is important for verifying webhook authenticity

## Step 4: Add Signing Secret to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **leli-rentals** project
3. Go to **Settings** > **Environment Variables**
4. Add a new variable:
   - **Name:** `CLERK_WEBHOOK_SECRET`
   - **Value:** `whsec_...` (the signing secret you copied)
   - **Environment:** Production, Preview, Development

## Step 5: Redeploy Your App

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy** to apply the new environment variable

## Step 6: Test the Webhook

After deployment:
1. In Clerk Dashboard, go to your webhook
2. Click **Testing** tab
3. Click **Send Test Event**
4. Select `user.created` event
5. Click **Send Event**
6. Check that you receive a `200 OK` response

## Webhook Endpoint Code Location

The webhook handler is located at:
```
leli-rentals/app/api/webhooks/clerk/route.ts
```

This endpoint:
- Verifies the webhook signature using `CLERK_WEBHOOK_SECRET`
- Syncs user data to Supabase `user_profiles` table
- Handles user creation, updates, and deletion

## Troubleshooting

If webhooks fail:
1. Check Vercel logs for errors
2. Verify `CLERK_WEBHOOK_SECRET` is set correctly
3. Ensure the webhook URL is accessible (not blocked by firewall)
4. Check that Supabase credentials are correct in production

## Security Notes

- Never expose your webhook signing secret
- The webhook verifies signatures to prevent unauthorized requests
- Failed signature verification returns 401 Unauthorized
