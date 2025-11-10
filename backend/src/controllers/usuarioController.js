import { criarUsuario, buscarPorEmail, buscarPorId } from "../models/usuarioModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const cadastro = (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  if (!nome || !email || !senha || !tipo) return res.status(400).json({ message: "Dados inválidos" });
  buscarPorEmail(email, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(409).json({ message: "Email já cadastrado" });
    const hash = bcrypt.hashSync(senha, 10);
    criarUsuario({ nome, email, senha_hash: hash, tipo }, (err2, r) => {
      if (err2) return res.status(500).json({ error: err2.message });
      const token = jwt.sign({ usuario_id: r.insertId, nome, email, tipo }, process.env.JWT_SECRET);
      res.status(201).json({ usuario_id: r.insertId, token });
    });
  });
};
export const login = (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ message: "Dados inválidos" });
  buscarPorEmail(email, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results || results.length === 0) return res.status(401).json({ message: "Credenciais inválidas" });
    const user = results[0];
    const valid = bcrypt.compareSync(senha, user.senha_hash);
    if (!valid) return res.status(401).json({ message: "Credenciais inválidas" });
    const token = jwt.sign({ usuario_id: user.usuario_id, nome: user.nome, email: user.email, tipo: user.tipo }, process.env.JWT_SECRET);
    res.json({ usuario_id: user.usuario_id, token });
  });
};
export const perfil = (req, res) => {
  const id = req.params.id;
  buscarPorId(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results || results.length === 0) return res.status(404).json({ message: "Usuário não encontrado" });
    res.json(results[0]);
  });
};
