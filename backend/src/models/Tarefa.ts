// back-end/src/models/Tarefa.ts
import { pool } from '../db';

// Interface para os dados de tarefa que serão retornados ao controller
export interface ITarefaDashboard {
  id: number;
  titulo: string;
  horario_tarefa: string; // Ex: "14:30:00"
  repete_ate: string;     // Ex: "2025-11-08" (Data da próxima ocorrência)
}

export class Tarefa {
  
  /**
   * (M) MODEL: Busca o próximo medicamento (tarefa pendente) no tempo.
   * Combina repete_ate e horario_tarefa para encontrar o mais próximo, seja hoje ou em dias futuros.
   */
  static async buscarProximoMedicamento(pacienteId: number): Promise<ITarefaDashboard | null> {
    try {
      const [rows] = await pool.query(
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
          -- Filtra pelo padrão de medicamento
          AND titulo LIKE 'Medicamento:%'
          -- Garante que a data da tarefa seja HOJE ou FUTURA
          AND repete_ate >= DATE(NOW())
          -- Adiciona lógica para desconsiderar horários passados *de hoje*
          AND (
            repete_ate > DATE(NOW()) -- Se a data for futura, qualquer horário serve
            OR 
            (repete_ate = DATE(NOW()) AND horario_tarefa >= TIME(NOW())) -- Se a data for hoje, o horário deve ser futuro
          )
        ORDER BY
          repete_ate ASC,
          horario_tarefa ASC
        LIMIT 1;
        `,
        [pacienteId]
      );
      
      // @ts-ignore
      return rows.length > 0 ? rows[0] : null;

    } catch (error) {
      console.error("Erro ao buscar próximo medicamento:", error);
      throw new Error("Falha ao buscar próximo medicamento.");
    }
  }

  /**
   * (M) MODEL: Busca a próxima consulta (tarefa pendente) pela data e horário.
   * Supõe-se que consultas são tarefas que NÃO SÃO medicamentos.
   */
  static async buscarProximaConsulta(pacienteId: number): Promise<ITarefaDashboard | null> {
    // Esta lógica está correta para consultas
    try {
      const [rows] = await pool.query(
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
          -- A data da repetição deve ser hoje ou futura
          AND repete_ate >= DATE(NOW())
          -- Excluir medicamentos (pelo padrão)
          AND titulo NOT LIKE 'Medicamento:%'
        ORDER BY
          repete_ate ASC,
          horario_tarefa ASC
        LIMIT 1;
        `,
        [pacienteId]
      );
      
      // @ts-ignore
      return rows.length > 0 ? rows[0] : null;

    } catch (error) {
      console.error("Erro ao buscar próxima consulta:", error);
      throw new Error("Falha ao buscar próxima consulta.");
    }
  }

  // Futuras funções como: criarTarefa, completarTarefa, etc.
}