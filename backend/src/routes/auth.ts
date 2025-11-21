import { Router } from "express";
import { criarUsuario, loginUsuario, logoutUsuario } from "../controllers/auth";


const router = Router();

router.post("/", criarUsuario);
router.post("/login", loginUsuario);
router.post("/logout", logoutUsuario);

export default router;
