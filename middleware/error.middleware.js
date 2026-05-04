export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;

  if (process.env.NODE_ENV !== "production") {
    // Full error object in dev — stack trace and all
    console.error(`[${req.method}] ${req.originalUrl}`, err);
  } else if (status >= 500) {
    // 4xx are expected client errors — no need to log those in production.
    // 5xx mean something broke on our side, so we always want a record of it.
    console.error(`[${req.method}] ${req.originalUrl} — ${status} ${err.message}`);
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON in request body" });
  }

  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((e) => e.message).join(", ");
    return res.status(400).json({ success: false, message });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? "field";
    return res.status(409).json({ success: false, message: `An account with that ${field} already exists` });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, message: "Session expired. Please sign in again." });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Invalid token. Please sign in again." });
  }

  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && status >= 500 && { stack: err.stack }),
  });
};