import express from "express";
import { createTarefa, getTarefas, deleteTarefa, updateTarefa } from "../controllers/tarefaController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/", authMiddleware, createTarefa);
router.get("/", authMiddleware, getTarefas);
router.patch("/:id", authMiddleware, updateTarefa);
router.delete("/:id", authMiddleware, deleteTarefa);
export default router;
