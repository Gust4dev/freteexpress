import { Router } from "express";
import { criarUsuario, loginUsuario, logoutUsuario } from "../controllers/auth";
import { authLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/", authLimiter, criarUsuario);
router.post("/login", authLimiter, loginUsuario);
router.post("/logout", logoutUsuario);

export default router;
