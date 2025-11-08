// back-end/src/controllers/medicamentoController.ts
import { Request, Response } from 'express';
// @ts-ignore
import { Medicamento } from '../models/Medicamento';
// @ts-ignore
import { Paciente } from '../models/Paciente';

/**
 * (C) CONTROLLER: Cria um novo registro de medicamento.
 * POST /api/medicamentos
 */
export const criarMedicamento = async (req: Request, res: Response) => {
  const { pacienteId, nome_medicamento, dosagem, frequencia, instrucoes, data_inicio, data_termino } = req.body;
  const usuarioId = (req as any).usuario?.id; // ID do usuário logado (registrado por)

  if (!pacienteId || !nome_medicamento || !usuarioId) {
    return res.status(400).json({ message: "Dados essenciais (pacienteId, nome_medicamento) e usuário logado são obrigatórios." });
  }

  try {
    // 1. (SEGURANÇA) Verificar se o usuário tem acesso a este paciente
    const temAcesso = await Paciente.usuarioTemAcesso(usuarioId, pacienteId);
    if (!temAcesso) {
      return res.status(403).json({ message: "Acesso negado. O usuário não está associado a este paciente." });
    }

    // 2. Criar o medicamento no modelo
    // ⚠️ Você precisa implementar Medicamento.criar(dados) no seu modelo Medicamento.ts
    const novoMedicamento = await Medicamento.criar({
      fk_paciente_id: pacienteId,
      fk_registrado_por_id: usuarioId,
      nome_medicamento,
      dosagem,
      frequencia,
      instrucoes,
      data_inicio,
      data_termino,
    });

    res.status(201).json({ 
      message: 'Medicamento registrado com sucesso.', 
      medicamento: novoMedicamento 
    });

  } catch (error: any) {
    console.error("Erro ao criar medicamento:", error);
    res.status(500).json({ message: 'Erro interno ao registrar medicamento.', error: error?.message });
  }
};

/**
 * (C) CONTROLLER: Busca todos os medicamentos de um paciente.
 * GET /api/medicamentos/:pacienteId
 */
export const buscarMedicamentosPorPaciente = async (req: Request, res: Response) => {
  const { pacienteId } = req.params;
  const idNum = parseInt(pacienteId, 10);
  const usuarioId = (req as any).usuario?.id;

  if (isNaN(idNum) || !usuarioId) {
    return res.status(400).json({ message: "ID do paciente inválido ou usuário não autenticado." });
  }

  try {
    // 1. (SEGURANÇA) Verificar se o usuário tem acesso
    const temAcesso = await Paciente.usuarioTemAcesso(usuarioId, idNum);
    if (!temAcesso) {
      return res.status(403).json({ message: "Acesso negado." });
    }

    // 2. Buscar medicamentos
    // ⚠️ Você precisa implementar Medicamento.buscarTodosPorPaciente(idNum) no seu modelo Medicamento.ts
    const medicamentos = await Medicamento.buscarTodosPorPaciente(idNum);

    res.status(200).json(medicamentos);

  } catch (error: any) {
    console.error("Erro ao buscar medicamentos:", error);
    res.status(500).json({ message: 'Erro interno ao buscar medicamentos.', error: error?.message });
  }
};