@echo off
echo Setting up Property Dekho Development Environment...

echo.
echo 1. Installing Server Dependencies...
cd /d "%~dp0Server"
call npm install
if %errorlevel% neq 0 (
    echo Failed to install server dependencies
    pause
    exit /b 1
)

echo.
echo 2. Installing Client Dependencies...
cd /d "%~dp0Client"
call npm install
if %errorlevel% neq 0 (
    echo Failed to install client dependencies
    pause
    exit /b 1
)

echo.
echo 3. Seeding Database with Sample Data...
cd /d "%~dp0Server"
call npm run seed
if %errorlevel% neq 0 (
    echo Warning: Database seeding failed. You may need to check your MongoDB connection.
)

echo.
echo Setup completed successfully!
echo.
echo To start the development environment, run: start-dev.bat
echo.
pause