import express from "express";
import { postMedicamento, getMedicamentos, deleteMedicamento, patchMedicamento } from "../controllers/medicamentoController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/", authMiddleware, postMedicamento);
router.get("/", authMiddleware, getMedicamentos);
router.patch("/:id", authMiddleware, patchMedicamento);
router.delete("/:id", authMiddleware, deleteMedicamento);
export default router;
