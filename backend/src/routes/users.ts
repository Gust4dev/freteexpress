import { Router } from "express";
import {
  getMeuUsuario,
  atualizarMeuUsuario,
  listarUsuarios,
  getUsuarioPorId,
  deletarUsuario,
} from "../controllers/users";
import authMiddleware from "../middleware/auth";

const router = Router();

// usuário autenticado
router.get("/me", authMiddleware(), getMeuUsuario);
router.patch("/me", authMiddleware(), atualizarMeuUsuario);

// rotas administrativas / listagem
router.get("/", authMiddleware(["admin"]), listarUsuarios);
router.get("/:id", authMiddleware(["admin"]), getUsuarioPorId);
router.delete("/:id", authMiddleware(["admin"]), deletarUsuario);

export default router;
