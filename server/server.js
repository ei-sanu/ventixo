import "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { clerkMiddleware } from "@clerk/express";
import { connectDB } from "./config/db.js";
import { env, validateEnv } from "./config/env.js";
import { apiLimiter } from "./middlewares/rateLimiter.middleware.js";
import { requestLogger } from "./middlewares/requestLogger.middleware.js";
import { sanitizeInput } from "./middlewares/sanitize.middleware.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import apiRoutes from "./routes/index.js";
import { ApiError } from "./utils/ApiError.js";
import { logger } from "./utils/logger.js";

validateEnv();

const app = express();

const corsOptions = {
  origin(origin, callback) {
    if (!origin || env.corsOrigins.includes("*") || env.corsOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new ApiError(403, "Origin not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(
  clerkMiddleware({
    authorizedParties: env.corsOrigins.includes("*") ? undefined : env.corsOrigins,
  }),
);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'", "*.clerk.accounts.dev", "clerk.ventixo.com"],
        "connect-src": ["'self'", "*.clerk.accounts.dev", "clerk.ventixo.com"],
        "img-src": ["'self'", "data:", "*.clerk.com", "img.clerk.com"],
      },
    },
  }),
);
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: "500kb" }));
app.use(express.urlencoded({ extended: true, limit: "500kb" }));
app.use(sanitizeInput);
app.use("/api", apiLimiter);
app.use(requestLogger);

app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  app.listen(env.port, () => {
    logger.info(`Ventixo API running on port ${env.port}`);
  });
};

startServer().catch((error) => {
  logger.error("Failed to start Ventixo API", {
    message: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

export default app;
