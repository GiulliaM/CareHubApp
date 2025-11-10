import express from "express";
import {
  getRegistros,
  getRegistroById,
  postRegistro,
  deleteRegistro,
} from "../controllers/diarioController.js";
const router = express.Router();
router.get("/", getRegistros);
router.get("/:id", getRegistroById);
router.post("/", postRegistro);
router.delete("/:id", deleteRegistro);
export default router;
