@echo off
echo ========================================
echo   Property Dekho Development Setup
echo ========================================

echo.
echo [1/4] Killing any existing processes on ports 5000 and 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    echo Killing process on port 5000: %%a
    taskkill /f /pid %%a 2>nul
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
    echo Killing process on port 5173: %%a
    taskkill /f /pid %%a 2>nul
)

echo.
echo [2/4] Checking if dependencies are installed...
if not exist "Server\node_modules" (
    echo Installing server dependencies...
    cd /d "%~dp0Server"
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install server dependencies
        pause
        exit /b 1
    )
    cd /d "%~dp0"
)

if not exist "Client\node_modules" (
    echo Installing client dependencies...
    cd /d "%~dp0Client"
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install client dependencies
        pause
        exit /b 1
    )
    cd /d "%~dp0"
)

echo.
echo [3/4] Starting Backend Server...
cd /d "%~dp0Server"
start "Property Dekho - Backend" cmd /k "echo Backend Server Starting... && npm run dev"

echo.
echo [4/4] Waiting for backend to initialize...
timeout /t 8 /nobreak >nul

echo Starting Frontend Client...
cd /d "%~dp0Client"
start "Property Dekho - Frontend" cmd /k "echo Frontend Client Starting... && npm run dev"

echo.
echo ========================================
echo   Development Environment Started!
echo ========================================
echo.
echo Backend API: http://localhost:5000
echo Frontend App: http://localhost:5173
echo Health Check: http://localhost:5000/health
echo.
echo If you see errors, check the troubleshooting guide:
echo TROUBLESHOOTING.md
echo.
echo Press any key to open the application in browser...
pause >nul

start http://localhost:5173
echo.
echo Development servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
pause