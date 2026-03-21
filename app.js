import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// ── Security headers ───────────────────────────────────────────────────────
// helmet() sets ~15 HTTP response headers in one call:
// Content-Security-Policy, X-Frame-Options, X-XSS-Protection, etc.
app.use(helmet());

// ── CORS ───────────────────────────────────────────────────────────────────
// CLIENT_URL is required at startup (validated in server.js), so the value
// here is always the exact origin of the frontend — never a wildcard.
// Explicit methods + allowedHeaders prevents accidental preflight passes for
// methods or headers this API never uses.
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Body parsing ───────────────────────────────────────────────────────────
// 10 kb cap rejects payloads large enough to cause memory pressure.
// A task title + description is well under 1 kb in practice.
// Without a limit, express.json() allocates memory for whatever the client sends.
app.use(express.json({ limit: "10kb" }));

// ── Rate limiting ──────────────────────────────────────────────────────────
// Two tiers:
//
//   globalLimiter — broad protection across all routes (200 req / 15 min / IP).
//   authLimiter   — stricter cap on login + register to slow brute-force attacks
//                   (20 req / 15 min / IP).
//
// standardHeaders: true  → sends RateLimit-* headers (RFC 6585 draft)
// legacyHeaders:   false → suppresses the older X-RateLimit-* headers
//
// Both limiters must be registered BEFORE app.use("/api", routes) so the
// middleware runs before any route handler.

const globalLimiter = rateLimit({
  windowMs:       15 * 60 * 1000,
  max:            200,
  standardHeaders: true,
  legacyHeaders:  false,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again in 15 minutes.",
  },
});

// Stricter limiter applied only to authentication routes.
// 20 attempts per 15-minute window is generous for legitimate users
// (register once, login a handful of times) but impractical for automated
// credential-stuffing or password-spraying attacks.
const authLimiter = rateLimit({
  windowMs:       15 * 60 * 1000,
  max:            20,
  standardHeaders: true,
  legacyHeaders:  false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again in 15 minutes.",
  },
});

app.set("trust proxy", 1); // Enable if behind a proxy (e.g. Heroku) to get correct client IP for rate limiting
app.use(globalLimiter);


// Auth limiter must be declared before app.use("/api", routes) so it fires
// for every /api/auth/* request regardless of which specific route matches.
app.use("/api/auth", authLimiter);

// ── Health check ───────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Todo App!" });
});

// ── API routes ─────────────────────────────────────────────────────────────
app.use("/api", routes);

// ── 404 fallback ───────────────────────────────────────────────────────────
// Any request that doesn't match a registered route lands here.
// Including method + path in the message makes debugging faster.
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// ── Global error handler ───────────────────────────────────────────────────
app.use(errorHandler);

export default app;