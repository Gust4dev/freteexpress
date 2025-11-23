import { Router } from "express";
import {
  getMeuUsuario,
  atualizarMeuUsuario,
  uploadAvatar,
  listarUsuarios,
  getUsuarioPorId,
  deletarUsuario,
} from "../controllers/users";
import authMiddleware from "../middleware/auth";
import { uploadConfig } from "../config/upload";

const router = Router();

// Usuário logado
router.get("/me", authMiddleware(), getMeuUsuario);
router.patch("/me", authMiddleware(), atualizarMeuUsuario);
router.post("/avatar", authMiddleware(), uploadConfig.single("avatar"), uploadAvatar);

// Admin
router.get("/", authMiddleware(["admin"]), listarUsuarios);
router.get("/:id", authMiddleware(["admin"]), getUsuarioPorId);
router.delete("/:id", authMiddleware(["admin"]), deletarUsuario);

export default router;
