# COGNYX PowerShell Service Launcher
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "               COGNYX HEALTH SCIENCES ENGINE" -ForegroundColor White
Write-Host "         Precision Digital Phenotyping & Diagnostic AI" -ForegroundColor Gray
Write-Host "===================================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "`n[1/3] Starting Python ML Microservice (FastAPI on Port 8000)..." -ForegroundColor Yellow
$mlProcess = Start-Process py -ArgumentList "-3.13 -m uvicorn main:app --port 8000 --reload" -WorkingDirectory "$scriptDir\ml_service" -PassThru

Start-Sleep -Seconds 2

Write-Host "[2/3] Opening browser at http://localhost:3005..." -ForegroundColor Green
Start-Process "http://localhost:3005"

Write-Host "[3/3] Starting Express Backend Server (Port 3005)...`n" -ForegroundColor Cyan
try {
    Set-Location "$scriptDir\backend"
    node server.js
} finally {
    Write-Host "`nShutting down ML Microservice..." -ForegroundColor Yellow
    if ($mlProcess -and !$mlProcess.HasExited) {
        Stop-Process -Id $mlProcess.Id -Force
    }
}
