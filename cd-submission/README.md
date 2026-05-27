# ShopZone — Online Shopping Platform

Full-stack e-commerce platform: **Java 17 + Spring Boot 3.2 + PostgreSQL + React 18**

**GitHub:** https://github.com/krishnaMohan2501/shopzone

---

## Files in This Folder

```
cd-submission/
├── shopzone-1.0.0.jar   ← entire app (backend + frontend bundled)
├── setup.sql            ← creates the database (run once)
├── run.sh               ← start script for Linux/Mac
├── run.bat              ← start script for Windows
├── docker-run.sh        ← start with Docker (Linux/Mac)
├── docker-run.bat       ← start with Docker (Windows)
├── INSTRUCTIONS.txt
└── README.md
```

---

## Part 1 — Prepare & Push Latest Code (on your dev machine)

Do this whenever you make code changes before submitting.

**Step 1 — Build the latest JAR**
```bash
cd frontend
npm run build

cd ../backend
JAVA_HOME="/path/to/java17" mvn clean package -DskipTests -q

cp target/shopzone-1.0.0.jar ../scripts/shopzone-1.0.0.jar
cp target/shopzone-1.0.0.jar ../cd-submission/shopzone-1.0.0.jar
```

**Step 2 — Commit and push to GitHub**
```bash
cd ..
git add .
git commit -m "update JAR for submission"
git push origin main
```

---

## Part 2 — Copy to CD / USB

Copy **only the `cd-submission` folder** to your CD or USB drive.
No internet, no build tools needed on the target machine — the JAR contains everything.

---

## Part 3 — Run on Another Machine (CS Lab)

Copy the `cd-submission` folder from CD/USB to the lab machine, then open a terminal inside that folder.

---

### Option A — Machine has Java 17 + PostgreSQL

**Step 1 — Create the database (first time only)**
```bash
psql -U postgres -f setup.sql
```
> If it asks for a password, try `postgres` or press Enter

**Step 2 — Start the app**

Linux/Mac:
```bash
bash run.sh
```

Windows (Command Prompt):
```
run.bat
```

**Step 3 — Open in browser**
```
http://localhost:8080
```

---

### Option B — Machine has Docker

Linux/Mac:
```bash
bash docker-run.sh
```

Windows:
```
docker-run.bat
```

Wait 2–3 minutes for first-time build, then open:
```
http://localhost:8080
```

---

## Part 4 — Test It Works

| What to test | How |
|---|---|
| Home page loads | Go to `http://localhost:8080` |
| Register customer | Click Register, fill the form |
| Login as admin | Email: `admin@shopzone.com` / Password: `admin123` |
| Browse products | Click Products in navbar |
| Add to cart | Click "Add to Cart" on any product |
| Place an order | Cart → Checkout → Payment (any card details) |
| View orders | Click Orders in navbar |
| Admin panel | Login as admin → click Admin |

---

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shopzone.com | admin123 |
| Customer | Register a new account on the site | — |

---

## Quick Reference

| Task | Command |
|---|---|
| Build JAR | `mvn clean package -DskipTests` |
| Push to GitHub | `git add . && git commit -m "msg" && git push origin main` |
| Create database | `psql -U postgres -f setup.sql` |
| Run (Linux/Mac) | `bash run.sh` |
| Run (Windows) | `run.bat` |
| Run (Docker) | `bash docker-run.sh` |
| Open app | `http://localhost:8080` |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 3.2, Spring Security 6, Spring Data JPA |
| Database | PostgreSQL 15 |
| Frontend | React 18, Vite, Tailwind CSS, React Router 6 |
| Auth | JWT (jjwt 0.12) |
| Build | Maven 3 — single executable JAR with frontend bundled |
| Docker | Multi-stage build, docker compose |

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
