@echo off
echo ========================================
echo   Environment Switcher
echo ========================================
echo.
echo Choose your environment:
echo 1. Deployed Backend (Recommended)
echo 2. Local Backend
echo.
set /p choice="Enter your choice (1 or 2): "

cd /d "%~dp0Client"

if "%choice%"=="1" (
    echo.
    echo Switching to deployed backend...
    copy .env.deployed .env >nul
    echo ✓ Now using: https://property-dekho-in.onrender.com
) else if "%choice%"=="2" (
    echo.
    echo Switching to local backend...
    copy .env.local .env >nul
    echo ✓ Now using: http://localhost:5000
    echo ⚠ Make sure to run your local server!
) else (
    echo Invalid choice. Using deployed backend by default.
    copy .env.deployed .env >nul
    echo ✓ Now using: https://property-dekho-in.onrender.com
)

echo.
echo Environment updated! Restart your frontend if it's running.
pause