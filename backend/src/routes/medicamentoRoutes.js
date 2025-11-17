import express from "express";
import {
  getMedicamentos,
  createMedicamento,
  patchMedicamento,
  deleteMedicamento,
} from "../controllers/medicamentoController.js";

const router = express.Router();

router.get("/:paciente_id", getMedicamentos);

router.post("/", createMedicamento);

router.patch("/:id", patchMedicamento);

router.delete("/:id", deleteMedicamento);

export default router;
