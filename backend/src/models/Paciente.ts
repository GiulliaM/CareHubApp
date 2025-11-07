// back-end/src/models/Paciente.ts
import { pool } from '../db'; 

// O "Payload" (carga) de dados que esperamos receber do Controller
export type PacientePayload = {
  nome: string;
  data_nascimento?: string; // (Vem como "DD/MM/AAAA" ou undefined)
  informacoes_medicas?: string; // (Vem das "Alergias / Infos Médicas")
  foto_url?: string; // (Vem do controller, ex: /uploads/foto-123.jpg)
};

/**
 * (M) Helper: Converte a data do formato do app (DD/MM/AAAA) 
 * para o formato do banco de dados (AAAA-MM-DD)
 */
const formatarDataParaSQL = (data: string | undefined): string | null => {
  // Se a data não for enviada (opcional), retorne NULL
  if (!data) {
    return null; 
  }
  
  const partes = data.split('/');
  if (partes.length === 3) {
    // partes[0] = DD, partes[1] = MM, partes[2] = AAAA
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
  
  // Se o formato estiver errado, retorne NULL
  return null; 
};


export class Paciente {
  
  /**
   * (M) MODEL: Cria um novo paciente no banco de dados
   * @param dados Os dados do paciente (nome, etc.)
   * @param usuarioId O ID do usuário (cuidador) que está criando este paciente
   */
  static async criar(dados: PacientePayload, usuarioId: number): Promise<any> {
    const { nome, informacoes_medicas, foto_url } = dados;

    // --- CORREÇÃO DO BUG DA DATA ---
    // Converte a data "DD/MM/AAAA" para "AAAA-MM-DD"
    const dataSQL = formatarDataParaSQL(dados.data_nascimento);
    // --- FIM DA CORREÇÃO ---
    
    // 1. Salva o paciente na tabela 'pacientes'
    const [result] = await pool.query(
      'INSERT INTO pacientes (nome, data_nascimento, informacoes_medicas, foto_url) VALUES (?, ?, ?, ?)',
      [nome, dataSQL, informacoes_medicas, foto_url] // foto_url virá do Controller
    );
    
    // @ts-ignore
    const novoPacienteId = result.insertId;

    // 2. Linka o paciente ao usuário na tabela 'paciente_usuarios'
    await pool.query(
      'INSERT INTO paciente_usuarios (fk_paciente_id, fk_usuario_id, relacao) VALUES (?, ?, ?)',
      [novoPacienteId, usuarioId, 'Principal'] // Define o criador como "Principal"
    );

    // 3. Retorna o paciente que acabou de ser criado
    return { id: novoPacienteId, ...dados, data_nascimento: dataSQL };
  }
  
  /**
   * (M) MODEL: Verifica se um usuário (cuidador) tem acesso a um paciente
   * (Necessário para o dashboardController)
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
   * (Necessário para o dashboardController e "Perfil Pessoa Cuidada")
   */
  static async buscarPerfilPorId(pacienteId: number): Promise<any> {
    const [rows] = await pool.query(
      'SELECT * FROM pacientes WHERE id = ? LIMIT 1',
      [pacienteId]
    );
    // @ts-ignore
    if (rows.length === 0) {
      throw new Error('Paciente não encontrado.');
    }
    // @ts-ignore
    return rows[0]; // Retorna o paciente encontrado
  }
  
  // (No futuro, adicionaremos a função 'atualizar' aqui)
}