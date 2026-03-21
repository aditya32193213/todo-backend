export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;

  // Log every server-side error in non-production environments so unexpected
  // failures are visible during development without polluting production logs.
  if (process.env.NODE_ENV !== "production") {
    console.error(`[${req.method}] ${req.originalUrl} → ${status}`, err.message);
    if (status >= 500) console.error(err.stack);
  }

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Expose stack trace only in development — never in production
    ...(process.env.NODE_ENV !== "production" && status >= 500 && { stack: err.stack }),
  });
};