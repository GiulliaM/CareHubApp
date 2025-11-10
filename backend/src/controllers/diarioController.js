import { criarRegistro, listarRegistrosPorUsuario, deletarRegistro } from "../models/diarioModel.js";
export const postRegistro = (req, res) => {
  const r = req.body;
  r.usuario_id = req.user.usuario_id;
  criarRegistro(r, (err, rres) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ registro_id: rres.insertId });
  });
};
export const getRegistros = (req, res) => {
  listarRegistrosPorUsuario(req.user.usuario_id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
export const deleteRegistro = (req, res) => {
  const id = req.params.id;
  deletarRegistro(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Registro excluído" });
  });
};
