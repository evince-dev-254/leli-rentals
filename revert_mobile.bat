@echo off
echo ========================================
echo Mobile App Revert to Version 1.0.1
echo ========================================
echo.

cd /d "c:\Users\evince\Downloads\leli-rentals\leli-rentals"

echo [1/6] Verifying commit c8c85ee exists...
git rev-parse c8c85ee >nul 2>&1
if errorlevel 1 (
    echo ERROR: Commit c8c85ee not found
    pause
    exit /b 1
)
echo SUCCESS: Commit found
echo.

echo [2/6] Checking git status...
git status --short mobile/
echo.

echo [3/6] Creating backup branch...
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/: " %%a in ('time /t') do (set mytime=%%a%%b)
git branch backup-before-revert-%mydate%-%mytime%
echo Backup branch created: backup-before-revert-%mydate%-%mytime%
echo.

echo [4/6] Reverting mobile directory to commit c8c85ee...
git checkout c8c85ee -- mobile/
if errorlevel 1 (
    echo ERROR: Failed to checkout files
    pause
    exit /b 1
)
echo SUCCESS: Files checked out
echo.

echo [5/6] Checking git status after revert...
git status --short
echo.

echo [6/6] Verifying version in app.json...
findstr /C:"\"version\"" mobile\app.json
findstr /C:"\"runtimeVersion\"" mobile\app.json
echo.

echo ========================================
echo REVERT COMPLETE
echo ========================================
echo.
echo Next steps:
echo 1. Review changes: git status
echo 2. Commit the revert: git add mobile/ ^&^& git commit -m "Revert mobile app to version 1.0.1"
echo.
pause
