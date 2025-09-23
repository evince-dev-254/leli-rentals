#!/usr/bin/env node

/**
 * Verification script for real Paystack integration
 * This script checks if the integration is properly configured
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔍 Verifying Real Paystack Integration...\n')

// Check environment variables
const envPath = path.join(process.cwd(), '.env.local')
const envExists = fs.existsSync(envPath)

if (!envExists) {
  console.log('❌ .env.local file not found')
  console.log('   Run: node scripts/setup-real-integration.js')
  process.exit(1)
}

// Read environment variables
const envContent = fs.readFileSync(envPath, 'utf8')
const envLines = envContent.split('\n')

const envVars = {}
envLines.forEach(line => {
  if (line.trim() && !line.startsWith('#')) {
    const [key, value] = line.split('=')
    if (key && value) {
      envVars[key.trim()] = value.trim()
    }
  }
})

console.log('📋 Environment Variables Check:')

// Check Paystack configuration
const paystackPublicKey = envVars['NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY']
const paystackSecretKey = envVars['PAYSTACK_SECRET_KEY']

console.log(`\n🔑 Paystack Configuration:`)
console.log(`   Public Key: ${paystackPublicKey ? '✅ Set' : '❌ Missing'}`)
if (paystackPublicKey) {
  if (paystackPublicKey.startsWith('pk_test_')) {
    console.log(`   Status: 🧪 Test Mode (Development)`)
  } else if (paystackPublicKey.startsWith('pk_live_')) {
    console.log(`   Status: 🚀 Live Mode (Production)`)
  } else {
    console.log(`   Status: ⚠️  Invalid key format`)
  }
}

console.log(`   Secret Key: ${paystackSecretKey ? '✅ Set' : '❌ Missing'}`)
if (paystackSecretKey) {
  if (paystackSecretKey.startsWith('sk_test_')) {
    console.log(`   Status: 🧪 Test Mode (Development)`)
  } else if (paystackSecretKey.startsWith('sk_live_')) {
    console.log(`   Status: 🚀 Live Mode (Production)`)
  } else {
    console.log(`   Status: ⚠️  Invalid key format`)
  }
}

// Check Firebase configuration
console.log(`\n🔥 Firebase Configuration:`)
const firebaseKeys = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
]

let firebaseConfigured = true
firebaseKeys.forEach(key => {
  const isSet = envVars[key] && envVars[key] !== `your_${key.toLowerCase().replace('next_public_', '').replace(/_/g, '_')}_here`
  console.log(`   ${key}: ${isSet ? '✅ Set' : '❌ Missing'}`)
  if (!isSet) firebaseConfigured = false
})

// Check other required variables
console.log(`\n⚙️  Other Configuration:`)
const otherKeys = [
  'NEXT_PUBLIC_APP_URL',
  'NEXTAUTH_SECRET'
]

otherKeys.forEach(key => {
  const isSet = envVars[key] && envVars[key] !== `your_${key.toLowerCase().replace('next_public_', '').replace(/_/g, '_')}_here`
  console.log(`   ${key}: ${isSet ? '✅ Set' : '❌ Missing'}`)
})

// Summary
console.log(`\n📊 Integration Status:`)

const paystackReady = paystackPublicKey && paystackSecretKey && 
  !paystackPublicKey.includes('your_') && !paystackSecretKey.includes('your_')

const firebaseReady = firebaseConfigured

if (paystackReady && firebaseReady) {
  console.log('   🎉 Integration is READY for real payments!')
  console.log('   🚀 You can now process real subscriptions')
} else if (paystackReady) {
  console.log('   ⚠️  Paystack is ready, but Firebase needs configuration')
} else if (firebaseReady) {
  console.log('   ⚠️  Firebase is ready, but Paystack needs configuration')
} else {
  console.log('   ❌ Integration needs configuration')
  console.log('   📝 Run: node scripts/setup-real-integration.js')
}

console.log(`\n🧪 Test Instructions:`)
console.log('1. Start development server: npm run dev')
console.log('2. Go to: http://localhost:3000/profile/billing')
console.log('3. Click "Plans & Pricing" tab')
console.log('4. Select a paid plan (Pro or Enterprise)')
console.log('5. Choose "Paystack (Recommended)" payment method')
console.log('6. Use test card: 4084084084084085')

console.log(`\n💳 Test Cards:`)
console.log('   Success: 4084084084084085')
console.log('   Declined: 4084084084084086')
console.log('   Insufficient: 4084084084084087')

console.log(`\n🔗 Useful Links:`)
console.log('   Paystack Dashboard: https://dashboard.paystack.com/')
console.log('   Firebase Console: https://console.firebase.google.com/')
console.log('   Documentation: docs/paystack-setup.md')
