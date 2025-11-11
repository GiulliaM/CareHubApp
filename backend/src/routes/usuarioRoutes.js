import express from "express";
import { cadastro, login, perfil, patchUsuario } from "../controllers/usuarioController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/cadastro", cadastro);
router.post("/login", login);
router.get("/perfil/:id", authMiddleware, perfil);
router.patch("/:id", authMiddleware, patchUsuario);
export default router;
