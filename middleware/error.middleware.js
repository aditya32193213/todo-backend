export const errorHandler = (err, req, res, next) => {

  // ── Dev logging ────────────────────────────────────────────────────────────
  if (process.env.NODE_ENV !== "production") {
    console.error(`[${req.method}] ${req.originalUrl}`, err);
  }

  // ── Malformed JSON body ────────────────────────────────────────────────────
  // express.json() throws a SyntaxError with type "entity.parse.failed" when
  // the request body is invalid JSON (e.g. Content-Type: application/json with
  // body "{bad json"). This error has no statusCode and bypasses all other
  // named handlers below, falling through to the 500 fallback without this check.
  // Must be first in the chain — it is not a Mongoose or JWT error.
  // Example trigger: POST /api/tasks with body `{title: oops}` (no quotes).
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON in request body",
    });
  }

  // ── Mongoose: invalid ObjectId ─────────────────────────────────────────────
  // Thrown when a route param like /:id is not a valid MongoDB ObjectId format.
  // Example trigger: GET /api/tasks/not-an-id
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  // ── Mongoose: schema validation failure ────────────────────────────────────
  // Thrown when a document fails model-level validators (required, minlength, enum).
  // Collects all field errors into a single readable string.
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({
      success: false,
      message,
    });
  }

  // ── MongoDB: duplicate unique-index violation ──────────────────────────────
  // Code 11000 is thrown when inserting a document that violates a unique index.
  // Example trigger: POST /api/auth/register with an existing email.
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? "field";
    return res.status(409).json({
      success: false,
      message: `An account with that ${field} already exists`,
    });
  }

  // ── JWT: token has expired ─────────────────────────────────────────────────
  // Reachable only because auth.middleware.js forwards the original error
  // with next(error) — preserving err.name — instead of wrapping it.
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Session expired. Please sign in again.",
    });
  }

  // ── JWT: invalid token ─────────────────────────────────────────────────────
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token. Please sign in again.",
    });
  }

  // ── Application errors and fallback ───────────────────────────────────────
  const status  = err.statusCode || 500;
  const message = err.message    || "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && status >= 500 && { stack: err.stack }),
  });
};