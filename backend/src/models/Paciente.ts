// back-end/src/models/Paciente.ts
import { pool } from '../db'; 

export type PacientePayload = {
  nome: string;
  data_nascimento?: string; // (Vem como "DD/MM/AAAA" ou undefined)
  informacoes_medicas?: string;
  foto_url?: string; // (Vem do controller, ex: /uploads/foto-123.jpg)
};

/**
 * (M) Helper: Converte data 'DD/MM/AAAA' para 'AAAA-MM-DD' (SQL)
 */
const formatarDataParaSQL = (data: string | undefined): string | null => {
  if (!data || data.trim() === '') {
    return null; // Salva NULL se a data for opcional e não for enviada
  }
  
  const partes = data.split('/');
  if (partes.length === 3 && partes[2] && partes[1] && partes[0]) {
    // partes[0] = DD, partes[1] = MM, partes[2] = AAAA
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
  
  // Se o formato estiver errado (ex: "0000-00-00"), retorne NULL
  return null; 
};

/**
 * (M) Helper: Converte data 'AAAA-MM-DD' (SQL) para 'DD/MM/AAAA' (App)
 */
const formatarDataParaApp = (data: string | undefined): string => {
  if (!data || data.startsWith('0000-00-00')) {
    return ''; // Retorna string vazia se for nulo ou '0000-00-00'
  }
  const partes = data.split('-');
  if (partes.length === 3) {
    // partes[0] = AAAA, partes[1] = MM, partes[2] = DD
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return '';
};


export class Paciente {
  
  /**
   * (M) MODEL: Cria um novo paciente
   */
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
  
  /**
   * (M) MODEL: Verifica se um usuário tem acesso a um paciente
   */
  static async usuarioTemAcesso(usuarioId: number, pacienteId: number): Promise<boolean> {
    try {
      const [rows] = await pool.query(
        'SELECT 1 FROM paciente_usuarios WHERE fk_usuario_id = ? AND fk_paciente_id = ? LIMIT 1',
        [usuarioId, pacienteId]
      );
      // @ts-ignore
      return rows.length > 0; // Retorna true se a relação existir
    } catch (error) {
      console.error("Erro em usuarioTemAcesso:", error);
      return false;
    }
  }

  /**
   * (M) MODEL: Busca os dados de um paciente específico pelo ID
   */
  static async buscarPorId(pacienteId: number): Promise<any> {
    const [rows] = await pool.query(
      'SELECT * FROM pacientes WHERE id = ? LIMIT 1',
      [pacienteId]
    );
    // @ts-ignore
    if (rows.length === 0) {
      throw new Error('Paciente não encontrado.');
    }
    // @ts-ignore
    const paciente = rows[0];
    
    // <<< MUDANÇA: Formata a data de volta para o app
    paciente.data_nascimento = formatarDataParaApp(paciente.data_nascimento);
    return paciente;
  }
  
  /**
   * (M) MODEL: Busca o PRIMEIRO paciente de um usuário
   */
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
    
    // <<< MUDANÇA: Formata a data de volta para o app
    paciente.data_nascimento = formatarDataParaApp(paciente.data_nascimento);
    return paciente;
  }
  
  /**
   * (M) MODEL: Atualiza os dados de um paciente
   */
  static async atualizar(pacienteId: number, dados: PacientePayload): Promise<any> {
    const { nome, informacoes_medicas, foto_url } = dados;
    const dataSQL = formatarDataParaSQL(dados.data_nascimento);

    // Se uma nova foto foi enviada (foto_url não é undefined), atualize.
    // Se não (foto_url é undefined), NÃO mude a foto existente.
    if (foto_url) {
      await pool.query(
        'UPDATE pacientes SET nome = ?, data_nascimento = ?, informacoes_medicas = ?, foto_url = ? WHERE id = ?',
        [nome, dataSQL, informacoes_medicas, foto_url, pacienteId]
      );
    } else {
      // Atualiza tudo, MENOS a foto_url
      await pool.query(
        'UPDATE pacientes SET nome = ?, data_nascimento = ?, informacoes_medicas = ? WHERE id = ?',
        [nome, dataSQL, informacoes_medicas, pacienteId]
      );
    }

    return { id: pacienteId, ...dados, data_nascimento: dataSQL };
  }
}