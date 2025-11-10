import express from "express";
import { postTarefa, getTarefas, deleteTarefa } from "../controllers/tarefaController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/", authMiddleware, postTarefa);
router.get("/", authMiddleware, getTarefas);
router.delete("/:id", authMiddleware, deleteTarefa);
export default router;
