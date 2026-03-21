import dotenv from "dotenv";
dotenv.config();

// ── Env validation ──────────────────────────────────────────────────────────
// Fail fast with a clear message before attempting any DB or server setup
const REQUIRED_ENV_VARS = ["MONGO_URI", "JWT_SECRET", "JWT_EXPIRES_IN"];

const missingVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  console.error(
    `[Startup Error] Missing required environment variables: ${missingVars.join(", ")}\n` +
    `Please check your .env file and try again.`
  );
  process.exit(1);
}

// Validate JWT_EXPIRES_IN format — accepted units: s, m, h, d (e.g. 1h, 30m, 7d)
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
const validJwtFormat = /^\d+[smhd]$/.test(jwtExpiresIn);
if (!validJwtFormat) {
  console.error(
    `[Startup Error] JWT_EXPIRES_IN="${jwtExpiresIn}" is not a valid format.\n` +
    `Use a number followed by s, m, h, or d — e.g. "1h", "30m", "7d".`
  );
  process.exit(1);
}
// ────────────────────────────────────────────────────────────────────────────

import connectDB from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

startServer();