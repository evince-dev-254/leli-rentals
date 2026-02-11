# Check git status and find commit
Set-Location "c:\Users\evince\Downloads\leli-rentals\leli-rentals"

Write-Host "=== Git Status ===" -ForegroundColor Green
git status

Write-Host "`n=== Recent Commits ===" -ForegroundColor Green
git log --oneline -30

Write-Host "`n=== Searching for commit c8c85ee ===" -ForegroundColor Green
git log --all --oneline | Select-String "c8c85ee"

Write-Host "`n=== Checking if commit exists ===" -ForegroundColor Green
try {
    $commitHash = git rev-parse c8c85ee 2>&1
    Write-Host "Full commit hash: $commitHash"
} catch {
    Write-Host "Commit c8c85ee not found" -ForegroundColor Red
}

Write-Host "`n=== Current app.json version ===" -ForegroundColor Green
$appJson = Get-Content "mobile\app.json" | ConvertFrom-Json
Write-Host "Current version: $($appJson.expo.version)"
Write-Host "Current runtimeVersion: $($appJson.expo.runtimeVersion)"
