import { Router } from "express";
import authMiddleware from "../middleware/auth";
import { getBalance, getTransactions, addFunds } from "../controllers/wallet";

const router = Router();

router.use(authMiddleware());

router.get("/balance", getBalance);
router.get("/transactions", getTransactions);
router.post("/add", authMiddleware(["tester", "admin"]), addFunds);

export default router;
