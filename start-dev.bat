@echo off
echo Starting Property Dekho Development Environment...

echo.
echo Killing any existing processes on ports 5000 and 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do taskkill /f /pid %%a 2>nul

echo.
echo Starting Backend Server...
cd /d "%~dp0Server"
start "Backend Server" cmd /k "npm start"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend Client...
cd /d "%~dp0Client"
start "Frontend Client" cmd /k "npm run dev"

echo.
echo Development environment started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause