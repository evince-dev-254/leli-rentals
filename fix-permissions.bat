@echo off
echo 🔧 Fixing Firebase permissions...

echo 📊 Deploying updated Firestore rules...
firebase deploy --only firestore:rules

if %errorlevel% neq 0 (
    echo ❌ Firestore rules deployment failed.
    echo.
    echo 💡 Try these steps:
    echo 1. Make sure you're logged in: firebase login
    echo 2. Check your project: firebase use --list
    echo 3. Set the correct project: firebase use your-project-id
    echo.
    pause
    exit /b 1
)

echo ✅ Firestore rules updated successfully!
echo.
echo 🔄 The permissions error should now be fixed.
echo.
echo 📚 If you still get errors, try:
echo 1. Clear your browser cache
echo 2. Sign out and sign back in
echo 3. Check the Firebase Console for any remaining issues
echo.
pause
