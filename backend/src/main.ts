import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import multer from "multer";
import { globalLimiter } from "./middleware/rateLimiter";

// Rotas
import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";
import transportersRoutes from "./routes/transporter";
import ordersRoutes from "./routes/orders";
import ratingsRoutes from "./routes/ratings";
import healthRoutes from "./routes/health";
import utilsRoutes from "./routes/utils";
import walletRoutes from "./routes/wallet";
import statsRoutes from "./routes/stats";

dotenv.config();

const app = express();

const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/freteexpress";
const PORT = process.env.PORT || 3000;

// Middlewares
app.set('trust proxy', 1); // Required for rate limiting behind proxies
app.use(globalLimiter);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset', 'Retry-After']
}));
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.resolve(__dirname, "..", "..", "uploads")));

// Rotas
app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/transporters", transportersRoutes);
app.use("/orders", ordersRoutes);
app.use("/ratings", ratingsRoutes);
app.use("/utils", utilsRoutes);
app.use("/wallet", walletRoutes);
app.use("/stats", statsRoutes);

// Global Error Handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);

    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: "upload_error", message: err.message });
    }

    const status = err?.statusCode ?? 500;
    const code = err?.code ?? "internal_error";
    const message = err?.message ?? "Ocorreu um erro inesperado.";

    res.status(status).json({ error: code, message });
  }
);

mongoose.set("strictQuery", false);

mongoose
  .connect(MONGO)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

export default app;