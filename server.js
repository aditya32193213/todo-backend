import "dotenv/config";

import connectDB from "./config/db.js";
import app from "./app.js";

const REQUIRED_ENV_VARS = ["MONGO_URI", "JWT_SECRET", "JWT_EXPIRES_IN", "CLIENT_URL"];
const missingVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  console.error(
    `[Startup] Missing required env vars: ${missingVars.join(", ")}. Check your .env file.`
  );
  process.exit(1);
}

if (!/^\d+[smhd]$/.test(process.env.JWT_EXPIRES_IN)) {
  console.error(
    `[Startup] JWT_EXPIRES_IN="${process.env.JWT_EXPIRES_IN}" is invalid. Use a format like "1h", "7d", or "30m".`
  );
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();