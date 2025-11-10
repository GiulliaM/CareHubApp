import express from "express";
import {
  getTarefas,
  getTarefaById,
  postTarefa,
  putTarefa,
  deleteTarefa,
} from "../controllers/tarefaController.js";
const router = express.Router();
router.get("/", getTarefas);
router.get("/:id", getTarefaById);
router.post("/", postTarefa);
router.put("/:id", putTarefa);
router.delete("/:id", deleteTarefa);
export default router;
