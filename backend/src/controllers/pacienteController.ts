// back-end/src/controllers/pacienteController.ts
import { Response } from 'express';
import { Paciente } from '../models/Paciente';
// <<< MUDANÇA: Importar AuthRequest
import { AuthRequest } from '../authMiddleware';

/**
 * (C) CONTROLLER: Lida com a requisição de criar um paciente
 */
export const criarPaciente = async (req: AuthRequest, res: Response) => {
  try {
    const dadosPaciente = req.body;
    
    // Se uma foto foi enviada, o multer a coloca em req.file
    if (req.file) {
      // Criamos a URL pública para salvar no banco
      dadosPaciente.foto_url = `/uploads/${req.file.filename}`; 
    }

    // Pegamos o ID do usuário que o "Segurança" (authMiddleware) nos deu
    const usuarioId = req.usuario.id; 

    // O "Garçom" (Controller) entrega os dados para o "Chef" (Model)
    const novoPaciente = await Paciente.criar(dadosPaciente, usuarioId);

    res.status(201).json(novoPaciente);

  } catch (error: any) {
    console.error("Erro no controller ao criar paciente:", error);
    res.status(500).json({ message: 'Erro ao criar paciente', error: error.message });
  }
};


// ---
// <<< MUDANÇA: NOVAS FUNÇÕES PARA "PERFIL PESSOA CUIDADA"
// ---

/**
 * (C) CONTROLLER: Busca o primeiro paciente do usuário logado
 */
export const getMeuPrimeiroPaciente = async (req: AuthRequest, res: Response) => {
  try {
    const usuarioId = req.usuario.id;
    
    const paciente = await Paciente.buscarPrimeiroPacientePorUsuario(usuarioId);
    res.status(200).json(paciente);
    
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * (C) CONTROLLER: Atualiza os dados de um paciente
 */
export const updatePaciente = async (req: AuthRequest, res: Response) => {
  try {
    const { id: pacienteId } = req.params; // Pega o ID da URL (ex: /api/pacientes/3)
    const dadosPaciente = req.body;
    const usuarioId = req.usuario.id;

    // 1. Verificação de Segurança (Este paciente é seu?)
    const temAcesso = await Paciente.usuarioTemAcesso(usuarioId, Number(pacienteId));
    if (!temAcesso) {
      return res.status(403).json({ message: "Acesso negado a este paciente." });
    }

    // 2. Se uma nova foto foi enviada, adicione ao payload
    if (req.file) {
      dadosPaciente.foto_url = `/uploads/${req.file.filename}`;
    }

    // 3. Chame o Model para atualizar
    const pacienteAtualizado = await Paciente.atualizar(Number(pacienteId), dadosPaciente);
    res.status(200).json(pacienteAtualizado);

  } catch (error: any) {
    console.error("Erro ao atualizar paciente:", error);
    res.status(500).json({ message: "Erro ao atualizar paciente", error: error.message });
  }
};