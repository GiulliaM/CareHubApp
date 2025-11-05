// back-end/src/models/Paciente.ts
import { pool } from '../db'; // Vamos criar este arquivo (db.ts) a seguir

// O tipo de dado que vem da API
export type PacientePayload = {
  nome: string;
  data_nascimento?: string;
  informacoes_medicas?: string; // (para alergias)
  foto_url?: string;
};

export class Paciente {
  
  /**
   * (M) MODEL: Cria um novo paciente no banco
   */
  static async criar(dados: PacientePayload, usuarioId: number): Promise<any> {
    const { nome, data_nascimento, informacoes_medicas, foto_url } = dados;

    // 1. Salva o paciente
    const [result] = await pool.query(
      'INSERT INTO pacientes (nome, data_nascimento, informacoes_medicas, foto_url) VALUES (?, ?, ?, ?)',
      [nome, data_nascimento, informacoes_medicas, foto_url]
    );
    
    // @ts-ignore
    const novoPacienteId = result.insertId;

    // 2. Linka o paciente ao usuário
    await pool.query(
      'INSERT INTO paciente_usuarios (fk_paciente_id, fk_usuario_id, relacao) VALUES (?, ?, ?)',
      [novoPacienteId, usuarioId, 'Principal'] // Relação padrão
    );

    return { id: novoPacienteId, ...dados };
  }
}