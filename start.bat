@echo off
echo Starting AQUILA Marine Data Platform...
echo.
echo Installing dependencies...
call npm install
echo.
echo Installing client dependencies...
cd client
call npm install
cd ..
echo.
echo Starting application...
echo Server will run on http://localhost:5000
echo Client will run on http://localhost:5173
echo.
pause
call npm run dev