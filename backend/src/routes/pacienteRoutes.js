import express from "express";
import { postPaciente, getPacientes, getPacienteById, patchPaciente } from "../controllers/pacienteController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/", authMiddleware, postPaciente);
router.get("/", authMiddleware, getPacientes);
router.get("/:id", authMiddleware, getPacienteById);
router.patch("/:id", authMiddleware, patchPaciente);
export default router;
