import express from "express";
import {
  buscarMedicamentos,
  buscarMedicamentoPorId,
  criarMedicamentoRota,
  atualizarMedicamentoRota,
  alternarMedicamentoConcluido,
  excluirMedicamento,
} from "../controllers/medicamentoController.js";
import middlewareAutenticacao from "../middleware/middlewareAutenticacao.js";

const router = express.Router();

router.get("/:paciente_id", middlewareAutenticacao, buscarMedicamentos);
router.get("/detalhe/:id", middlewareAutenticacao, buscarMedicamentoPorId);
router.post("/", middlewareAutenticacao, criarMedicamentoRota);
router.patch("/:id", middlewareAutenticacao, atualizarMedicamentoRota);
router.patch("/:id/toggle", middlewareAutenticacao, alternarMedicamentoConcluido);
router.delete("/:id", middlewareAutenticacao, excluirMedicamento);

export default router;
