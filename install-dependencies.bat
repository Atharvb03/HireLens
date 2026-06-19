@echo off
echo Installing Socket.io dependencies...
echo.

echo [1/2] Installing server dependencies...
cd server
call npm install socket.io
if %errorlevel% neq 0 (
    echo Error installing server dependencies!
    pause
    exit /b %errorlevel%
)
echo Server dependencies installed successfully!
echo.

echo [2/2] Installing client dependencies...
cd ..\client
call npm install socket.io-client
if %errorlevel% neq 0 (
    echo Error installing client dependencies!
    pause
    exit /b %errorlevel%
)
echo Client dependencies installed successfully!
echo.

echo ========================================
echo All dependencies installed successfully!
echo ========================================
echo.
echo You can now start the application:
echo   1. Server: cd server ^&^& npm run dev
echo   2. Client: cd client ^&^& npm run dev
echo.
pause
