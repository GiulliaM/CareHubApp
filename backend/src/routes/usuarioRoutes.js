import express from "express";
import { cadastro, login, perfil } from "../controllers/usuarioController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/cadastro", cadastro);
router.post("/login", login);
router.get("/perfil/:id", authMiddleware, perfil);
export default router;
