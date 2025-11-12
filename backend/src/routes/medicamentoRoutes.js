const express = require("express");
const router = express.Router();
const medicamentoController = require("../controllers/medicamentoController");

// Listar medicamentos por paciente
router.get("/", medicamentoController.getMedicamentos);

// Criar novo medicamento
router.post("/", medicamentoController.createMedicamento);

// Atualizar medicamento existente (PATCH)
router.patch("/:id", medicamentoController.patchMedicamento);

// Excluir medicamento
router.delete("/:id", medicamentoController.deleteMedicamento);

module.exports = router;
