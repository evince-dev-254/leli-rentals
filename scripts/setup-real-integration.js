#!/usr/bin/env node

/**
 * Setup script for real Paystack integration
 * This script helps configure the environment for production-ready payments
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🚀 Setting up Real Paystack Integration for Leli Rentals...\n')

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
const envExists = fs.existsSync(envPath)

if (!envExists) {
  console.log('📝 Creating .env.local file...')
  
  const envTemplate = `# Firebase Configuration (Get from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Paystack Configuration (REAL INTEGRATION)
# Get these from: https://dashboard.paystack.com/settings/developers
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here

# Database Configuration
DATABASE_URL=your_database_url_here

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Leli Rentals`

  fs.writeFileSync(envPath, envTemplate)
  console.log('✅ .env.local file created!')
} else {
  console.log('✅ .env.local file already exists')
}

console.log('\n📋 Next Steps:')
console.log('1. Get your Paystack API keys from: https://dashboard.paystack.com/settings/developers')
console.log('2. Update the .env.local file with your real API keys')
console.log('3. Test the integration with Paystack test cards')
console.log('4. Go live with production keys when ready')

console.log('\n🧪 Test Cards for Development:')
console.log('- Success: 4084084084084085')
console.log('- Declined: 4084084084084086')
console.log('- Insufficient Funds: 4084084084084087')

console.log('\n💡 Features Available:')
console.log('- ✅ Real Paystack payment processing')
console.log('- ✅ M-Pesa, Airtel Money, and Card payments')
console.log('- ✅ Subscription management in Firebase')
console.log('- ✅ Automatic billing and renewals')
console.log('- ✅ Payment notifications and receipts')

console.log('\n🔒 Security Notes:')
console.log('- Never commit .env.local to version control')
console.log('- Use test keys for development')
console.log('- Switch to live keys only for production')
console.log('- Set up webhooks for payment notifications')

console.log('\n✨ Your subscription system is now ready for real payments!')
