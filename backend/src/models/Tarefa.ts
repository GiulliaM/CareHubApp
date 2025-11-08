// back-end/src/models/Tarefa.ts
import { pool } from '../db'; // Assumindo que '../db' fornece a conexão com o banco

// Tipagem completa
export interface ITarefa {
  id?: number;
  fk_paciente_id: number;
  fk_responsavel_id?: number | null; 
  titulo: string;
  status: 'Pendente' | 'Concluída' | 'Atrasada'; 
  tipo_recorrencia: 'Única' | 'Diária' | 'Semanal' | 'Mensal'; 
  horario_tarefa: string | null; 
  repete_ate: string | null; // Data no formato YYYY-MM-DD     
  data_criacao?: string;
}

// Tipagem para criação
export interface ITarefaCreate {
  fk_paciente_id: number;
  fk_responsavel_id?: number | null; 
  titulo: string;
  horario_tarefa?: string | null;
  repete_ate: string; // Obrigatório no cadastro para saber a data da tarefa
  tipo_recorrencia?: 'Única' | 'Diária' | 'Semanal' | 'Mensal';
}

// Tipagem para atualização
export interface ITarefaUpdate {
  titulo?: string;
  fk_responsavel_id?: number | null;
  horario_tarefa?: string | null;
  repete_ate?: string | null;
  status?: 'Pendente' | 'Concluída' | 'Atrasada';
  tipo_recorrencia?: 'Única' | 'Diária' | 'Semanal' | 'Mensal';
}


export class Tarefa {
  // Cria uma nova tarefa
  static async criar(payload: ITarefaCreate): Promise<number> {
    try {
      const [result]: any = await pool.query(
        `INSERT INTO tarefas 
          (fk_paciente_id, fk_responsavel_id, titulo, horario_tarefa, repete_ate, tipo_recorrencia, status)
         VALUES (?, ?, ?, ?, ?, ?, 'Pendente')`,
        [
          payload.fk_paciente_id,
          payload.fk_responsavel_id ?? null, 
          payload.titulo,
          payload.horario_tarefa ?? null,
          payload.repete_ate, // Data da tarefa
          payload.tipo_recorrencia ?? 'Única', 
        ]
      );
      return result.insertId;
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw new Error('Falha ao criar tarefa.');
    }
  }

  // Busca tarefas de um paciente para uma data específica (YYYY-MM-DD)
  static async buscarPorData(pacienteId: number, dataISO: string): Promise<ITarefa[]> {
    try {
      const [rows]: any = await pool.query(
        `SELECT * FROM tarefas 
         WHERE fk_paciente_id = ?
           AND repete_ate = ? -- Filtra exatamente pela data
         ORDER BY horario_tarefa ASC`,
         [pacienteId, dataISO]
      );
      return rows as ITarefa[];
    } catch (error) {
      console.error('Erro ao buscar tarefas por data:', error);
      throw new Error('Falha ao buscar tarefas por data.');
    }
  }

  // Marca uma tarefa como Concluída
  static async marcarConcluida(id: number): Promise<boolean> {
    try {
      const [result]: any = await pool.query(
        `UPDATE tarefas SET status = 'Concluída' WHERE id = ? AND status <> 'Concluída'`,
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao marcar tarefa como concluída:', error);
      throw new Error('Falha ao marcar tarefa como concluída.');
    }
  }
  
  // Métodos de CRUD (Update e Delete mantidos por conveniência)
  static async buscarPorId(id: number): Promise<ITarefa | null> {
    try {
      const [rows]: any = await pool.query(
        `SELECT * FROM tarefas WHERE id = ? LIMIT 1`,
        [id]
      );
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Erro ao buscar tarefa por id:', error);
      throw new Error('Falha ao buscar tarefa.');
    }
  }

  static async deletar(id: number): Promise<boolean> {
    try {
      const [result]: any = await pool.query(
        `DELETE FROM tarefas WHERE id = ?`,
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      throw new Error('Falha ao deletar tarefa.');
    }
  }
}