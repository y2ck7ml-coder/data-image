# GitHub push + (optional) Vercel deploy workflow script
#
# Usage:
#   .\update.ps1 "commit message"                  -> git push only
#   .\update.ps1 "commit message" -Deploy          -> push + Vercel preview
#   .\update.ps1 "commit message" -Deploy -Prod    -> push + Vercel production
#
# Korean Windows users: run via update.bat wrapper to avoid ExecutionPolicy
# and encoding issues.

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$Message,

    [switch]$Deploy,
    [switch]$Prod
)

Set-Location $PSScriptRoot

# 1. Git: commit & push only if there are changes
$status = git status --porcelain
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] git status failed - not a git repository?" -ForegroundColor Red
    exit 1
}

if ($status) {
    git add .
    if ($LASTEXITCODE -ne 0) { Write-Host "[ERROR] git add failed" -ForegroundColor Red; exit 1 }

    git commit -m $Message
    if ($LASTEXITCODE -ne 0) { Write-Host "[ERROR] git commit failed" -ForegroundColor Red; exit 1 }

    git push origin main
    if ($LASTEXITCODE -ne 0) { Write-Host "[ERROR] git push failed" -ForegroundColor Red; exit 1 }

    Write-Host "[OK] GitHub push complete" -ForegroundColor Green
} else {
    Write-Host "[SKIP] No changes (commit/push skipped)" -ForegroundColor Yellow
}

# 2. Vercel deploy (optional)
if ($Deploy) {
    $env:Path = "$env:APPDATA\npm;$env:Path"

    if ($Prod) {
        Write-Host "[..] Vercel production deploy..." -ForegroundColor Cyan
        vercel.cmd deploy --prod --cwd $PSScriptRoot --yes
    } else {
        Write-Host "[..] Vercel preview deploy..." -ForegroundColor Cyan
        vercel.cmd deploy --cwd $PSScriptRoot --yes
    }

    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Vercel deploy failed" -ForegroundColor Red
        exit 1
    }

    Write-Host "[OK] Vercel deploy complete" -ForegroundColor Green
}
