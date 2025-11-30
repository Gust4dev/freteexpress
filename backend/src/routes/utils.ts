import { Router } from "express";
import { calculateDistance, reverseGeocode, getRoute } from "../controllers/utils";
import authMiddleware from "../middleware/auth";
import { apiLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/calculate-distance", authMiddleware, apiLimiter, calculateDistance);
router.post("/route", authMiddleware, apiLimiter, getRoute);
router.get("/reverse-geocode", apiLimiter, reverseGeocode); // Reverse geocode can remain public or protected depending on usage

export default router;
