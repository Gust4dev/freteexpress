import { Router } from "express";
import {
  criarPedido,
  listarPedidos,
  aceitarPedido,
  atualizarStatusPedido,
  getPedidoPorId,
} from "../controllers/orders";
import authMiddleware from "../middleware/auth";

const router = Router();

// cliente cria pedido
router.post("/", authMiddleware(["client"]), criarPedido);

// listagens
router.get("/", authMiddleware(), listarPedidos);
router.get("/:id", authMiddleware(), getPedidoPorId);

// ações do transportador
router.post("/:id/accept", authMiddleware(["driver"]), aceitarPedido);
router.patch("/:id/status", authMiddleware(), atualizarStatusPedido);

export default router;
