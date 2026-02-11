# Revert Mobile App to Version 1.0.1 (Commit c8c85ee)
# This script will safely revert your mobile app to the January 20, 2026 build

$ErrorActionPreference = "Stop"
$repoPath = "c:\Users\evince\Downloads\leli-rentals\leli-rentals"
$targetCommit = "c8c85ee"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Mobile App Revert to Version 1.0.1" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to repository directory
Set-Location $repoPath
Write-Host "[1/6] Changed to repository directory: $repoPath" -ForegroundColor Green

# Check if commit exists
Write-Host "[2/6] Verifying commit $targetCommit exists..." -ForegroundColor Yellow
try {
    $fullCommitHash = git rev-parse $targetCommit 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Commit $targetCommit not found in repository"
    }
    Write-Host "      ✓ Commit found: $fullCommitHash" -ForegroundColor Green
} catch {
    Write-Host "      ✗ Error: $_" -ForegroundColor Red
    exit 1
}

# Check current git status
Write-Host "[3/6] Checking git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain mobile/
if ($gitStatus) {
    Write-Host "      ⚠ WARNING: You have uncommitted changes in mobile/" -ForegroundColor Red
    Write-Host ""
    Write-Host "Uncommitted changes:" -ForegroundColor Yellow
    Write-Host $gitStatus
    Write-Host ""
    $response = Read-Host "Do you want to continue? This will discard these changes. (yes/no)"
    if ($response -ne "yes") {
        Write-Host "Revert cancelled." -ForegroundColor Yellow
        exit 0
    }
} else {
    Write-Host "      ✓ No uncommitted changes in mobile/" -ForegroundColor Green
}

# Create backup branch
Write-Host "[4/6] Creating backup branch..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupBranch = "backup-before-revert-$timestamp"
git branch $backupBranch
if ($LASTEXITCODE -eq 0) {
    Write-Host "      ✓ Created backup branch: $backupBranch" -ForegroundColor Green
} else {
    Write-Host "      ⚠ Warning: Could not create backup branch" -ForegroundColor Yellow
}

# Checkout files from target commit
Write-Host "[5/6] Reverting mobile/ directory to commit $targetCommit..." -ForegroundColor Yellow
git checkout $targetCommit -- mobile/
if ($LASTEXITCODE -eq 0) {
    Write-Host "      ✓ Successfully checked out files from $targetCommit" -ForegroundColor Green
} else {
    Write-Host "      ✗ Error: Failed to checkout files" -ForegroundColor Red
    exit 1
}

# Verify version in app.json
Write-Host "[6/6] Verifying app.json version..." -ForegroundColor Yellow
$appJsonPath = Join-Path $repoPath "mobile\app.json"
if (Test-Path $appJsonPath) {
    $appJson = Get-Content $appJsonPath | ConvertFrom-Json
    $version = $appJson.expo.version
    $runtimeVersion = $appJson.expo.runtimeVersion
    
    Write-Host "      ✓ Version: $version" -ForegroundColor Green
    Write-Host "      ✓ Runtime Version: $runtimeVersion" -ForegroundColor Green
    
    if ($version -eq "1.0.1") {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "SUCCESS! Mobile app reverted to v1.0.1" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
    } else {
        Write-Host "      ⚠ Warning: Expected version 1.0.1, got $version" -ForegroundColor Yellow
    }
} else {
    Write-Host "      ✗ Error: Could not find app.json" -ForegroundColor Red
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Review the changes: git status" -ForegroundColor White
Write-Host "2. Commit the revert: git add mobile/ && git commit -m 'Revert mobile app to version 1.0.1 (commit c8c85ee)'" -ForegroundColor White
Write-Host "3. If needed, restore from backup branch: git checkout $backupBranch" -ForegroundColor White
Write-Host ""
