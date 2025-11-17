@echo off
echo ========================================
echo   Property Dekho Frontend (Using Deployed Backend)
echo ========================================

echo.
echo Backend API: https://property-dekho-in.onrender.com
echo Frontend will connect to deployed backend automatically
echo.

echo Killing any existing processes on port 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
    echo Killing process on port 5173: %%a
    taskkill /f /pid %%a 2>nul
)

echo.
echo Checking if dependencies are installed...
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
echo Starting Frontend Client...
cd /d "%~dp0Client"
start "Property Dekho - Frontend" cmd /k "echo Frontend connecting to deployed backend... && npm run dev"

echo.
echo ========================================
echo   Frontend Started!
echo ========================================
echo.
echo Frontend App: http://localhost:5173
echo Backend API: https://property-dekho-in.onrender.com
echo.
echo The frontend will automatically connect to the deployed backend.
echo No need to run local backend server.
echo.
pause