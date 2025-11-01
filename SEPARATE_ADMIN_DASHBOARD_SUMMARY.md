# Separate Admin Dashboard - Complete Setup Summary

## What Has Been Done

### ✅ 1. CORS Configuration Created
- **File:** `lib/admin-cors.ts`
- **Purpose:** Utility functions to add CORS headers to admin API responses
- **Features:**
  - Allows requests from admin dashboard subdomain
  - Handles preflight OPTIONS requests
  - Configurable via environment variable

### ✅ 2. All Admin API Routes Updated
All admin API routes now support CORS for cross-origin requests:

- ✅ `app/api/admin/users/list/route.ts`
- ✅ `app/api/admin/stats/route.ts`
- ✅ `app/api/admin/listings/route.ts`
- ✅ `app/api/admin/bookings/route.ts`
- ✅ `app/api/admin/search-user/route.ts`
- ✅ `app/api/admin/verifications/approve/[userId]/route.ts`
- ✅ `app/api/admin/verifications/reject/[userId]/route.ts`

Each route now:
- Exports an `OPTIONS` handler for preflight requests
- Adds CORS headers to responses
- Allows credentials (for Clerk authentication)

### ✅ 3. Documentation Created
- **`ADMIN_DASHBOARD_SETUP.md`** - Complete setup guide
- **`REMOVE_ADMIN_FROM_MAIN_SITE.md`** - Guide to remove admin UI from main site
- **`admin-dashboard-template/README.md`** - Template README

## Next Steps for You

### Step 1: Add Environment Variable to Main Website

Add this to your main website's `.env.local` and Vercel environment variables:

```env
NEXT_PUBLIC_ADMIN_DASHBOARD_URL=https://admin.leli-rentals.com
```

**For Vercel:**
1. Go to your project settings
2. Environment Variables
3. Add: `NEXT_PUBLIC_ADMIN_DASHBOARD_URL` = `https://admin.leli-rentals.com`
4. Redeploy

### Step 2: Create Admin Dashboard Project

```bash
# Navigate to parent directory
cd ..

# Create new Next.js project
npx create-next-app@latest leli-admin-dashboard --typescript --tailwind --app

cd leli-admin-dashboard
```

### Step 3: Install Dependencies

```bash
npm install @clerk/nextjs axios lucide-react
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs
npm install class-variance-authority clsx tailwind-merge
npm install date-fns
```

### Step 4: Copy Admin Components

From main project, copy to admin dashboard:
- `app/admin-panel/page.tsx` → `app/dashboard/page.tsx`
- All UI components you use (from `components/ui/`)
- Any admin-specific components

### Step 5: Create API Client

Create `lib/api-client.ts` in admin dashboard:

```typescript
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_MAIN_API_URL || 'http://localhost:3000/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for Clerk auth cookies
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token interceptor if needed
apiClient.interceptors.request.use(async (config) => {
  // Get Clerk session token and add to headers if needed
  return config
})
```

### Step 6: Configure Clerk in Admin Dashboard

Update `app/layout.tsx`:

```typescript
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  )
}
```

### Step 7: Set Environment Variables

Create `.env.local` in admin dashboard:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
CLERK_SECRET_KEY=sk_xxx
NEXT_PUBLIC_MAIN_API_URL=https://leli-rentals.com/api
```

### Step 8: Deploy Admin Dashboard

**On Vercel:**
1. Import admin dashboard repository
2. Add environment variables
3. Set custom domain: `admin.leli-rentals.com`
4. Deploy

**Domain Configuration:**
- In your DNS provider, add CNAME record:
  - `admin` → `cname.vercel-dns.com` (or your Vercel DNS)

### Step 9: Test Connection

1. Open admin dashboard: `https://admin.leli-rentals.com`
2. Sign in with admin account
3. Test API calls - they should work from the separate domain

### Step 10: (Optional) Remove Admin UI from Main Site

After confirming admin dashboard works:
- See `REMOVE_ADMIN_FROM_MAIN_SITE.md` for detailed steps
- Remove admin UI pages to reduce bundle size
- Keep API routes (they're needed!)

## API Endpoints Available

All endpoints are at: `{NEXT_PUBLIC_MAIN_API_URL}/admin/*`

- `GET /admin/users/list` - List all users
- `GET /admin/stats` - Platform statistics
- `GET /admin/listings` - All listings
- `GET /admin/bookings` - All bookings
- `POST /admin/search-user` - Search user by email
- `POST /admin/verifications/approve/[userId]` - Approve verification
- `POST /admin/verifications/reject/[userId]` - Reject verification

## Security Notes

1. **CORS is restricted** to the admin dashboard domain
2. **Authentication required** - All routes check for admin role
3. **Credentials included** - Clerk session cookies are sent with requests
4. **Rate limiting** - Consider adding rate limiting in production

## Troubleshooting

### CORS Errors
- Check `NEXT_PUBLIC_ADMIN_DASHBOARD_URL` is set correctly
- Verify domain matches exactly (including https/http)
- Check browser console for specific CORS error

### Authentication Errors
- Ensure Clerk keys are correct in admin dashboard
- Verify user has admin role in Clerk metadata
- Check that cookies are being sent (withCredentials: true)

### API Connection Errors
- Verify `NEXT_PUBLIC_MAIN_API_URL` is correct
- Check main website is deployed and accessible
- Test API endpoints directly from browser

## Support

If you encounter issues:
1. Check browser console for errors
2. Check server logs (Vercel logs)
3. Verify all environment variables are set
4. Test API endpoints directly with Postman/curl

