import express from "express";
import { criarRegistro, buscarRegistros, excluirRegistro } from "../controllers/diarioController.js";
import middlewareAutenticacao from "../middleware/middlewareAutenticacao.js";
const router = express.Router();
router.post("/", middlewareAutenticacao, criarRegistro);
router.get("/", middlewareAutenticacao, buscarRegistros);
router.delete("/:id", middlewareAutenticacao, excluirRegistro);
export default router;
