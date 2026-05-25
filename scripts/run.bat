@echo off
echo ============================================
echo   ShopZone - Online Shopping Platform
echo ============================================
echo.

set JAR_FILE=shopzone-1.0.0.jar

if not exist "%JAR_FILE%" (
    echo [ERROR] JAR file not found: %JAR_FILE%
    echo Please build first:
    echo   cd ..\backend
    echo   mvn clean package -DskipTests -DskipFrontend=false
    echo   copy target\shopzone-1.0.0.jar ..\scripts\
    pause
    exit /b 1
)

echo [INFO] Starting ShopZone on http://localhost:8080
echo [INFO] Make sure PostgreSQL is running and shopzone database exists
echo [INFO] Run setup.sql first if needed: psql -U postgres -f setup.sql
echo.

java -jar %JAR_FILE% ^
  --spring.datasource.url=jdbc:postgresql://localhost:5432/shopzone ^
  --spring.datasource.username=postgres ^
  --spring.datasource.password=postgres

pause
