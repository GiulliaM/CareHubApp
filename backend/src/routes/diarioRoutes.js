import express from "express";
import { postRegistro, getRegistros, deleteRegistro } from "../controllers/diarioController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/", authMiddleware, postRegistro);
router.get("/", authMiddleware, getRegistros);
router.delete("/:id", authMiddleware, deleteRegistro);
export default router;
