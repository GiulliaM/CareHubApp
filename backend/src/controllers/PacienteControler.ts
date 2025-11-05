// back-end/src/controllers/pacienteController.ts
import { Request, Response } from 'express';
import { Paciente } from '../models/Paciente';

export const criarPaciente = async (req: Request, res: Response) => {
  try {
    const dadosPaciente = req.body;
    
    // PENSANDO NO FUTURO:
    // O ideal é pegar o ID do token de segurança
    // Por agora, vamos "fingir" que é o usuário 1
    const usuarioId = 1; // (req.usuario.id;) 

    // O "Garçom" (Controller) entrega os dados para o "Chef" (Model)
    const novoPaciente = await Paciente.criar(dadosPaciente, usuarioId);

    res.status(201).json(novoPaciente);

  } catch (error: any) {
    console.error("Erro no controller ao criar paciente:", error);
    res.status(500).json({ message: 'Erro ao criar paciente', error: error.message });
  }
};