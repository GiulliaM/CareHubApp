import express from "express";
import { postPaciente, getPacientes, getPacienteById } from "../controllers/pacienteController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/", authMiddleware, postPaciente);
router.get("/", authMiddleware, getPacientes);
router.get("/:id", authMiddleware, getPacienteById);
export default router;
