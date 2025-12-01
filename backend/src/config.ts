import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const envSchema = z.object({
  PORT: z.string().default("3000"),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  process.exit(1);
}

export const config = _env.data;
