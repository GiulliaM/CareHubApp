// back-end/src/models/Paciente.ts
import { pool } from '../db'; 

export type PacientePayload = {
  nome: string;
  data_nascimento?: string;
  informacoes_medicas?: string;
  foto_url?: string;
};

/**
 * (M) Helper: Converte data 'DD/MM/AAAA' para 'AAAA-MM-DD' (SQL)
 */
const formatarDataParaSQL = (data: string | undefined): string | null => {
  if (!data) {
    return null; // Salva NULL se a data for opcional e não for enviada
  }
  const partes = data.split('/');
  if (partes.length === 3) {
    // partes[0] = DD, partes[1] = MM, partes[2] = AAAA
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
  return null; // Formato inválido
};


export class Paciente {
  
  static async criar(dados: PacientePayload, usuarioId: number): Promise<any> {
    const { nome, informacoes_medicas, foto_url } = dados;

    // <<< MUDANÇA: Usar a função helper para formatar a data
    const dataSQL = formatarDataParaSQL(dados.data_nascimento);
    // --- FIM DA MUDANÇA ---
    
    // 1. Salva o paciente
    const [result] = await pool.query(
      'INSERT INTO pacientes (nome, data_nascimento, informacoes_medicas, foto_url) VALUES (?, ?, ?, ?)',
      [nome, dataSQL, informacoes_medicas, foto_url]
    );
    
    // @ts-ignore
    const novoPacienteId = result.insertId;

    // 2. Linka o paciente ao usuário
    await pool.query(
      'INSERT INTO paciente_usuarios (fk_paciente_id, fk_usuario_id, relacao) VALUES (?, ?, ?)',
      [novoPacienteId, usuarioId, 'Principal']
    );

    return { id: novoPacienteId, ...dados };
  }
}