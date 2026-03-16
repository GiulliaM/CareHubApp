import express from "express";
import middlewareAutenticacao from "../middleware/middlewareAutenticacao.js";
import {
  gerarConvite,
  buscarConvite,
  aceitarConvite,
  buscarMeusPacientes,
} from "../controllers/vinculoController.js";

const router = express.Router();

router.post("/gerar-convite", middlewareAutenticacao, gerarConvite);
router.get("/convite/:paciente_id", middlewareAutenticacao, buscarConvite);
router.post("/aceitar", middlewareAutenticacao, aceitarConvite);
router.get("/meus-pacientes", middlewareAutenticacao, buscarMeusPacientes);

export default router;
