import { Router } from "express";
import { getDriverStats } from "../controllers/stats";
import { isAuthenticated } from "../middleware/auth";

const router = Router();

router.get("/driver", isAuthenticated, getDriverStats);

export default router;
