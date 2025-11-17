@echo off
echo Testing connection to deployed backend...
echo.

echo Testing health endpoint...
curl -s https://property-dekho-in.onrender.com/health

echo.
echo.
echo Testing properties endpoint...
curl -s https://property-dekho-in.onrender.com/properties/test

echo.
echo.
echo If you see JSON responses above, the backend is working!
echo.
pause