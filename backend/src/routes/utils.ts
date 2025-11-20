import { Router } from "express";
import { calculateDistance, reverseGeocode, getRoute } from "../controllers/utils";
import authMiddleware from "../middleware/auth";

const router = Router();

router.post("/calculate-distance", calculateDistance);
router.post("/route", getRoute);
router.get("/reverse-geocode", reverseGeocode);

export default router;
