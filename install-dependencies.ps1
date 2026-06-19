Write-Host "Installing Socket.io dependencies..." -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] Installing server dependencies..." -ForegroundColor Yellow
Set-Location -Path "server"
npm install socket.io
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error installing server dependencies!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit $LASTEXITCODE
}
Write-Host "Server dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "[2/2] Installing client dependencies..." -ForegroundColor Yellow
Set-Location -Path "..\client"
npm install socket.io-client
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error installing client dependencies!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit $LASTEXITCODE
}
Write-Host "Client dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "All dependencies installed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now start the application:" -ForegroundColor Yellow
Write-Host "  1. Server: cd server && npm run dev" -ForegroundColor White
Write-Host "  2. Client: cd client && npm run dev" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
