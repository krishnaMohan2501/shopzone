#!/bin/bash
set -e

JAR_FILE="shopzone-1.0.0.jar"

echo "============================================"
echo "  ShopZone - Online Shopping Platform"
echo "============================================"

if [ ! -f "$JAR_FILE" ]; then
  echo "[ERROR] $JAR_FILE not found in current directory."
  exit 1
fi

echo "[INFO] Starting ShopZone on http://localhost:8080"
echo "[INFO] Make sure PostgreSQL is running and 'shopzone' database exists."
echo "[INFO] First time? Run:  psql -U postgres -f setup.sql"
echo ""

java -jar "$JAR_FILE" \
  --spring.datasource.url=jdbc:postgresql://localhost:5432/shopzone \
  --spring.datasource.username=postgres \
  --spring.datasource.password=postgres
