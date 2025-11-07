// back-end/src/controllers/pacienteController.ts
import { Request, Response } from 'express';
import { Paciente } from '../models/Paciente';

export const criarPaciente = async (req: Request, res: Response) => {
  try {
    // 1. O Controller pega os dados de texto do req.body
    const dadosPaciente = req.body;
    
    // <<< MUDANÇA: Pegamos a foto do req.file
    if (req.file) {
      // O 'req.file.filename' será algo como 'foto-12345.jpg'
      // Nós o salvamos com a URL pública
      dadosPaciente.foto_url = `/uploads/${req.file.filename}`; 
    }
    // --- FIM DA MUDANÇA ---

    // (Vamos "fingir" o ID do usuário por enquanto)
    const usuarioId = 1; 

    // 2. O Controller entrega os dados (incluindo a foto_url) para o Model
    const novoPaciente = await Paciente.criar(dadosPaciente, usuarioId);

    // 3. Envia a resposta
    res.status(201).json(novoPaciente);

  } catch (error: any) {
    console.error("Erro no controller ao criar paciente:", error);
    res.status(500).json({ message: 'Erro ao criar paciente', error: error.message });
  }
};