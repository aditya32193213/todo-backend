# TaskFlow — Backend API

A REST API for a Todo application built with Node.js, Express, and MongoDB. Supports user authentication with JWT, task management (CRUD), pagination, filtering, and task metrics.

**Live API:** https://todo-backend-t5gm.onrender.com  
**Frontend:** https://todo-frontend-swart-nine.vercel.app

---

## Tech Stack

- **Node.js / Express 5** — server and routing
- **MongoDB / Mongoose 9** — database
- **jsonwebtoken + bcryptjs** — authentication and password hashing
- **Joi** — request validation
- **helmet, cors, express-rate-limit** — security

---

## Project Structure

```
todo-backend/
├── server.js                   # entry point — env validation + server start
├── app.js                      # Express app, middleware, route mounting
├── config/
│   └── db.js                   # MongoDB connection
├── routes/
│   ├── index.js
│   ├── auth.route.js
│   └── task.route.js
├── controllers/
│   ├── auth.controller.js
│   └── task.controller.js
├── services/
│   ├── auth.service.js
│   └── task.service.js
├── models/
│   ├── user.model.js
│   ├── task.model.js
│   └── tokenBlacklist.model.js
├── middleware/
│   ├── auth.middleware.js
│   ├── validate.middleware.js      # validate() factory only
│   ├── validateObjectId.middleware.js
│   └── error.middleware.js
├── schemas/
│   ├── auth.schemas.js             # Joi schemas for auth routes
│   └── task.schemas.js             # Joi schemas for task routes
└── utils/
    ├── generateToken.js
    └── task.constants.js
```

---

## Setup

**Prerequisites:** Node.js ≥ 18, a MongoDB instance (Atlas free tier works fine)

```bash
git clone https://github.com/aditya32193213/todo-backend.git
cd todo-backend
npm install
cp .env.example .env
# edit .env with your values
npm run dev
```

Verify it's running:
```bash
curl http://localhost:5000/
# { "message": "Welcome to the Todo App!" }
```

### Scripts

```
npm run dev     # nodemon (hot-reload)
npm start       # production
```

---

## Environment Variables

Copy `.env.example` to `.env`. The server will refuse to start if any required variable is missing or malformed.

| Variable | Required | Example | Notes |
|---|---|---|---|
| `MONGO_URI` | Yes | `mongodb+srv://...` | MongoDB connection string |
| `JWT_SECRET` | Yes | `d12e519...` | Use a long random string |
| `JWT_EXPIRES_IN` | Yes | `1h`, `7d`, `30m` | Must match `^\d+[smhd]$` |
| `CLIENT_URL` | Yes | `http://localhost:3000` | Exact frontend origin, no trailing slash |
| `PORT` | No | `5000` | Defaults to 5000 |
| `NODE_ENV` | No | `development` | Set to `production` to suppress stack traces |

Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## API Reference

Base URL: `/api`

All responses use the same envelope:
```json
{ "success": true, "message": "...", "data": { ... } }
```

---

### Auth Endpoints

Routes under `/api/auth` have a separate rate limit of 20 requests per 15 minutes per IP, in addition to the global 200/15min limit.

#### POST /api/auth/register

```json
{ "name": "Aditya", "email": "aditya@example.com", "password": "secret123" }
```

Returns `201` with `{ id, name, email, token }`.

Validations: name non-empty, valid email format, password ≥ 6 characters.

#### POST /api/auth/login

```json
{ "email": "aditya@example.com", "password": "secret123" }
```

Returns `200` with `{ id, name, email, token }`. Both wrong email and wrong password return `"Invalid email or password"` — intentional, to prevent user enumeration.

#### POST /api/auth/logout

Requires `Authorization: Bearer <token>`.

Stores the token in a blacklist collection. Any subsequent request using the same token gets a `401`. The blacklist entry is auto-deleted by MongoDB's TTL index when the JWT's natural expiry is reached.

#### PATCH /api/auth/password

Requires `Authorization: Bearer <token>`.

```json
{
  "currentPassword": "secret123",
  "newPassword": "newSecret456",
  "confirmPassword": "newSecret456"
}
```

---

### Task Endpoints

All task routes require `Authorization: Bearer <token>`. Tasks are user-scoped — users can only access their own.

#### GET /api/tasks

Query params:

| Param | Default | Notes |
|---|---|---|
| `page` | 1 | Page number |
| `limit` | 10 | Per page, capped at 50 |
| `status` | — | `pending`, `in-progress`, or `completed` |
| `sort` | `latest` | `latest`, `oldest`, `a-z`, `z-a` |
| `search` | — | Case-insensitive title search |

Response:
```json
{
  "data": {
    "total": 42, "page": 1, "pages": 5, "count": 10,
    "tasks": [{ "_id": "...", "title": "...", "status": "pending", "createdAt": "..." }]
  }
}
```

#### GET /api/tasks/metrics

Returns task counts and completion percentage in a single MongoDB `$facet` aggregation.

```json
{ "data": { "total": 42, "completed": 18, "inProgress": 10, "pending": 14, "pct": 43 } }
```

#### POST /api/tasks

```json
{ "title": "Buy groceries", "description": "Milk, eggs", "status": "pending" }
```

`title` is required. `description` and `status` are optional; status defaults to `"pending"`.

Returns `201` with the created task.

#### PUT /api/tasks/:id

Send only the fields you want to update. At least one field is required.

```json
{ "status": "in-progress" }
```

Returns `200` with the updated task. Returns `400` immediately if `:id` is not a valid MongoDB ObjectId (checked before any DB call).

#### DELETE /api/tasks/:id

Returns `200 { success: true, message: "Task deleted successfully" }`. Returns `400` immediately if `:id` is not a valid MongoDB ObjectId.

---

## Error Handling

All errors flow through a centralised error middleware and return a consistent shape.

| Condition | Status |
|---|---|
| Invalid JSON body | 400 |
| Invalid MongoDB ObjectId | 400 |
| Mongoose ValidationError | 400 |
| Duplicate email | 409 |
| JWT expired | 401 |
| JWT invalid | 401 |
| Token blacklisted / no token | 401 |
| Route not found | 404 |
| Uncaught error | 500 |

In development, 500-level errors also include a `stack` field. In production, it's suppressed.

---

## Security Notes

- **Token blacklisting** — logout invalidates the token server-side, not just client-side. The blacklist is self-maintaining via a MongoDB TTL index.
- **Two-tier rate limiting** — global (200/15min) + stricter auth-specific limit (20/15min) to guard against brute-force.
- **Helmet** — sets standard HTTP security headers.
- **CORS** — restricted to the exact `CLIENT_URL` origin.
- **Body size cap** — 10kb JSON limit.
- **Password security** — bcryptjs, 10 salt rounds, `select: false` on the field so it never appears in query results unless explicitly opted in.
- **ReDoS-safe search** — user input is escaped before being passed to MongoDB's `$regex`.

---

## Architecture

Request flow: `Middleware stack → Router → auth.middleware → validateObjectId.middleware (id routes) → validate.middleware → Controller → Service → Mongoose`

Controllers handle only HTTP mechanics (read request, call service, send response). Services hold all business logic. Models define schema and indexes. No layer crosses into another's responsibility.

Joi schemas live in `schemas/` and are imported by routes — keeping validation rules separate from the middleware factory that runs them.

The `$facet` aggregation in the metrics endpoint computes all four counts in one DB round-trip. The task list endpoint uses `Promise.all` to fetch data and run the count query in parallel.

`/tasks/metrics` is registered before `/:id` in the router to prevent Express from treating the string `"metrics"` as a task ID.

---

## Author

Aditya — Full Stack Developer  
GitHub: https://github.com/aditya32193213