@echo off
echo 🚀 Starting Firebase deployment for Leli Rentals...

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI is not installed. Please install it first:
    echo npm install -g firebase-tools
    pause
    exit /b 1
)

REM Check if user is logged in
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Please login to Firebase first:
    echo firebase login
    pause
    exit /b 1
)

echo 📦 Building the application...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed. Please fix the errors and try again.
    pause
    exit /b 1
)

echo ✅ Build completed successfully!

echo 🔥 Deploying to Firebase...

REM Deploy Firestore indexes
echo 📊 Deploying Firestore indexes...
firebase deploy --only firestore:indexes

if %errorlevel% neq 0 (
    echo ❌ Firestore indexes deployment failed.
    pause
    exit /b 1
)

REM Deploy Firestore rules
echo 🔒 Deploying Firestore security rules...
firebase deploy --only firestore:rules

if %errorlevel% neq 0 (
    echo ❌ Firestore rules deployment failed.
    pause
    exit /b 1
)

REM Deploy Storage rules
echo 💾 Deploying Storage security rules...
firebase deploy --only storage

if %errorlevel% neq 0 (
    echo ❌ Storage rules deployment failed.
    pause
    exit /b 1
)

REM Deploy Hosting
echo 🌐 Deploying to Firebase Hosting...
firebase deploy --only hosting

if %errorlevel% neq 0 (
    echo ❌ Hosting deployment failed.
    pause
    exit /b 1
)

echo 🎉 Deployment completed successfully!
echo.
echo 📋 Summary of deployed components:
echo ✅ Firestore indexes
echo ✅ Firestore security rules
echo ✅ Storage security rules
echo ✅ Web application
echo.
echo 🔗 Your application is now live!
echo.
echo 📚 Next steps:
echo 1. Verify your Firestore indexes in the Firebase Console
echo 2. Test your security rules
echo 3. Monitor your application performance
echo 4. Set up monitoring and alerts
echo.
echo 🎯 Firebase Console: https://console.firebase.google.com/
pause
