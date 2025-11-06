// back-end/src/models/Registro.ts
import { pool } from '../db';

export class Registro {

  /**
   * (M) MODEL: Conta o número de registros de 'Botão Pânico' que estão pendentes.
   * IMPORTANTE: A ausência de um campo 'status' no registro implica que todos são contados
   * como 'pendentes' até serem visualizados no frontend.
   */
  static async contarAlertasPendentes(pacienteId: number): Promise<number> {
    try {
      const [rows] = await pool.query(
        `SELECT
          COUNT(id) AS total
        FROM
          registros
        WHERE
          fk_paciente_id = ?
          AND tipo_registro = 'Botão Pânico';
        `,
        [pacienteId]
      );
      
      // @ts-ignore
      return rows[0].total || 0;

    } catch (error) {
      console.error("Erro ao contar alertas pendentes:", error);
      throw new Error("Falha ao buscar contagem de alertas.");
    }
  }

  // Futuras funções como: criarRegistro, buscarRegistrosRecentes, etc.
}