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

// Cliente cria (qualquer usuário autenticado)
router.post("/", authMiddleware(), criarPedido);

// Listar
router.get("/", authMiddleware(), listarPedidos);
router.get("/:id", authMiddleware(), getPedidoPorId);

// Motorista (qualquer usuário autenticado para testes)
router.post("/:id/accept", authMiddleware(), aceitarPedido);
router.patch("/:id/status", authMiddleware(), atualizarStatusPedido);

export default router;
