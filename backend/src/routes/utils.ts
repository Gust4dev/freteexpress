import { Router } from "express";
import { calculateDistance, reverseGeocode, getRoute } from "../controllers/utils";
import authMiddleware from "../middleware/auth";
import { apiLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/calculate-distance", apiLimiter, calculateDistance);
router.post("/route", apiLimiter, getRoute);
router.get("/reverse-geocode", apiLimiter, reverseGeocode);

export default router;
