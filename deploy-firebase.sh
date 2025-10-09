#!/bin/bash

# Firebase Deployment Script for Leli Rentals
echo "🚀 Starting Firebase deployment for Leli Rentals..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "❌ Please login to Firebase first:"
    echo "firebase login"
    exit 1
fi

echo "📦 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build completed successfully!"

echo "🔥 Deploying to Firebase..."

# Deploy Firestore indexes
echo "📊 Deploying Firestore indexes..."
firebase deploy --only firestore:indexes

if [ $? -ne 0 ]; then
    echo "❌ Firestore indexes deployment failed."
    exit 1
fi

# Deploy Firestore rules
echo "🔒 Deploying Firestore security rules..."
firebase deploy --only firestore:rules

if [ $? -ne 0 ]; then
    echo "❌ Firestore rules deployment failed."
    exit 1
fi

# Deploy Storage rules
echo "💾 Deploying Storage security rules..."
firebase deploy --only storage

if [ $? -ne 0 ]; then
    echo "❌ Storage rules deployment failed."
    exit 1
fi

# Deploy Hosting
echo "🌐 Deploying to Firebase Hosting..."
firebase deploy --only hosting

if [ $? -ne 0 ]; then
    echo "❌ Hosting deployment failed."
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Summary of deployed components:"
echo "✅ Firestore indexes"
echo "✅ Firestore security rules"
echo "✅ Storage security rules"
echo "✅ Web application"
echo ""
echo "🔗 Your application is now live at:"
firebase hosting:channel:list | grep "live" | head -1

echo ""
echo "📚 Next steps:"
echo "1. Verify your Firestore indexes in the Firebase Console"
echo "2. Test your security rules"
echo "3. Monitor your application performance"
echo "4. Set up monitoring and alerts"

echo ""
echo "🎯 Firebase Console: https://console.firebase.google.com/"
