import express from "express";
import {
  getMedicamentos,
  getMedicamentoById,
  postMedicamento,
  putMedicamento,
  deleteMedicamento,
} from "../controllers/medicamentoController.js";
const router = express.Router();
router.get("/", getMedicamentos);
router.get("/:id", getMedicamentoById);
router.post("/", postMedicamento);
router.put("/:id", putMedicamento);
router.delete("/:id", deleteMedicamento);
export default router;
