#!/bin/bash

# Setup script for creating separate admin dashboard
# Run this from the parent directory of leli-rentals

echo "🚀 Setting up Admin Dashboard for Leli Rentals"
echo ""

# Check if we're in the right directory
if [ ! -d "leli-rentals" ]; then
    echo "❌ Error: leli-rentals directory not found"
    echo "Please run this script from the parent directory of leli-rentals"
    exit 1
fi

# Create Next.js project
echo "📦 Creating Next.js project..."
npx create-next-app@latest leli-admin-dashboard --typescript --tailwind --app --no-src-dir --import-alias "@/*"

cd leli-admin-dashboard

# Install dependencies
echo "📦 Installing dependencies..."
npm install @clerk/nextjs axios lucide-react date-fns
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs @radix-ui/react-select
npm install class-variance-authority clsx tailwind-merge
npm install @hookform/resolvers zod react-hook-form
npm install recharts  # For charts/analytics

echo "✅ Admin dashboard project created!"
echo ""
echo "Next steps:"
echo "1. Copy admin components from leli-rentals to leli-admin-dashboard"
echo "2. Set up environment variables (see ADMIN_DASHBOARD_ENV_SETUP.md)"
echo "3. Follow the setup guide in ADMIN_DASHBOARD_COMPLETE_SETUP.md"

