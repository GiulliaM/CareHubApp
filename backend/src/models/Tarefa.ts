// back-end/src/models/Tarefa.ts
import { pool } from '../db';

// O "Payload" (carga) de dados que esperamos receber do Controller
export type TarefaPayload = {
  fk_paciente_id: number;
  fk_responsavel_id: number;
  titulo: string;
  status?: 'Pendente' | 'Concluída' | 'Atrasada';
  tipo_recorrencia?: 'Única' | 'Diária' | 'Semanal' | 'Mensal';
  horario_tarefa?: string; // (ex: "08:00")
  data_tarefa?: string; // (ex: "2025-11-07")
};

/**
 * (M) Helper: Converte a data do formato do app (DD/MM/AAAA) 
 * para o formato do banco de dados (AAAA-MM-DD)
 */
const formatarDataParaSQL = (data: string | undefined): string | null => {
  if (!data) {
    return null;
  }
  const partes = data.split('/');
  if (partes.length === 3) {
    // partes[0] = DD, partes[1] = MM, partes[2] = AAAA
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
  return data; // Assume que já está em AAAA-MM-DD se não for o formato do app
};


export class Tarefa {

  /**
   * (M) MODEL: Cria uma nova tarefa no banco
   */
  static async criar(dados: TarefaPayload): Promise<any> {
    const {
      fk_paciente_id,
      fk_responsavel_id,
      titulo,
      status = 'Pendente', // Valor padrão
      tipo_recorrencia = 'Única', // Valor padrão
      horario_tarefa,
      data_tarefa
    } = dados;

    // Converte a data para o formato do banco (se ela existir)
    const dataSQL = formatarDataParaSQL(data_tarefa);

    const [result] = await pool.query(
      `INSERT INTO tarefas 
        (fk_paciente_id, fk_responsavel_id, titulo, status, tipo_recorrencia, horario_tarefa, data_tarefa) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [fk_paciente_id, fk_responsavel_id, titulo, status, tipo_recorrencia, horario_tarefa, dataSQL]
    );
    
    // @ts-ignore
    const novaTarefaId = result.insertId;
    return { id: novaTarefaId, ...dados };
  }

  /**
   * (M) MODEL: Busca tarefas de um paciente para um dia específico
   */
  static async buscarPorDia(pacienteId: number, data: string): Promise<any[]> {
    // data deve estar no formato 'AAAA-MM-DD'
    const [rows] = await pool.query(
      `SELECT * FROM tarefas 
       WHERE fk_paciente_id = ? 
       AND data_tarefa = ?
       ORDER BY horario_tarefa`,
      [pacienteId, data]
    );
    // @ts-ignore
    return rows;
  }

  // ---
  // Funções que o dashboardController estava pedindo
  // ---

  /**
   * (M) MODEL: Busca o próximo medicamento
   * AVISO: Esta lógica deveria estar no Model 'Medicamento.ts',
   * mas estamos colocando aqui para corrigir o erro de build do dashboard.
   */
  static async buscarProximoMedicamento(pacienteId: number): Promise<any> {
    console.warn('Aviso: Lógica de Medicamento sendo chamada no Model de Tarefa');
    try {
      // (Presume que 'data_inicio' é a data e 'frequencia' ou 'horario' é a hora)
      const [rows] = await pool.query(
        "SELECT * FROM medicamentos WHERE fk_paciente_id = ? AND data_inicio >= CURDATE() ORDER BY data_inicio, id LIMIT 1",
        [pacienteId]
      );
      // @ts-ignore
      if (rows.length === 0) { return null; }
      // @ts-ignore
      return rows[0];
    } catch (e) { 
      console.error("Erro em buscarProximoMedicamento:", e);
      return null; 
    }
  }
  
  /**
   * (M) MODEL: Busca a próxima consulta
   */
  static async buscarProximaConsulta(pacienteId: number): Promise<any> {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM tarefas WHERE fk_paciente_id = ? AND titulo LIKE '%consulta%' AND data_tarefa >= CURDATE() ORDER BY data_tarefa, horario_tarefa LIMIT 1",
        [pacienteId]
      );
      // @ts-ignore
      if (rows.length === 0) { return null; }
      // @ts-ignore
      return rows[0];
    } catch (e) { 
      console.error("Erro em buscarProximaConsulta:", e);
      return null; 
    }
  }
}