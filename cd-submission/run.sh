#!/bin/bash
set -e

JAR_FILE="shopzone-1.0.0.jar"
JAVA17="/Users/krishna/Library/Java/JavaVirtualMachines/corretto-17.0.11/Contents/Home/bin/java"

echo "============================================"
echo "  ShopZone - Online Shopping Platform"
echo "============================================"

if [ ! -f "$JAR_FILE" ]; then
  echo "[ERROR] JAR not found. Build first:"
  echo "  cd ../backend && mvn clean package -DskipTests -DskipFrontend=false"
  echo "  cp target/shopzone-1.0.0.jar ../scripts/"
  exit 1
fi

# Use Java 17 if available, otherwise fall back to system java
if [ -x "$JAVA17" ]; then
  JAVA_CMD="$JAVA17"
else
  JAVA_CMD="java"
fi

echo "[INFO] Starting ShopZone on http://localhost:8080"
echo "[INFO] Make sure PostgreSQL is running and 'shopzone' database exists"
echo "[INFO] Run: psql -U postgres -f setup.sql (if first time)"
echo ""

$JAVA_CMD -jar "$JAR_FILE" \
  --spring.datasource.url=jdbc:postgresql://localhost:5432/shopzone \
  --spring.datasource.username=postgres \
  --spring.datasource.password=postgres
