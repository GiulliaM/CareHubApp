// back-end/src/models/Paciente.ts
import { pool } from '../db'; // certifique-se de que ../db exporta um pool compatível (mysql2/promise)

// Tipo do payload recebido pela API
export type PacientePayload = {
  nome: string;
  data_nascimento?: string | null;
  informacoes_medicas?: string | null;
  foto_url?: string | null;
};

// Tipo usado pelo controller/dashboard
export interface IPacientePerfil {
  id: number;
  nome_paciente: string;
  data_nascimento?: string | null;
  informacoes_medicas?: string | null;
  foto_url?: string | null;
  nome_cuidador_ativo?: string | null;
}

export class Paciente {
  /**
   * Cria um novo paciente e associa ao usuário fornecido.
   */
  static async criar(dados: PacientePayload, usuarioId: number): Promise<{ id: number; nome: string } & PacientePayload> {
    const { nome, data_nascimento = null, informacoes_medicas = null, foto_url = null } = dados;

    // Usar execute/query dependendo da sua lib; aqui assumimos pool.execute/query compatível com mysql2/promise
    const [result]: any = await pool.query(
      'INSERT INTO pacientes (nome, data_nascimento, informacoes_medicas, foto_url) VALUES (?, ?, ?, ?)',
      [nome, data_nascimento, informacoes_medicas, foto_url]
    );

    const novoPacienteId: number = result?.insertId;

    // Associa o paciente ao usuário (relação padrão "Principal")
    await pool.query(
      'INSERT INTO paciente_usuarios (fk_paciente_id, fk_usuario_id, relacao) VALUES (?, ?, ?)',
      [novoPacienteId, usuarioId, 'Principal']
    );

    return { id: novoPacienteId, nome, data_nascimento, informacoes_medicas, foto_url };
  }

  /**
   * Verifica se um usuário possui vínculo com o paciente.
   */
  static async usuarioTemAcesso(usuarioId: number, pacienteId: number): Promise<boolean> {
    const [rows]: any = await pool.query(
      'SELECT 1 FROM paciente_usuarios WHERE fk_paciente_id = ? AND fk_usuario_id = ? LIMIT 1',
      [pacienteId, usuarioId]
    );
    return Array.isArray(rows) ? rows.length > 0 : Boolean(rows);
  }

  /**
   * Busca o perfil do paciente incluindo o nome do cuidador (quando disponível).
   * Retorna null se não encontrar.
   */
  static async buscarPerfilPorId(pacienteId: number): Promise<IPacientePerfil | null> {
    const [rows]: any = await pool.query(
      `SELECT 
         p.id,
         p.nome AS nome_paciente,
         p.data_nascimento,
         p.informacoes_medicas,
         p.foto_url,
         u.nome AS nome_cuidador_ativo
       FROM pacientes p
       LEFT JOIN paciente_usuarios pu ON pu.fk_paciente_id = p.id
       LEFT JOIN usuarios u ON u.id = pu.fk_usuario_id
       WHERE p.id = ?
       ORDER BY pu.id ASC
       LIMIT 1`,
      [pacienteId]
    );

    if (!rows || rows.length === 0) return null;

    const r = rows[0];
    const perfil: IPacientePerfil = {
      id: Number(r.id),
      nome_paciente: r.nome_paciente,
      data_nascimento: r.data_nascimento ?? null,
      informacoes_medicas: r.informacoes_medicas ?? null,
      foto_url: r.foto_url ?? null,
      nome_cuidador_ativo: r.nome_cuidador_ativo ?? null,
    };

    return perfil;
  }
}