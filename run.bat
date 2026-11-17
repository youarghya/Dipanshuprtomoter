@echo off
setlocal
title Dipanshu Promoter and Builder - Website
cd /d "%~dp0"

echo ============================================================
echo   Dipanshu Promoter ^& Builder
echo   Website + Management Console
echo ============================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is not installed.
  echo Install Node.js 18 or newer from https://nodejs.org and try again.
  echo.
  pause
  exit /b 1
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm was not found.
  echo Reinstall Node.js 18 or newer from https://nodejs.org and try again.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo First run - installing dependencies. This may take a minute...
  echo.
  call npm.cmd install
  if errorlevel 1 (
    echo.
    echo [ERROR] Dependency installation failed. Check your internet connection.
    pause
    exit /b 1
  )
  echo.
)

echo Starting the development server...
echo.
echo   Public website:  http://localhost:5173
echo   Admin console:   http://localhost:5173/#/admin
echo.
echo   Login:  admin@dipanshu.in  /  admin123
echo.
echo   Keep this window open. Press Ctrl+C to stop the server.
echo ============================================================
echo.

call npm.cmd run dev -- --open

echo.
echo Server stopped.
pause
