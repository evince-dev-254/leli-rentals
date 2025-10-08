@echo off
echo 🔧 Deploying development Firestore rules...

REM Deploy development rules (more permissive)
echo 📊 Deploying development Firestore rules...
firebase deploy --only firestore:rules --project your-project-id

if %errorlevel% neq 0 (
    echo ❌ Development rules deployment failed.
    pause
    exit /b 1
)

echo ✅ Development rules deployed successfully!
echo.
echo ⚠️  WARNING: These are development rules with relaxed permissions.
echo    Do not use in production!
echo.
pause
