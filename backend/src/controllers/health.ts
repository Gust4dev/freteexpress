import { Request, Response } from "express";
import mongoose from "mongoose";
import { logger } from "../logger";

export async function checkHealth(_req: Request, res: Response) {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatusMap: Record<number, string> = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    const status = dbStatusMap[dbState] || "unknown";

    if (dbState !== 1) {
      logger.error(`Health check failed: DB status is ${status}`);
      return res.status(503).json({
        status: "error",
        message: "Database not connected",
        db_status: status,
      });
    }

    return res.status(200).json({
      status: "ok",
      message: "System operational",
      db_status: status,
    });
  } catch (err) {
    logger.error("Health check error", err);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
}
