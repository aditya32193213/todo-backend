<div align="center">

# 📝 MERN Todo App Backend

### *Your tasks. Your flow. Totally under control.*


[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](https://opensource.org/licenses/ISC)

[![Live Demo](https://img.shields.io/badge/🌐_Frontend-Live_Demo-6366f1?style=for-the-badge)](https://todo-frontend-swart-nine.vercel.app/)
[![Backend API](https://img.shields.io/badge/⚙️_Backend-API_Docs-10b981?style=for-the-badge)](https://todo-backend-t5gm.onrender.com/)
[![License: MIT](https://img.shields.io/badge/📄_License-MIT-f59e0b?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/🤝_PRs-Welcome-ec4899?style=for-the-badge)](CONTRIBUTING.md)


<br/>

> 🚀 A secure and scalable backend for a Todo application built using **Node.js, Express, MongoDB, and JWT authentication**.
This project implements user authentication and task management with clean architecture (Controller → Service → Model).

<br/>

---
## 🎬 Demo

[![TaskFlow Demo Video](https://img.shields.io/badge/▶️_Watch_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.loom.com/share/cf2456f629684cfeaec0441862e4416d)

> 📹 *Click above to watch a full walkthrough of TaskFlow in action!*

---

</div>

---

## 📌 Table of Contents

- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Folder Structure](#-folder-structure)
- [🏗️ System Architecture](#️-system-architecture)
- [⚙️ Environment Variables](#️-environment-variables)
- [🚀 Setup & Installation](#-setup--installation)
- [🔒 Security Architecture](#-security-architecture)
- [🗺️ API Documentation](#️-api-documentation)
  - [🔐 Auth Endpoints](#-auth-endpoints)
  - [✅ Task Endpoints](#-task-endpoints)
- [⚠️ Error Handling](#️-error-handling)
- [🗄️ Database Design](#️-database-design)
- [🧠 Architecture & Design Decisions](#-architecture--design-decisions)
- [👤 Author](#-author)

---

## ✨ Key Features

| 🔐 Security | ⚡ Performance | 🧱 Architecture |
|---|---|---|
| JWT Auth with token blacklisting | MongoDB compound indexes | Clean layered MVC structure |
| bcryptjs password hashing | `$facet` aggregation (1 DB trip for metrics) | Centralised error handling |
| Helmet security headers (~15 headers) | Connection pooling (min: 2, max: 10) | Fail-fast env validation at startup |
| Two-tier rate limiting | Pagination with configurable limits | ESM modules throughout |
| Strict CORS origin enforcement | `.lean()` queries for plain JS objects | Consistent `{ success, message, data }` API shape |
| 10 kb JSON body cap | TTL-indexed token blacklist (auto-cleanup) | Regex-escaped search input (ReDoS safe) |
| Proxy-aware IP detection | Parallel DB queries via `Promise.all` | Express v5 (latest stable) |

---

## 🛠️ Tech Stack

| Category | Technology | Version | Purpose |
|---|---|---|---|
| ⚙️ Runtime | **Node.js** (ESM) | ≥ 18 | Server runtime |
| 🚂 Framework | **Express** | ^5.2.1 | HTTP routing & middleware |
| 🍃 Database | **MongoDB** via **Mongoose** | ^9.3.1 | Document storage & ORM |
| 🔑 Auth | **jsonwebtoken** | ^9.0.3 | JWT signing & verification |
| 🔐 Hashing | **bcryptjs** | ^3.0.3 | Password hashing (salt rounds: 10) |
| 🛡️ Security | **helmet** | ^8.1.0 | HTTP security headers |
| 🌐 CORS | **cors** | ^2.8.6 | Cross-origin request control |
| 🚦 Rate Limit | **express-rate-limit** | ^8.3.1 | Brute-force & DDoS protection |
| 🔐 Env | **dotenv** | ^17.3.1 | Environment variable loading |
| 🔄 Dev | **nodemon** | ^3.1.14 | Hot-reload development server |

---

## 📁 Folder Structure

```
todo-backend/
│
├── 📄 server.js                        # 🚀 Entry point — env validation & server bootstrap
├── 📄 app.js                           # ⚙️  Express app — middleware stack & route mounting
├── 📄 package.json                     # 📦 Dependencies & npm scripts
├── 📄 .env                             # 🔐 Local environment variables (never commit!)
├── 📄 .env.example                     # 📋 Environment variable template
│
├── 📂 config/
│   └── 📄 db.js                        # 🍃 MongoDB connection with pool configuration
│
├── 📂 routes/
│   ├── 📄 index.js                     # 🗺️  Root router — mounts /auth and /tasks
│   ├── 📄 auth.route.js                # 🔐 Auth route definitions
│   └── 📄 task.route.js                # ✅ Task route definitions
│
├── 📂 controllers/
│   ├── 📄 auth.controller.js           # 🎮 Auth — request validation & service delegation
│   └── 📄 task.controller.js           # 🎮 Task — request validation & service delegation
│
├── 📂 services/
│   ├── 📄 auth.service.js              # 🧠 Auth business logic (register/login/logout/password)
│   └── 📄 task.service.js              # 🧠 Task business logic (CRUD + metrics + pagination)
│
├── 📂 models/
│   ├── 📄 user.model.js                # 👤 User schema (password: select:false)
│   ├── 📄 task.model.js                # 📋 Task schema with 3 compound indexes
│   └── 📄 tokenBlacklist.model.js      # 🚫 Blacklisted JWTs with MongoDB TTL auto-expiry
│
├── 📂 middleware/
│   ├── 📄 auth.middleware.js           # 🛡️  JWT verify → blacklist check → user lookup
│   └── 📄 error.middleware.js          # ❌ Global error handler (Mongoose, JWT, HTTP errors)
│
└── 📂 utils/
    └── 📄 generateToken.js             # 🔑 JWT signing utility
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            CLIENT (Frontend)                             │
│                         http://localhost:3000                            │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │  HTTP
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       app.js — Middleware Stack                          │
│                                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │  Helmet  │  │   CORS   │  │ express.json │  │   Rate Limiters    │  │
│  │(~15 HTTP │  │ (strict  │  │  (10kb cap)  │  │ Global: 200/15min  │  │
│  │ headers) │  │ origin)  │  │              │  │ Auth:    20/15min  │  │
│  └──────────┘  └──────────┘  └──────────────┘  └────────────────────┘  │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          routes/index.js                                 │
│                                                                          │
│          ┌──────────────────────┐     ┌──────────────────────┐          │
│          │    /api/auth/*       │     │    /api/tasks/*      │          │
│          │   auth.route.js      │     │   task.route.js      │          │
│          └──────────┬───────────┘     └──────────┬───────────┘          │
└─────────────────────┼────────────────────────────┼─────────────────────┘
                      │                            │
                      ▼                            ▼
          ┌───────────────────────────────────────────────────┐
          │            auth.middleware.js  (protect)           │
          │  ① jwt.verify()      → CPU only, no DB hit        │
          │  ② TokenBlacklist.exists() → rejects logged out   │
          │  ③ User.findById()   → rejects deleted accounts   │
          └───────────────────┬───────────────────────────────┘
                              │
               ┌──────────────┴────────────────┐
               │                               │
               ▼                               ▼
  ┌────────────────────────┐     ┌──────────────────────────────┐
  │   auth.controller.js   │     │     task.controller.js       │
  │  • Input validation    │     │  • Extract query/body/params │
  │  • Delegate to service │     │  • Delegate to service       │
  └──────────┬─────────────┘     └──────────────┬───────────────┘
             │                                  │
             ▼                                  ▼
  ┌────────────────────────┐     ┌──────────────────────────────┐
  │    auth.service.js     │     │       task.service.js        │
  │ • registerUserService  │     │ • getAllTasksService          │
  │ • loginUserService     │     │ • getTaskMetricsService      │
  │ • logoutUserService    │     │ • createTaskService          │
  │ • updatePasswordService│     │ • updateTaskService          │
  └──────────┬─────────────┘     │ • deleteTaskService          │
             │                   └──────────────┬───────────────┘
             │                                  │
             └─────────────────┬────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         MongoDB via Mongoose                             │
│                                                                          │
│  ┌──────────────────┐ ┌───────────────────────┐ ┌────────────────────┐  │
│  │   User model     │ │     Task model        │ │ TokenBlacklist     │  │
│  │  password:       │ │  3 compound indexes   │ │ TTL index on       │  │
│  │  select: false   │ │  for all queries      │ │ expiresAt field    │  │
│  └──────────────────┘ └───────────────────────┘ └────────────────────┘  │
│  Pool: min 2, max 10 connections  |  serverSelectionTimeout: 5s          │
└─────────────────────────────────────────────────────────────────────────┘
                               │
           error anywhere →    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    error.middleware.js  (Global Handler)                 │
│  SyntaxError | CastError | ValidationError | 11000 | JWT | 404 | 500   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 🔄 Request Lifecycle

```
Incoming Request
  → 🛡️  Helmet (set security headers)
  → 🌐  CORS  (check origin)
  → 📦  Body Parser (parse JSON, enforce 10kb cap)
  → 🚦  Rate Limiter (global + auth-specific)
  → 🗺️  Router (match route)
  → 🔐  auth.middleware (JWT verify → blacklist → user lookup)
  → 🎮  Controller (validate inputs)
  → 🧠  Service (business logic)
  → 🍃  Mongoose → MongoDB
  → ✅  Response  OR  ❌ next(error) → error.middleware → Response
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in your values. The server **will refuse to start** and print a descriptive error if any required variable is missing or malformed — no silent failures.

### 📋 `.env.example`

```env
# ── Server ──────────────────────────────────────────────────────────────────
PORT=5000

# ── Database ─────────────────────────────────────────────────────────────────
# Get your connection string from MongoDB Atlas or use a local instance
MONGO_URI=your_mongodb_connection_string
# Atlas example:
# MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/todoapp?retryWrites=true&w=majority

# ── JWT ───────────────────────────────────────────────────────────────────────
# Use a long, random, cryptographically secure string (64-char hex recommended)
JWT_SECRET=your_jwt_secret_key

# Accepted formats: <number><unit>  where unit is s | m | h | d
# ✅ Valid:    1h  |  30m  |  7d  |  3600s
# ❌ Invalid:  7days  |  1week  |  3600  (will crash startup)
JWT_EXPIRES_IN=1h

# ── CORS ──────────────────────────────────────────────────────────────────────
# Exact frontend origin — no trailing slash, no wildcards
CLIENT_URL=http://localhost:3000

# ── Environment ───────────────────────────────────────────────────────────────
# "development" → verbose logs + stack traces in 500 responses
# "production"  → stack traces suppressed
NODE_ENV=development
```

### 📊 Variable Reference Table

| Variable | Required | Default | Example | Validation |
|---|---|---|---|---|
| `PORT` | ❌ Optional | `5000` | `5000` | Any valid port number |
| `MONGO_URI` | ✅ Required | — | `mongodb+srv://...` | Must be a valid MongoDB URI |
| `JWT_SECRET` | ✅ Required | — | `d12e51932e...` | Any string (longer = stronger) |
| `JWT_EXPIRES_IN` | ✅ Required | — | `1h` / `7d` / `30m` | Must match `^\d+[smhd]$` regex |
| `CLIENT_URL` | ✅ Required | — | `http://localhost:3000` | Exact frontend origin |
| `NODE_ENV` | ❌ Optional | — | `development` | Controls logging & error verbosity |

> 🔐 **Generate a strong JWT_SECRET:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

> ⚠️ **Never commit your `.env` file.** Add it to `.gitignore` immediately.

---

## 🚀 Setup & Installation

### 📋 Prerequisites

- ✅ **Node.js** ≥ 18.x — [Download](https://nodejs.org/)
- ✅ **npm** ≥ 9.x (bundled with Node.js)
- ✅ A **MongoDB** instance — [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier) or a local install

---

### 🔧 Step-by-Step Installation

```bash
# 1️⃣  Clone the repository
git clone https://github.com/your-username/todo-backend.git
cd todo-backend

# 2️⃣  Install all dependencies
npm install

# 3️⃣  Set up environment variables
cp .env.example .env
# ✏️  Open .env and fill in MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN, CLIENT_URL

# 4️⃣  Start the development server (hot-reload via nodemon)
npm run dev

# 5️⃣  OR start the production server
npm start
```

---

### 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| 🔄 Development | `npm run dev` | Nodemon hot-reload — restarts on file changes |
| 🚀 Production | `npm start` | Standard `node server.js` |
| 🧪 Test | `npm test` | *(Test suite not yet configured)* |

---

### ✅ Verify It's Running

```bash
curl http://localhost:5000/
# Expected → { "message": "Welcome to the Todo App!" }
```

If you see a startup error, check:
1. All required env vars are set in `.env`
2. `JWT_EXPIRES_IN` uses the format `<number><s|m|h|d>` (e.g. `1h`)
3. Your `MONGO_URI` is reachable (Atlas IP whitelist, correct credentials)

---

## 🔒 Security Architecture

### 🛡️ 1. Helmet — HTTP Security Headers
`helmet()` sets ~15 response headers in one call including `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, and `X-XSS-Protection`.

---

### 🌐 2. CORS — Strict Origin Enforcement
```js
cors({
  origin: process.env.CLIENT_URL,   // exact match — never "*"
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
})
```
Only requests from the exact `CLIENT_URL` origin pass. All other origins are rejected at the preflight stage.

---

### 🚦 3. Two-Tier Rate Limiting

| Limiter | Scope | Limit | Defends Against |
|---|---|---|---|
| `globalLimiter` | All routes | 200 req / 15 min / IP | General abuse & scraping |
| `authLimiter` | `/api/auth/*` only | 20 req / 15 min / IP | Brute-force, credential-stuffing, password-spraying |

Both send RFC 6585 `RateLimit-*` headers. `trust proxy: 1` is set so the real client IP is used when behind Heroku/Nginx.

---

### 📦 4. Body Size Cap
```js
express.json({ limit: "10kb" })
```
Rejects any JSON payload over 10 kb — prevents memory-pressure attacks from oversized bodies.

---

### 🔐 5. JWT Authentication Flow

```
Login ──→ generateToken(userId)
              │
              └─→ jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

Every protected request:
  ① Check Authorization header  →  must be "Bearer <token>"
  ② jwt.verify(token, secret)   →  CPU only, no DB  ← expired/invalid stopped here
  ③ TokenBlacklist.exists()     →  DB query          ← logged-out tokens stopped here
  ④ User.findById(decoded.id)   →  DB query          ← deleted accounts stopped here
  ⑤ req.user = user  →  next()  →  route handler
```

---

### 🚫 6. Token Blacklisting on Logout
On logout, the token is stored in `TokenBlacklist` with its exact `expiresAt` timestamp (from `jwt.decode()`). A **MongoDB TTL index** (`expireAfterSeconds: 0`) automatically deletes the entry when the JWT's natural lifetime ends — zero manual cleanup required.

---

### 🔑 7. Password Security
- Hashed with **bcryptjs** at **salt rounds: 10** — plaintext never stored
- `password` field has `select: false` → excluded from every query by default
- Only `loginUserService` and `updatePasswordService` ever opt in with `.select("+password")`

---

### 🔍 8. ReDoS-Safe Search
```js
const escaped = trimmedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
query.title = { $regex: escaped, $options: "i" };
```
All regex metacharacters are escaped before passing to MongoDB's `$regex`, preventing catastrophic backtracking from malicious search strings.

---

## 🗺️ API Documentation

### 🌐 Base URL
```
http://localhost:5000/api
```

### 🩺 Health Check
```http
GET /
```
```json
{ "message": "Welcome to the Todo App!" }
```

### 📐 Universal Response Shape
Every endpoint — success or error — uses the same envelope:
```json
{
  "success": true,
  "message": "Human-readable description",
  "data": { ... }
}
```

---

## 🔐 Auth Endpoints

> All auth routes are additionally protected by the **authLimiter** (20 req / 15 min / IP).
> Routes marked 🔒 require `Authorization: Bearer <token>`.

---

### 📝 Register
```http
POST /api/auth/register
```

**Request Body**
```json
{
  "name": "Aditya",
  "email": "aditya@example.com",
  "password": "secret123"
}
```

| Field | Required | Validation |
|---|---|---|
| `name` | ✅ | Non-blank string |
| `email` | ✅ | Valid email format (`^[^\s@]+@[^\s@]+\.[^\s@]+$`) |
| `password` | ✅ | Raw length ≥ 6 characters |

**✅ Response `201 Created`**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "665f1a2b3c4d5e6f7a8b9c0d",
    "name": "Aditya",
    "email": "aditya@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**❌ Error Cases**

| Condition | Status | Message |
|---|---|---|
| Missing/blank field | `400` | `"All fields are required"` |
| Invalid email format | `400` | `"Invalid email format"` |
| Password < 6 characters | `400` | `"Password must be at least 6 characters"` |
| Email already registered | `409` | `"User already exists"` |

---

### 🔓 Login
```http
POST /api/auth/login
```

**Request Body**
```json
{
  "email": "aditya@example.com",
  "password": "secret123"
}
```

**✅ Response `200 OK`**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "id": "665f1a2b3c4d5e6f7a8b9c0d",
    "name": "Aditya",
    "email": "aditya@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**❌ Error Cases**

| Condition | Status | Message |
|---|---|---|
| Missing fields | `400` | `"Email and password are required"` |
| Invalid email format | `400` | `"Invalid email format"` |
| Wrong email or password | `401` | `"Invalid email or password"` |

> 🔐 Both "user not found" and "wrong password" return the same `"Invalid email or password"` message — intentional user-enumeration prevention.

---

### 🚪 Logout 🔒
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**✅ Response `200 OK`**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

> ⚠️ Call this **before** clearing localStorage on the client. The token must still be in the `Authorization` header so the backend can blacklist it. Any subsequent request with the same token receives `401`.

---

### 🔑 Update Password 🔒
```http
PATCH /api/auth/password
Authorization: Bearer <token>
```

**Request Body**
```json
{
  "currentPassword": "secret123",
  "newPassword": "newSecret456",
  "confirmPassword": "newSecret456"
}
```

**Validation Chain**

| Check | Layer | Error |
|---|---|---|
| All three fields present (non-blank) | Controller | `400 "All password fields are required"` |
| `newPassword` ≥ 6 characters | Controller | `400 "New password must be at least 6 characters"` |
| `newPassword === confirmPassword` | Controller | `400 "Passwords do not match"` |
| `newPassword !== currentPassword` | Controller | `400 "New password must differ from current password"` |
| `currentPassword` matches stored bcrypt hash | Service | `400 "Current password is incorrect"` |

**✅ Response `200 OK`**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

## ✅ Task Endpoints

> All task routes require `Authorization: Bearer <token>`.
> Tasks are **user-scoped** — users can only see and modify their own tasks.

---

### 📋 Get All Tasks *(Paginated + Filtered)*
```http
GET /api/tasks
Authorization: Bearer <token>
```

**Query Parameters**

| Param | Type | Default | Constraints | Description |
|---|---|---|---|---|
| `page` | number | `1` | ≥ 1 | Page number (floored at 1) |
| `limit` | number | `10` | 1–50 (capped) | Results per page |
| `status` | string | *(all)* | `pending` \| `in-progress` \| `completed` | Filter by status |
| `sort` | string | `latest` | `latest` \| `oldest` \| `a-z` \| `z-a` | Sort order |
| `search` | string | *(none)* | any string | Case-insensitive title substring match |

**Example Request**
```
GET /api/tasks?page=1&limit=5&status=pending&sort=a-z&search=grocery
```

**✅ Response `200 OK`**
```json
{
  "success": true,
  "message": "Tasks fetched successfully",
  "data": {
    "total": 42,
    "page": 1,
    "pages": 9,
    "count": 5,
    "tasks": [
      {
        "_id": "665f1a2b3c4d5e6f7a8b9c0d",
        "title": "Buy groceries",
        "description": "Milk, eggs, bread",
        "status": "pending",
        "createdAt": "2024-06-01T10:30:00.000Z"
      }
    ]
  }
}
```

| Response Field | Description |
|---|---|
| `total` | Total matching tasks (across all pages) |
| `page` | Current page number |
| `pages` | Total number of pages |
| `count` | Tasks returned in this response |
| `tasks` | Array of task objects |

---

### 📊 Get Task Metrics
```http
GET /api/tasks/metrics
Authorization: Bearer <token>
```

> ⚡ Computed in a **single MongoDB aggregation** using `$facet` — all counts and percentage derived in one DB round-trip.

> 🚨 Registered **before** `/:id` in the router — prevents Express from interpreting the string `"metrics"` as an ObjectId parameter.

**✅ Response `200 OK`**
```json
{
  "success": true,
  "message": "Metrics fetched successfully",
  "data": {
    "total": 42,
    "completed": 18,
    "inProgress": 10,
    "pending": 14,
    "pct": 43
  }
}
```

| Field | Description |
|---|---|
| `total` | All tasks owned by the authenticated user |
| `completed` | Tasks with status `"completed"` |
| `inProgress` | Tasks with status `"in-progress"` |
| `pending` | Tasks with status `"pending"` |
| `pct` | `Math.round(completed / total * 100)` — `0` if no tasks |

---

### ➕ Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
```

**Request Body**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "pending"
}
```

| Field | Required | Default | Notes |
|---|---|---|---|
| `title` | ✅ Yes | — | Non-empty string; trimmed before save |
| `description` | ❌ No | — | Optional; trimmed before save |
| `status` | ❌ No | `"pending"` | Must be a valid status if provided |

**✅ Response `201 Created`**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "status": "pending",
    "userId": "665f...",
    "createdAt": "2024-06-01T10:30:00.000Z",
    "updatedAt": "2024-06-01T10:30:00.000Z"
  }
}
```

**❌ Error Cases**

| Condition | Status | Message |
|---|---|---|
| Missing / empty title | `400` | `"Title is required"` |
| Invalid status value | `400` | `"Invalid status value"` |

---

### ✏️ Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
```

> All body fields are optional but **at least one** must be provided.

**Request Body** *(partial updates supported)*
```json
{
  "title": "Buy groceries and snacks",
  "status": "in-progress"
}
```

**✅ Response `200 OK`**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "title": "Buy groceries and snacks",
    "description": "Milk, eggs, bread",
    "status": "in-progress",
    "userId": "665f...",
    "createdAt": "2024-06-01T10:30:00.000Z",
    "updatedAt": "2024-06-01T11:00:00.000Z"
  }
}
```

**❌ Error Cases**

| Condition | Status | Message |
|---|---|---|
| Invalid MongoDB ObjectId | `400` | `"Invalid task ID"` |
| Title provided but empty | `400` | `"Title cannot be empty"` |
| Invalid status value | `400` | `"Invalid status value"` |
| No valid fields in body | `400` | `"No valid fields provided for update"` |
| Task not found / not owned | `404` | `"Task not found or not authorized"` |

---

### 🗑️ Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

**✅ Response `204 No Content`**
*(No response body — the resource is gone.)*

**❌ Error Cases**

| Condition | Status | Message |
|---|---|---|
| Invalid MongoDB ObjectId | `400` | `"Invalid task ID"` |
| Task not found / not owned | `404` | `"Task not found or not authorized"` |

---

## ⚠️ Error Handling

All errors — Mongoose, JWT, application, or unexpected — flow through the centralised `error.middleware.js` handler, which maps every error type to an appropriate HTTP status and consistent response shape.

### 🗂️ Error Type Mapping

| Trigger | Error | Status | Client Message |
|---|---|---|---|
| Invalid JSON body | `SyntaxError` (`entity.parse.failed`) | `400` | `"Invalid JSON in request body"` |
| Route param not a valid ObjectId | `CastError` (`kind: ObjectId`) | `400` | `"Invalid ID format"` |
| Schema validator fails | `ValidationError` | `400` | All field messages joined by `, ` |
| Duplicate unique-index violation | MongoDB code `11000` | `409` | `"An account with that <field> already exists"` |
| JWT past its expiry | `TokenExpiredError` | `401` | `"Session expired. Please sign in again."` |
| Bad signature / malformed token | `JsonWebTokenError` | `401` | `"Invalid token. Please sign in again."` |
| Token found in blacklist | App error | `401` | `"Session has been invalidated. Please log in again."` |
| Missing / malformed Auth header | App error | `401` | `"Not authorized, no token"` |
| No matching route | App error | `404` | `"Route not found: <METHOD> <PATH>"` |
| Service throws with `statusCode` | App error | dynamic | `error.message` |
| Uncaught crash | Fallback | `500` | `"Internal Server Error"` |

### 🛠️ Dev vs Production Error Verbosity

```json
// NODE_ENV=development — 500 responses include stack trace:
{
  "success": false,
  "message": "Internal Server Error",
  "stack": "Error: ...\n    at ..."
}

// NODE_ENV=production — stack trace suppressed:
{
  "success": false,
  "message": "Internal Server Error"
}
```

> All non-production errors are also logged to `console.error` with the method and path for debugging.

---

## 🗄️ Database Design

### 👤 User Collection

```
users
├── _id          ObjectId    auto-generated primary key
├── name         String      required, trimmed
├── email        String      required, unique (→ B-tree index), lowercase, trimmed
├── password     String      required, minlength: 6, select: false (never returned by default)
├── createdAt    Date        auto (Mongoose timestamps)
└── updatedAt    Date        auto (Mongoose timestamps)
```

---

### 📋 Task Collection

```
tasks
├── _id          ObjectId    auto-generated primary key
├── title        String      required, trimmed
├── description  String      optional, trimmed
├── status       String      enum: ["pending","in-progress","completed"]  default: "pending"
├── userId       ObjectId    required, ref: "User"
├── createdAt    Date        auto (Mongoose timestamps)
└── updatedAt    Date        auto (Mongoose timestamps)

Indexes:
  { userId: 1, status:    1  }   → status filter queries
  { userId: 1, createdAt: -1 }   → latest / oldest sort (no in-memory SORT)
  { userId: 1, title:     1  }   → a-z / z-a sort
```

**Why compound indexes?** MongoDB's leftmost-prefix rule means a query on `userId` alone hits all three indexes — no redundant single-field `userId` index is needed. Each index eliminates an in-memory operation:

| Query Pattern | Index Used | Benefit |
|---|---|---|
| `?status=pending` | `{ userId, status }` | Index seek to exact bucket |
| `?sort=latest` | `{ userId, createdAt: -1 }` | Documents arrive pre-sorted |
| `?sort=a-z` | `{ userId, title }` | No SORT stage in the query plan |

---

### 🚫 TokenBlacklist Collection

```
tokenblacklists
├── _id        ObjectId    auto-generated
├── token      String      required, unique (→ B-tree index, no extra index: true)
└── expiresAt  Date        required

Indexes:
  { expiresAt: 1 }  expireAfterSeconds: 0
  → MongoDB daemon auto-deletes the document once expiresAt is reached
  → Mirrors the JWT's own exp — blacklist stays lean, zero manual cleanup
```

---

## 🧠 Architecture & Design Decisions

### 🏛️ Strict Layered Architecture
Controllers own **only** input validation and HTTP mechanics. Services own all business logic. Models define data shape and DB constraints. No layer ever calls another layer's dependency directly — a controller never touches Mongoose, a service never reads `req`.

### ⚡ Fail-Fast Startup
`server.js` validates every required env var **and** the `JWT_EXPIRES_IN` format before a DB connection is even attempted. Bad config → `process.exit(1)` with a human-readable message that names the exact problem.

### 🔒 `select: false` on Password
The hash cannot leak into API responses, logs, or middleware no matter what — even accidental `res.json(req.user)` calls are safe. Only two service functions ever opt in with `.select("+password")`, and only when the hash is genuinely needed.

### 📊 Single-Trip Metrics
`getTaskMetricsService` uses MongoDB's `$facet` to compute all four counts in **one** aggregation pipeline. No N+1 queries, no application-side counting, no multiple `countDocuments` calls.

### ⚡ Parallel Queries
`getAllTasksService` issues the data fetch and the count simultaneously:
```js
const [tasks, total] = await Promise.all([Task.find(...).lean(), Task.countDocuments(...)]);
```
This halves latency vs sequential awaits.

### 🧹 Self-Maintaining Blacklist
The TTL index on `TokenBlacklist.expiresAt` is set to `expireAfterSeconds: 0`, meaning MongoDB deletes the document the moment `expiresAt` is reached. No cron job, no scheduled task, no manual cleanup script — ever.

### 📍 Route Registration Order
`/metrics` is registered **before** `/:id` in `task.route.js`. If it were after, Express would pass `"metrics"` as the `id` param, hitting the `CastError` handler before the metrics controller is reached.

### 🛡️ JWT Error Name Preservation
`auth.middleware.js` forwards JWT errors with `next(error)` — never `next(new Error(error.message))`. Wrapping destroys `err.name`, making `TokenExpiredError` and `JsonWebTokenError` indistinguishable in the error handler, collapsing both into the generic 500 fallback.

### 📏 Input Sanitisation Strategy
- **Whitespace**: `.trim()` applied at controller and service layers
- **Limit capping**: `Math.min(50, limit)` — clients can't request unbounded datasets
- **Page flooring**: `Math.max(1, page)` — negative/zero page numbers are normalised
- **Search escaping**: regex metacharacters neutralised before `$regex` to prevent ReDoS

---

## 👤 Author

<div align="center">

**Aditya**
*Full Stack Developer*

</div>

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">

*Built with ❤️ by Aditya*

</div>
