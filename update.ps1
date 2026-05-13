# GitHub 푸시 + (옵션) Vercel 배포 통합 스크립트
#
# 사용법:
#   .\update.ps1 "커밋 메시지"                  -> GitHub 푸시만
#   .\update.ps1 "커밋 메시지" -Deploy          -> 푸시 + Vercel 프리뷰
#   .\update.ps1 "커밋 메시지" -Deploy -Prod    -> 푸시 + Vercel 프로덕션

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$Message,

    [switch]$Deploy,
    [switch]$Prod
)

Set-Location $PSScriptRoot

# 1. Git: 변경사항 있을 때만 커밋 & 푸시
$status = git status --porcelain
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] git status 실패 - 저장소가 아닌 디렉토리일 수 있음" -ForegroundColor Red
    exit 1
}

if ($status) {
    git add .
    if ($LASTEXITCODE -ne 0) { Write-Host "[ERROR] git add 실패" -ForegroundColor Red; exit 1 }

    git commit -m $Message
    if ($LASTEXITCODE -ne 0) { Write-Host "[ERROR] git commit 실패" -ForegroundColor Red; exit 1 }

    git push origin main
    if ($LASTEXITCODE -ne 0) { Write-Host "[ERROR] git push 실패" -ForegroundColor Red; exit 1 }

    Write-Host "[OK] GitHub 푸시 완료" -ForegroundColor Green
} else {
    Write-Host "[SKIP] 변경사항 없음 (커밋/푸시 건너뜀)" -ForegroundColor Yellow
}

# 2. Vercel 배포 (옵션)
if ($Deploy) {
    $env:Path = "$env:APPDATA\npm;$env:Path"

    if ($Prod) {
        Write-Host "[..] Vercel 프로덕션 배포 중..." -ForegroundColor Cyan
        vercel.cmd deploy --prod --cwd $PSScriptRoot --yes
    } else {
        Write-Host "[..] Vercel 프리뷰 배포 중..." -ForegroundColor Cyan
        vercel.cmd deploy --cwd $PSScriptRoot --yes
    }

    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Vercel 배포 실패" -ForegroundColor Red
        exit 1
    }

    Write-Host "[OK] Vercel 배포 완료" -ForegroundColor Green
}
