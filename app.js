import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();


app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10kb" }));

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

app.set("trust proxy", 1); 
app.use(globalLimiter);
app.use("/api/auth", authLimiter);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Todo App!" });
});
app.use("/api", routes);
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});
app.use(errorHandler);

export default app;