// back-end/src/models/Registro.ts
import { pool } from '../db';

/** Registro resumido para exibição no feed/diário */
interface IRegistroResumo {
  tipo?: string;
  titulo: string;
  subtitulo?: string;
  data?: string;
}

interface INovoRegistro {
  fk_paciente_id: number;
  fk_registrado_por_id: number;
  tipo_registro: 'Humor' | 'Refeição' | 'Sintoma' | 'Atividade' | 'Botão Pânico' | 'Outro';
  comentario: string;
  // data_registro e horario_registro são tratados pelo MySQL como default ou por lógica no controller/model
}
// ❌ Removidas as funções de busca de Próximos Cuidados, pois o SQL schema usa Medicamentos/Tarefas.

export class Registro {


  static async criar(dados: INovoRegistro): Promise<any> {
    const { fk_paciente_id, fk_registrado_por_id, tipo_registro, comentario } = dados;

    try {
      const [result] = await pool.query(
        `INSERT INTO registros
         (fk_paciente_id, fk_registrado_por_id, tipo_registro, comentario)
         VALUES (?, ?, ?, ?);`,
        [fk_paciente_id, fk_registrado_por_id, tipo_registro, comentario]
      );

      // @ts-ignore
      return { id: result.insertId, data_registro: new Date(), ...dados };

    } catch (error) {
      console.error("Erro ao criar registro:", error);
      throw new Error("Falha ao criar registro no banco de dados.");
    }
  }
  /**
   * (M) MODEL: Conta o número de registros de 'Botão Pânico' que estão pendentes.
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
      // Retornar 0 em vez de throw é melhor para o dashboard
      return 0;
    }
  }

  /**
   * (M) MODEL: Busca os registros mais recentes do paciente (Diário/Atividades).
   */
  static async buscarAtividadesRecentes(pacienteId: number, limite: number): Promise<IRegistroResumo[]> {
    try {
      const [rows] = await pool.query(
        `SELECT
          comentario,
          tipo_registro,
          data_registro
        FROM
          registros
        WHERE
          fk_paciente_id = ?
        ORDER BY
          data_registro DESC
        LIMIT ?;
        `,
        [pacienteId, limite]
      );
      
      // Mapeia os resultados do banco de dados para a interface IRegistroResumo
      // @ts-ignore
      const atividades: IRegistroResumo[] = rows.map(
        (row: { comentario: string, tipo_registro: string, data_registro: Date }) => {
            const dataFormatada = new Date(row.data_registro).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
            return {
                tipo: row.tipo_registro,
                titulo: row.tipo_registro, 
                subtitulo: `${row.comentario.substring(0, 50)}...`, 
                data: dataFormatada,
            };
        }
      );

      return atividades;

    } catch (error) {
      console.error("Erro ao buscar atividades recentes:", error);
      return []; 
    }
  }
}