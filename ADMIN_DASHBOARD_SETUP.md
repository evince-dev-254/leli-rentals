# Admin Dashboard - Separate Website Setup Guide

## Overview
This guide explains how to set up a completely separate admin dashboard website that can control the main Leli Rentals website. The admin dashboard will be deployed as a subdomain (e.g., `admin.leli-rentals.com`) and communicate with the main website via API.

## Architecture

```
Main Website (leli-rentals.com)
├── User-facing features
├── Owner dashboard
├── Renter features
└── API endpoints (with CORS enabled)

Admin Dashboard (admin.leli-rentals.com) - SEPARATE DEPLOYMENT
├── Admin authentication
├── User management
├── Listing management
├── Booking oversight
└── Platform analytics
```

## Deployment Strategy

### Option 1: Subdomain (Recommended)
- Main site: `leli-rentals.com` or `www.leli-rentals.com`
- Admin dashboard: `admin.leli-rentals.com`

### Option 2: Separate Domain
- Main site: `leli-rentals.com`
- Admin dashboard: `admin-dashboard.com` or `manage.leli-rentals.com`

## Step-by-Step Setup

### 1. Create Separate Admin Dashboard Project

Create a new Next.js project in a separate folder:

```bash
# Navigate to your projects directory (parent of leli-rentals)
cd ..
npx create-next-app@latest leli-admin-dashboard
cd leli-admin-dashboard
```

### 2. Install Dependencies

```bash
npm install @clerk/nextjs
npm install @radix-ui/react-* # UI components
npm install lucide-react
npm install axios # For API calls
```

### 3. Environment Variables

Create `.env.local` in the admin dashboard:

```env
# Clerk Authentication (Same as main site or separate instance)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
CLERK_SECRET_KEY=sk_xxx

# Main Website API Base URL
NEXT_PUBLIC_MAIN_API_URL=https://leli-rentals.com/api
# OR for local development:
# NEXT_PUBLIC_MAIN_API_URL=http://localhost:3000/api

# CORS Allowed Origin (for main website API)
NEXT_PUBLIC_ADMIN_DASHBOARD_URL=https://admin.leli-rentals.com
```

### 4. Copy Admin Components

Copy these from main project to admin dashboard:
- All files in `app/admin-panel/` → `app/dashboard/`
- All files in `app/api/admin/` → Keep in main project (but enable CORS)
- Admin-specific components

### 5. Configure CORS in Main Website

The main website API routes need to allow requests from the admin dashboard subdomain.

## API Configuration

### Main Website API Routes (Enable CORS)

All admin API routes in the main website should include CORS headers:

```typescript
// Example: app/api/admin/users/list/route.ts
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_DASHBOARD_URL = process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL || 'https://admin.leli-rentals.com'

export async function GET(req: NextRequest) {
  // Your existing code...
  
  const response = NextResponse.json({ users: [...] })
  
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', ADMIN_DASHBOARD_URL)
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  
  return response
}

// Handle preflight requests
export async function OPTIONS(req: NextRequest) {
  const response = new NextResponse(null, { status: 204 })
  response.headers.set('Access-Control-Allow-Origin', ADMIN_DASHBOARD_URL)
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}
```

## Deployment Instructions

### Main Website (Vercel)

1. **Add Environment Variable:**
   ```
   NEXT_PUBLIC_ADMIN_DASHBOARD_URL=https://admin.leli-rentals.com
   ```

2. **Deploy as normal** - The API routes will now accept requests from the admin dashboard.

### Admin Dashboard (Separate Vercel Project)

1. **Create New Vercel Project:**
   - Import the admin dashboard repository
   - Set custom domain: `admin.leli-rentals.com`

2. **Environment Variables:**
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
   CLERK_SECRET_KEY=sk_xxx
   NEXT_PUBLIC_MAIN_API_URL=https://leli-rentals.com/api
   ```

3. **Deploy**

## Security Considerations

1. **API Authentication:**
   - Use Clerk JWT tokens for API authentication
   - Verify admin role in API routes
   - Use API keys for additional security

2. **Rate Limiting:**
   - Implement rate limiting on admin API routes
   - Use Vercel Edge Config or Redis

3. **IP Whitelisting (Optional):**
   - Restrict admin API access to specific IPs
   - Use Vercel Edge Middleware

## Migration Checklist

- [ ] Create separate admin dashboard project
- [ ] Copy admin components and pages
- [ ] Configure CORS on main website API routes
- [ ] Set up environment variables in both projects
- [ ] Test API connectivity
- [ ] Deploy main website with CORS enabled
- [ ] Deploy admin dashboard as subdomain
- [ ] Remove admin routes from main website (optional)
- [ ] Update middleware to block admin routes in main site

## Testing Locally

1. **Run Main Website:**
   ```bash
   cd leli-rentals
   npm run dev # Runs on localhost:3000
   ```

2. **Run Admin Dashboard:**
   ```bash
   cd leli-admin-dashboard
   npm run dev # Runs on localhost:3001
   ```

3. **Update Admin Dashboard `.env.local`:**
   ```
   NEXT_PUBLIC_MAIN_API_URL=http://localhost:3000/api
   ```

## Benefits of Separate Admin Dashboard

1. **Security:** Admin interface not accessible from main domain
2. **Performance:** Admin dashboard doesn't affect main site bundle size
3. **Scalability:** Can scale admin dashboard independently
4. **Maintenance:** Easier to update admin features without touching main site
5. **Access Control:** Different authentication/authorization rules

