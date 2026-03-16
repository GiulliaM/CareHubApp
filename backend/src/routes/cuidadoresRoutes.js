import express from "express";
import middlewareAutenticacao from "../middleware/middlewareAutenticacao.js";
import { buscarCuidadoresRota } from "../controllers/cuidadorController.js";

const router = express.Router();

router.get("/busca", middlewareAutenticacao, buscarCuidadoresRota);

export default router;
