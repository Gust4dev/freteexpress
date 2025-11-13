import { Router } from "express";
import { calculateDistance } from "../controllers/utils";
import authMiddleware from "../middleware/auth";

const router = Router();

router.post("/calculate-distance", authMiddleware(), calculateDistance);

export default router;