import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

// routes
import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";
import transportersRoutes from "./routes/transporter";
import ordersRoutes from "./routes/orders";
import ratingsRoutes from "./routes/ratings";
import healthRoutes from "./routes/health";
import utilsRoutes from "./routes/utils";

dotenv.config();

const app = express();

// security & parsing
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/transporters", transportersRoutes);
app.use("/orders", ordersRoutes);
app.use("/ratings", ratingsRoutes);
app.use("/utils", utilsRoutes);

// simple centralized error handler (fallback)
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    const status = err?.statusCode ?? 500;
    const message = err?.message ?? "internal_server_error";
    res.status(status).json({ error: message });
  }
);

// DB + server start
const MONGO = process.env.MONGO_URI ?? "mongodb://localhost:27017/frete";
const PORT = Number(process.env.PORT ?? 3000);

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