import express from "express";
import { postTarefa, getTarefas, deleteTarefa, patchTarefa } from "../controllers/tarefaController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/", authMiddleware, postTarefa);
router.get("/", authMiddleware, getTarefas);
router.patch("/:id", authMiddleware, patchTarefa);
router.delete("/:id", authMiddleware, deleteTarefa);
export default router;
