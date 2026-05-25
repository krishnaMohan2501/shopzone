#!/bin/bash
set -e

echo "============================================"
echo "  ShopZone - Docker Setup"
echo "============================================"

if ! command -v docker &> /dev/null; then
  echo "[ERROR] Docker not found. Install Docker Desktop:"
  echo "  https://www.docker.com/products/docker-desktop/"
  exit 1
fi

echo "[INFO] Building and starting ShopZone + PostgreSQL..."
echo "[INFO] First run takes ~3 minutes to build. Subsequent runs are instant."
echo ""

cd "$(dirname "$0")/.."
docker compose up --build
