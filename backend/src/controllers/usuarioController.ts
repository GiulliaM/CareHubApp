// back-end/src/controllers/usuarioController.ts
import { Response } from 'express';
import { Usuario } from '../models/Usuario';
// <<< MUDANÇA: Importar nossa Request customizada do Middleware
import { AuthRequest } from '../authMiddleware'; 

/**
 * (C) CONTROLLER: Lida com a requisição de criar usuário
 */
export const criarUsuario = async (req: AuthRequest, res: Response) => {
  try {
    const dadosUsuario = req.body;
    const novoUsuario = await Usuario.criar(dadosUsuario);
    res.status(201).json(novoUsuario);

  } catch (error: any) {
    if (error.message === 'Este e-mail já está em uso.') {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
  }
};

/**
 * (C) CONTROLLER: Lida com a requisição de login
 */
export const loginUsuario = async (req: AuthRequest, res: Response) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }
    const { token, usuario } = await Usuario.login(email, senha);
    res.status(200).json({ token, usuario });

  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

// ---
// <<< MUDANÇA: NOVAS FUNÇÕES PARA "MEU PERFIL"
// ---

/**
 * (C) CONTROLLER: Lida com a requisição de buscar o perfil
 */
export const getMeuPerfil = async (req: AuthRequest, res: Response) => {
  try {
    // O 'req.usuario' foi adicionado pelo "Segurança" (authMiddleware)
    const usuarioId = req.usuario.id;
    
    // Chama o "Chef" (Model) para buscar os dados
    const perfil = await Usuario.buscarPorId(usuarioId);
    res.status(200).json(perfil);

  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * (C) CONTROLLER: Lida com a requisição de atualizar o perfil
 */
export const updateMeuPerfil = async (req: AuthRequest, res: Response) => {
  try {
    const usuarioId = req.usuario.id;
    const { nome, telefone } = req.body;

    if (!nome) {
      return res.status(400).json({ message: 'O nome é obrigatório.' });
    }

    // Chama o "Chef" (Model) para atualizar
    const perfilAtualizado = await Usuario.atualizar(usuarioId, { nome, telefone });
    res.status(200).json(perfilAtualizado);

  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao atualizar perfil', error: error.message });
  }
};