// back-end/src/models/Tarefa.ts
import { pool } from '../db';
// (Importando tipos que sua colega definiu)
import { ITarefa, ITarefaCreate } from './interfaces'; 

export class Tarefa {
  static async criar(payload: ITarefaCreate): Promise<number> {
    // ... (Sua lógica 'criar' está correta)
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
          payload.repete_ate, 
          payload.tipo_recorrencia ?? 'Única', 
        ]
      );
      return result.insertId;
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw new Error('Falha ao criar tarefa.');
    }
  }

  static async buscarPorData(pacienteId: number, dataISO: string): Promise<ITarefa[]> {
    // ... (Sua lógica 'buscarPorData' está correta)
    try {
      const [rows]: any = await pool.query(
         `SELECT * FROM tarefas 
         WHERE fk_paciente_id = ?
           AND repete_ate = ?
         ORDER BY horario_tarefa ASC`,
         [pacienteId, dataISO]
      );
      return rows as ITarefa[];
    } catch (error) {
      console.error('Erro ao buscar tarefas por data:', error);
      throw new Error('Falha ao buscar tarefas por data.');
    }
  }

  static async marcarConcluida(id: number): Promise<boolean> {
    // ... (Sua lógica 'marcarConcluida' está correta)
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
  
  static async buscarPorId(id: number): Promise<ITarefa | null> {
    // ... (Sua lógica 'buscarPorId' está correta)
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
    // ... (Sua lógica 'deletar' está correta)
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
  
  // ---
  // <<< MUDANÇA: ADICIONANDO AS FUNÇÕES QUE FALTAVAM
  // ---
  static async buscarProximoMedicamento(pacienteId: number): Promise<any> {
    console.warn('Aviso: Lógica de Medicamento sendo chamada no Model de Tarefa');
    try {
      // (Presume que você tenha uma tabela 'medicamentos')
      const [rows] = await pool.query(
        "SELECT * FROM medicamentos WHERE fk_paciente_id = ? AND data_inicio >= CURDATE() ORDER BY data_inicio, id LIMIT 1",
        [pacienteId]
      );
      // @ts-ignore
      if (rows.length === 0) { return null; }
      // @ts-ignore
      return rows[0];
    } catch (e) { return null; }
  }
  
  static async buscarProximaConsulta(pacienteId: number): Promise<any> {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM tarefas WHERE fk_paciente_id = ? AND titulo LIKE '%consulta%' AND repete_ate >= CURDATE() ORDER BY repete_ate, horario_tarefa LIMIT 1",
        [pacienteId]
      );
      // @ts-ignore
      if (rows.length === 0) { return null; }
      // @ts-ignore
      return rows[0];
    } catch (e) { return null; }
  }

  static async buscarTodasPorPaciente(pacienteId: number): Promise<ITarefa[]> {
    try {
      const [rows]: any = await pool.query(
        `SELECT * FROM tarefas 
         WHERE fk_paciente_id = ?
         ORDER BY repete_ate, horario_tarefa ASC`,
         [pacienteId]
      );
      return rows as ITarefa[];
    } catch (error) {
      console.error('Erro ao buscar todas as tarefas por paciente:', error);
      throw new Error('Falha ao buscar tarefas.');
    }
  }

  /**
   * (M) MODEL: Busca tarefas ATIVAS de um paciente para uma data
   * (Função que faltava para o tarefasPorDataController.ts)
   */
  static async buscarTarefasAtivasPorData(pacienteId: number, dataISO: string): Promise<ITarefa[]> {
    try {
      const [rows]: any = await pool.query(
        `SELECT * FROM tarefas 
         WHERE fk_paciente_id = ?
           AND repete_ate = ?
           AND status = 'Pendente'
         ORDER BY horario_tarefa ASC`,
         [pacienteId, dataISO]
      );
      return rows as ITarefa[];
    } catch (error) {
      console.error('Erro ao buscar tarefas ativas por data:', error);
      throw new Error('Falha ao buscar tarefas ativas por data.');
    }
  }
}