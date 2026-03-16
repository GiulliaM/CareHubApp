import express from "express";
import middlewareAutenticacao from "../middleware/middlewareAutenticacao.js";
import {
  getMeusPacientes,
  getMembros,
  postVincular,
  deleteDesvincular,
} from "../controllers/grupoCuidadoController.js";

const router = express.Router();

router.get("/meus-pacientes", middlewareAutenticacao, getMeusPacientes);
router.get("/membros/:paciente_id", middlewareAutenticacao, getMembros);
router.post("/vincular", middlewareAutenticacao, postVincular);
router.delete("/desvincular", middlewareAutenticacao, deleteDesvincular);

export default router;
