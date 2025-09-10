import { Router } from "express";
import { criarUsuario, loginUsuario } from "../controllers/auth";
import authMiddleware from "../middleware/auth";

const router = Router();

router.post("/", criarUsuario);
router.post("/login", loginUsuario);

export default router;
