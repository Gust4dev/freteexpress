import { Router } from "express";
import {
  criarOuAtualizarTransportador,
  listarTransportadores,
  getTransportadorPorId,
  validarTransportador,
} from "../controllers/transporter";
import authMiddleware from "../middleware/auth";

const router = Router();

router.post("/", authMiddleware(), criarOuAtualizarTransportador);
router.get(
  "/",
  authMiddleware(["admin", "client", "driver"]),
  listarTransportadores
);
router.get(
  "/:id",
  authMiddleware(["admin", "client", "driver"]),
  getTransportadorPorId
);

// rota para validar (apenas admin)
router.post("/:id/validar", authMiddleware(["admin"]), validarTransportador);

export default router;
