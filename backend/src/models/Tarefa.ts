// back-end/src/models/Tarefa.ts
import { pool } from '../db';

export interface ITarefa {
  id?: number;
  fk_paciente_id: number;
  titulo: string;
  descricao?: string | null;
  horario_tarefa?: string | null; // "HH:MM:SS"
  repete_ate?: string | null;      // "YYYY-MM-DD"
  status?: 'Pendente' | 'Concluida' | 'Cancelada';
  created_at?: string;
  updated_at?: string;
}

export interface ITarefaCreate {
  fk_paciente_id: number;
  titulo: string;
  descricao?: string | null;
  horario_tarefa?: string | null;
  repete_ate?: string | null;
}

export interface ITarefaUpdate {
  titulo?: string;
  descricao?: string | null;
  horario_tarefa?: string | null;
  repete_ate?: string | null;
  status?: 'Pendente' | 'Concluida' | 'Cancelada';
}

export interface ITarefaDashboard {
  id: number;
  titulo: string;
  horario_tarefa: string; // Ex: "14:30:00"
  repete_ate: string;     // Ex: "2025-11-08"
}

export class Tarefa {
  // Create
  static async criar(payload: ITarefaCreate): Promise<number> {
    try {
      const [result]: any = await pool.query(
        `INSERT INTO tarefas 
          (fk_paciente_id, titulo, descricao, horario_tarefa, repete_ate, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'Pendente', NOW(), NOW())`,
        [
          payload.fk_paciente_id,
          payload.titulo,
          payload.descricao ?? null,
          payload.horario_tarefa ?? null,
          payload.repete_ate ?? null,
        ]
      );
      return result.insertId;
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw new Error('Falha ao criar tarefa.');
    }
  }

  // Read by id
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

  // List by paciente (com paginação simples)
  static async listarPorPaciente(pacienteId: number, page = 1, pageSize = 50): Promise<ITarefa[]> {
    const offset = (page - 1) * pageSize;
    try {
      const [rows]: any = await pool.query(
        `SELECT * FROM tarefas WHERE fk_paciente_id = ? ORDER BY repete_ate ASC, horario_tarefa ASC LIMIT ? OFFSET ?`,
        [pacienteId, Number(pageSize), Number(offset)]
      );
      return rows;
    } catch (error) {
      console.error('Erro ao listar tarefas por paciente:', error);
      throw new Error('Falha ao listar tarefas.');
    }
  }

  // Update
  static async atualizar(id: number, data: ITarefaUpdate): Promise<boolean> {
    try {
      const campos: string[] = [];
      const valores: any[] = [];
      if (data.titulo !== undefined) { campos.push('titulo = ?'); valores.push(data.titulo); }
      if (data.descricao !== undefined) { campos.push('descricao = ?'); valores.push(data.descricao); }
      if (data.horario_tarefa !== undefined) { campos.push('horario_tarefa = ?'); valores.push(data.horario_tarefa); }
      if (data.repete_ate !== undefined) { campos.push('repete_ate = ?'); valores.push(data.repete_ate); }
      if (data.status !== undefined) { campos.push('status = ?'); valores.push(data.status); }

      if (campos.length === 0) return false;

      valores.push(id);
      const sql = `UPDATE tarefas SET ${campos.join(', ')}, updated_at = NOW() WHERE id = ?`;
      const [result]: any = await pool.query(sql, valores);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw new Error('Falha ao atualizar tarefa.');
    }
  }

  // Delete
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

  // Mark complete
  static async marcarConcluida(id: number): Promise<boolean> {
    try {
      const [result]: any = await pool.query(
        `UPDATE tarefas SET status = 'Concluida', updated_at = NOW() WHERE id = ?`,
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao marcar tarefa como concluída:', error);
      throw new Error('Falha ao marcar tarefa como concluída.');
    }
  }

  // Buscar por data (repete_ate)
  static async buscarPorData(pacienteId: number, dataISO: string): Promise<ITarefa[]> {
    try {
      const [rows]: any = await pool.query(
        `SELECT * FROM tarefas 
         WHERE fk_paciente_id = ?
           AND repete_ate = ?
         ORDER BY horario_tarefa ASC`,
         [pacienteId, dataISO]
      );
      return rows;
    } catch (error) {
      console.error('Erro ao buscar tarefas por data:', error);
      throw new Error('Falha ao buscar tarefas por data.');
    }
  }

  /**
   * Mantive e deixei público os helpers já existentes para dashboard:
   */
  static async buscarProximoMedicamento(pacienteId: number): Promise<ITarefaDashboard | null> {
    try {
      const [rows]: any = await pool.query(
        `SELECT
          id,
          titulo,
          horario_tarefa,
          repete_ate
        FROM
          tarefas
        WHERE
          fk_paciente_id = ?
          AND status = 'Pendente'
          AND titulo LIKE 'Medicamento:%'
          AND repete_ate >= DATE(NOW())
          AND (
            repete_ate > DATE(NOW())
            OR 
            (repete_ate = DATE(NOW()) AND horario_tarefa >= TIME(NOW()))
          )
        ORDER BY
          repete_ate ASC,
          horario_tarefa ASC
        LIMIT 1;`,
        [pacienteId]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Erro ao buscar próximo medicamento:", error);
      throw new Error("Falha ao buscar próximo medicamento.");
    }
  }

  static async buscarProximaConsulta(pacienteId: number): Promise<ITarefaDashboard | null> {
    try {
      const [rows]: any = await pool.query(
        `SELECT
          id,
          titulo,
          horario_tarefa,
          repete_ate
        FROM
          tarefas
        WHERE
          fk_paciente_id = ?
          AND status = 'Pendente'
          AND repete_ate >= DATE(NOW())
          AND titulo NOT LIKE 'Medicamento:%'
        ORDER BY
          repete_ate ASC,
          horario_tarefa ASC
        LIMIT 1;`,
        [pacienteId]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Erro ao buscar próxima consulta:", error);
      throw new Error("Falha ao buscar próxima consulta.");
    }
  }
}