import express from "express";
import { cadastro, login, perfil, patchUsuario } from "../controllers/usuarioController.js";
import middlewareAutenticacao from "../middleware/middlewareAutenticacao.js";
const router = express.Router();
router.post("/cadastro", cadastro);
router.post("/login", login);
router.get("/perfil/:id", middlewareAutenticacao, perfil);
router.patch("/:id", middlewareAutenticacao, patchUsuario);
export default router;
