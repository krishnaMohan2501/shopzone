@echo off
echo ============================================
echo   ShopZone - Docker Setup
echo ============================================
echo.

where docker >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker not found. Install Docker Desktop:
    echo   https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo [INFO] Building and starting ShopZone + PostgreSQL...
echo [INFO] First run takes ~3 minutes to build. Subsequent runs are instant.
echo.

cd /d "%~dp0.."
docker compose up --build

pause
