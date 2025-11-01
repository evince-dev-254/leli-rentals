# Leli Rentals - Admin Dashboard

Separate admin dashboard for managing Leli Rentals platform.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

## Environment Variables

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
CLERK_SECRET_KEY=sk_xxx
NEXT_PUBLIC_MAIN_API_URL=https://leli-rentals.com/api
NEXT_PUBLIC_ADMIN_DASHBOARD_URL=https://admin.leli-rentals.com
```

## API Base URL

All API calls are made to: `NEXT_PUBLIC_MAIN_API_URL`

Example:
- Users: `GET ${NEXT_PUBLIC_MAIN_API_URL}/admin/users/list`
- Stats: `GET ${NEXT_PUBLIC_MAIN_API_URL}/admin/stats`
- Listings: `GET ${NEXT_PUBLIC_MAIN_API_URL}/admin/listings`

## Authentication

Uses Clerk for authentication. Admin users must have `role: 'admin'` or `role: 'super_admin'` in their Clerk metadata.

## Deployment

Deploy to Vercel with custom domain: `admin.leli-rentals.com`

