// back-end/src/controllers/pacienteController.ts
import { Request, Response } from 'express';
import { Paciente } from '../models/Paciente';

export const criarPaciente = async (req: Request, res: Response) => {
  try {
    // 1. O Controller pega os dados de texto do req.body
    const dadosPaciente = req.body;
    
    // <<< MUDANÇA: Pegamos a foto do req.file
    // O 'req.file' só existe porque o multer (upload.single) o criou
    if (req.file) {
      // Cria a URL pública para salvar no banco
      // (O 'req.file.path' será algo como 'public/uploads/foto-12345.jpg')
      dadosPaciente.foto_url = `/${req.file.path}`; 
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