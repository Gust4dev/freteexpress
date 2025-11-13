import { Router } from "express";
import { calculateDistance, searchCities } from "../controllers/utils";
import authMiddleware from "../middleware/auth";

const router = Router();

router.post("/calculate-distance", authMiddleware(), calculateDistance);
router.get("/search-cities", authMiddleware(), searchCities);

export default router;