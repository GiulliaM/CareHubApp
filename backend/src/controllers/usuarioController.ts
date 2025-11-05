// back-end/src/controllers/usuarioController.ts
import { Request, Response } from 'express';
import { Usuario } from '../models/Usuario';

/**
 * (C) CONTROLLER: Lida com a requisição de criar usuário
 */
export const criarUsuario = async (req: Request, res: Response) => {
  try {
    // 1. O Garçom pega o pedido (req.body)
    const dadosUsuario = req.body;

    // 2. O Garçom entrega para o "Chef" (Model)
    const novoUsuario = await Usuario.criar(dadosUsuario);
    
    // 3. O Garçom devolve a resposta
    res.status(201).json(novoUsuario);

  } catch (error: any) {
    // Se o Chef (Model) disse "email duplicado", o Garçom informa
    if (error.message === 'Este e-mail já está em uso.') {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
  }
};

/**
 * (C) CONTROLLER: Lida com a requisição de login
 */
export const loginUsuario = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    // 1. O Garçom pede ao "Chef" (Model) para autenticar
    const { token, usuario } = await Usuario.login(email, senha);

    // 2. O Garçom devolve o token e os dados
    res.status(200).json({ token, usuario });

  } catch (error: any) {
    // Se o Chef (Model) disse "credenciais inválidas"
    res.status(401).json({ message: error.message });
  }
};