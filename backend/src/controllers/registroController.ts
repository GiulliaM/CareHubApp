// back-end/src/controllers/registroController.ts
import { Request, Response } from 'express';
// @ts-ignore
import { Registro } from '../models/Registro';
// @ts-ignore
import { Paciente } from '../models/Paciente';

/**
 * (C) CONTROLLER: Cria um novo registro no diário (Humor, Refeição, etc.).
 * POST /api/registros
 */
export const criarRegistro = async (req: Request, res: Response) => {
  const { pacienteId, tipo_registro, comentario } = req.body;
  const usuarioId = (req as any).usuario?.id;

  if (!pacienteId || !tipo_registro || !comentario || !usuarioId) {
    return res.status(400).json({ message: "Dados essenciais (pacienteId, tipo, comentário) e usuário logado são obrigatórios." });
  }

  try {
    // 1. (SEGURANÇA) Verificar se o usuário tem acesso a este paciente
    const temAcesso = await Paciente.usuarioTemAcesso(usuarioId, pacienteId);
    if (!temAcesso) {
      return res.status(403).json({ message: "Acesso negado." });
    }

    // 2. Criar o registro
    const novoRegistro = await Registro.criar({
      fk_paciente_id: pacienteId,
      fk_registrado_por_id: usuarioId,
      tipo_registro,
      comentario,
    });

    res.status(201).json({ 
      message: 'Registro criado com sucesso.', 
      registro: novoRegistro 
    });

  } catch (error: any) {
    console.error("Erro ao criar registro:", error);
    res.status(500).json({ message: 'Erro interno ao registrar.', error: error?.message });
  }
};