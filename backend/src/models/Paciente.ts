// back-end/src/models/Paciente.ts
import { pool } from '../db'; 
import { IPacientePerfil } from './interfaces'; // Vamos criar esta interface

// Payload para criar/atualizar
export type PacientePayload = {
  nome: string;
  data_nascimento?: string; 
  informacoes_medicas?: string;
  foto_url?: string; 
};

// Helper para converter data 'DD/MM/AAAA' para 'AAAA-MM-DD' (SQL)
const formatarDataParaSQL = (data: string | undefined): string | null => {
  if (!data || data.trim() === '') { return null; }
  const partes = data.split('/');
  if (partes.length === 3 && partes[2] && partes[1] && partes[0]) {
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
  return null; 
};

// Helper para converter data 'AAAA-MM-DD' (SQL) para 'DD/MM/AAAA' (App)
const formatarDataParaApp = (data: string | undefined): string => {
  if (!data || data.startsWith('0000-00-00')) { return ''; }
  const partes = data.split('-');
  if (partes.length === 3) { return `${partes[2]}/${partes[1]}/${partes[0]}`; }
  return '';
};

export class Paciente {
  
  // <<< FUNÇÃO QUE FALTAVA (para pacienteController.ts)
  static async criar(dados: PacientePayload, usuarioId: number): Promise<any> {
    const { nome, informacoes_medicas, foto_url } = dados;
    const dataSQL = formatarDataParaSQL(dados.data_nascimento);
    
    const [result] = await pool.query(
      'INSERT INTO pacientes (nome, data_nascimento, informacoes_medicas, foto_url) VALUES (?, ?, ?, ?)',
      [nome, dataSQL, informacoes_medicas, foto_url]
    );
    // @ts-ignore
    const novoPacienteId = result.insertId;
    await pool.query(
      'INSERT INTO paciente_usuarios (fk_paciente_id, fk_usuario_id, relacao) VALUES (?, ?, ?)',
      [novoPacienteId, usuarioId, 'Principal']
    );
    return { id: novoPacienteId, ...dados };
  }
  
  // (Função do seu arquivo original)
  static async usuarioTemAcesso(usuarioId: number, pacienteId: number): Promise<boolean> {
    try {
      const [rows] = await pool.query(
        'SELECT 1 FROM paciente_usuarios WHERE fk_usuario_id = ? AND fk_paciente_id = ? LIMIT 1',
        [usuarioId, pacienteId]
      );
      // @ts-ignore
      return rows.length > 0;
    } catch (error) {
      console.error("Erro em usuarioTemAcesso:", error);
      return false;
    }
  }

  // (Função do seu arquivo original, mas corrigida)
  static async buscarPerfilPorId(pacienteId: number): Promise<IPacientePerfil | null> {
    try {
      const [rows] = await pool.query(
        `SELECT
          p.id, p.nome AS nome_paciente, p.data_nascimento,
          p.informacoes_medicas, p.foto_url, u.nome AS nome_cuidador_ativo
        FROM pacientes p
        LEFT JOIN paciente_usuarios pu ON pu.fk_paciente_id = p.id AND pu.relacao = 'Principal'
        LEFT JOIN usuarios u ON u.id = pu.fk_usuario_id
        WHERE p.id = ?;`,
        [pacienteId]
      );
      // @ts-ignore
      if (rows.length === 0) { return null; }
      // @ts-ignore
      const paciente = rows[0];
      // Formata a data para o app
      paciente.data_nascimento = formatarDataParaApp(paciente.data_nascimento);
      return paciente as IPacientePerfil;
    } catch (error) {
      console.error("Erro ao buscar perfil do paciente:", error);
      return null;
    }
  }
  
  // <<< FUNÇÃO QUE FALTAVA (para pacienteController.ts)
  static async buscarPrimeiroPacientePorUsuario(usuarioId: number): Promise<any> {
    const [rows] = await pool.query(
      'SELECT * FROM pacientes p JOIN paciente_usuarios pu ON p.id = pu.fk_paciente_id WHERE pu.fk_usuario_id = ? LIMIT 1',
      [usuarioId]
    );
    // @ts-ignore
    if (rows.length === 0) {
      throw new Error('Nenhum paciente encontrado para este usuário.');
    }
    // @ts-ignore
    const paciente = rows[0];
    paciente.data_nascimento = formatarDataParaApp(paciente.data_nascimento);
    return paciente;
  }
  
  // <<< FUNÇÃO QUE FALTAVA (para pacienteController.ts)
  static async atualizar(pacienteId: number, dados: PacientePayload): Promise<any> {
    const { nome, informacoes_medicas, foto_url } = dados;
    const dataSQL = formatarDataParaSQL(dados.data_nascimento);

    if (foto_url) {
      await pool.query(
        'UPDATE pacientes SET nome = ?, data_nascimento = ?, informacoes_medicas = ?, foto_url = ? WHERE id = ?',
        [nome, dataSQL, informacoes_medicas, foto_url, pacienteId]
      );
    } else {
      await pool.query(
        'UPDATE pacientes SET nome = ?, data_nascimento = ?, informacoes_medicas = ? WHERE id = ?',
        [nome, dataSQL, informacoes_medicas, pacienteId]
      );
    }
    return { id: pacienteId, ...dados, data_nascimento: dataSQL };
  }
}