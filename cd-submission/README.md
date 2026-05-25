# ShopZone — Online Shopping Platform

Full-stack e-commerce platform: **Java 17 + Spring Boot 3.2 + PostgreSQL + React 18**

## Default Accounts
| Role     | Email                  | Password  |
|----------|------------------------|-----------|
| Admin    | admin@shopzone.com     | admin123  |
| Customer | Register on the site   | —         |

## Prerequisites
- **Java 17** (e.g. Amazon Corretto 17 — https://adoptium.net/)
- **PostgreSQL 15+** running on port 5432

## Quick Start (Development)

### 1. Database
```bash
psql -U postgres -f scripts/setup.sql
```

### 2. Backend
```bash
cd backend
JAVA_HOME=/path/to/java17 mvn spring-boot:run
```

### 3. Frontend (dev mode with hot reload)
```bash
cd frontend && npm install && npm run dev
```
Open **http://localhost:5173**

---

## Build Executable JAR (for CD submission)
```bash
cd backend
JAVA_HOME=/path/to/java17 mvn clean package -DskipTests
cp target/shopzone-1.0.0.jar ../scripts/
```
This builds the React frontend and bundles it inside the JAR — **single file deployment**.

## Run from JAR (CS Lab)
1. Ensure PostgreSQL is running and `shopzone` database exists
2. `cd scripts/`
3. **Windows:** `run.bat`  |  **Linux/Mac:** `bash run.sh`
4. Open **http://localhost:8080**

## API Summary
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/products | Public |
| GET | /api/categories | Public |
| POST/PUT/DELETE | /api/products | Admin |
| GET/POST/DELETE | /api/cart/items | Customer |
| POST | /api/orders | Customer |
| GET | /api/orders | Customer |
| GET | /api/orders/admin/all | Admin |
| PUT | /api/orders/admin/:id/status | Admin |

## GitHub
https://github.com/YOUR_USERNAME/shopzone
