import express from "express";
import {
  getMedicamentos,
  createMedicamento,
  patchMedicamento,
  deleteMedicamento,
} from "../controllers/medicamentoController.js";

const router = express.Router();

// 🔹 Listar medicamentos de um paciente
router.get("/:paciente_id", getMedicamentos);

// 🔹 Criar novo medicamento
router.post("/", createMedicamento);

// 🔹 Atualizar medicamento existente (PATCH)
router.patch("/:id", patchMedicamento);

// 🔹 Excluir medicamento
router.delete("/:id", deleteMedicamento);

export default router;
