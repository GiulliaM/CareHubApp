import { criarUsuario, buscarPorEmail, buscarPorId, atualizarUsuario } from "../models/usuarioModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const cadastro = (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  if (!nome || !email || !senha || !tipo) {
    return res.status(400).json({ message: "Dados inválidos: nome, email, senha e tipo são obrigatórios" });
  }

  const tiposValidos = ["familiar", "cuidador"];
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({ message: `Tipo inválido. Use: ${tiposValidos.join(", ")}` });
  }

  if (!process.env.JWT_SECRET) {
    console.error("[ERRO CRÍTICO] JWT_SECRET não está definido no .env");
    return res.status(500).json({ message: "Erro de configuração do servidor. Contate o administrador." });
  }

  buscarPorEmail(email, (err, results) => {
    if (err) {
      console.error("[cadastro] Erro ao buscar email:", err.message);
      return res.status(500).json({ message: "Erro ao verificar o e-mail. Tente novamente." });
    }
    if (results.length > 0) {
      return res.status(409).json({ message: "Este e-mail já está cadastrado." });
    }

    let hash;
    try {
      hash = bcrypt.hashSync(senha, 10);
    } catch (hashErr) {
      console.error("[cadastro] Erro ao hashear senha:", hashErr.message);
      return res.status(500).json({ message: "Erro interno ao processar senha." });
    }

    criarUsuario({ nome, email, senha_hash: hash, tipo }, (err2, result) => {
      if (err2) {
        console.error("[cadastro] Erro ao criar usuário no banco:", err2.message);
        return res.status(500).json({ message: "Erro ao criar usuário no banco de dados.", detail: err2.message });
      }

      try {
        const payload = { usuario_id: result.insertId, nome, email, tipo };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({
          usuario: { usuario_id: result.insertId, nome, email, tipo },
          token,
        });
      } catch (jwtErr) {
        console.error("[cadastro] Erro ao gerar token JWT:", jwtErr.message);
        return res.status(500).json({ message: "Usuário criado, mas erro ao gerar token. Faça login." });
      }
    });
  });
};

export const login = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
  }

  if (!process.env.JWT_SECRET) {
    console.error("[ERRO CRÍTICO] JWT_SECRET não está definido no .env");
    return res.status(500).json({ message: "Erro de configuração do servidor." });
  }

  buscarPorEmail(email, (err, results) => {
    if (err) {
      console.error("[login] Erro ao buscar usuário:", err.message);
      return res.status(500).json({ message: "Erro ao realizar login. Tente novamente." });
    }
    if (!results || results.length === 0) {
      return res.status(401).json({ message: "E-mail ou senha incorretos." });
    }

    const user = results[0];

    let valid = false;
    try {
      valid = bcrypt.compareSync(senha, user.senha_hash);
    } catch (bcryptErr) {
      console.error("[login] Erro ao comparar senha:", bcryptErr.message);
      return res.status(500).json({ message: "Erro interno ao verificar senha." });
    }

    if (!valid) return res.status(401).json({ message: "E-mail ou senha incorretos." });

    try {
      const usuarioCompleto = {
        usuario_id: user.usuario_id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
      };
      const token = jwt.sign(usuarioCompleto, process.env.JWT_SECRET, { expiresIn: "7d" });
      res.json({ usuario: usuarioCompleto, token });
    } catch (jwtErr) {
      console.error("[login] Erro ao gerar token:", jwtErr.message);
      return res.status(500).json({ message: "Erro ao gerar token de acesso." });
    }
  });
};

export const perfil = (req, res) => {
  const id = req.params.id;
  const usuarioId = req.user?.usuario_id;
  if (Number(id) !== Number(usuarioId)) {
    return res.status(403).json({ message: "Acesso negado ao perfil de outro usuário" });
  }

  buscarPorId(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results || results.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.json(results[0]);
  });
};

export const patchUsuario = (req, res) => {
  const id = req.params.id;
  const usuarioId = req.user?.usuario_id;
  if (Number(id) !== Number(usuarioId)) {
    return res.status(403).json({ message: "Não é possível editar outro usuário" });
  }
  const changes = req.body;

  atualizarUsuario(id, changes, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Usuário atualizado" });
  });
};
