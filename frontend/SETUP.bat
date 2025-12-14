@echo off
REM E-Commerce Frontend Quick Setup Script

echo.
echo ================================================
echo   E-Commerce Frontend Setup
echo ================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js found:
node --version

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)

echo ✓ npm found:
npm --version

REM Navigate to frontend folder
cd /d C:\Users\user\IdeaProjects\EcomerceProj\frontend

echo.
echo ================================================
echo   Installing Dependencies...
echo ================================================
echo This may take 2-5 minutes on first run
echo.

REM Install dependencies
npm install

if %errorlevel% neq 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo.
echo ================================================
echo   ✓ Installation Complete!
echo ================================================
echo.
echo Next steps:
echo 1. Run the backend: cd ..\. && ./gradlew bootRun
echo 2. Then run the frontend: npm run dev
echo 3. Open browser: http://localhost:5173
echo.

pause

