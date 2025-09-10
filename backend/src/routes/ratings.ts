import { Router } from "express";
import {
  criarAvaliacao,
  listarAvaliacoesPorPedido,
} from "../controllers/ratings";
import authMiddleware from "../middleware/auth";

const router = Router();

router.post("/", authMiddleware(["client"]), criarAvaliacao);
router.get("/order/:orderId", authMiddleware(), listarAvaliacoesPorPedido);

export default router;
