import {
  criarRegistro,
  listarRegistros,
  buscarRegistroPorId,
  deletarRegistro,
} from "../models/diarioModel.js";
export const getRegistros = (req, res) => {
  listarRegistros((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
export const getRegistroById = (req, res) => {
  const id = req.params.id;
  buscarRegistroPorId(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results || results.length === 0) return res.status(404).json({ message: "Registro não encontrado" });
    res.json(results[0]);
  });
};
export const postRegistro = (req, res) => {
  const novo = req.body;
  criarRegistro(novo, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Registro criado", registro_id: results.insertId });
  });
};
export const deleteRegistro = (req, res) => {
  const id = req.params.id;
  deletarRegistro(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Registro excluído" });
  });
};
