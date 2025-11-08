// back-end/src/models/Medicamento.ts
import { pool } from '../db';
import { calcularProximaOcorrencia } from '../utils/recorrencias'; 
// 💡 CORREÇÃO: Importar as funções de data/hora do date-fns
import { parseISO, isPast, format } from 'date-fns'; 

// Estrutura esperada de Medicamento pelo Controller de Dashboard
export interface IProximoMedicamentoData {
  nome_medicamento: string;
  horario_tarefa: string; 
  repete_ate: string; // Data de referência da recorrência ou data única
}

// Interface para criar um novo medicamento (usada no Controller POST)
interface INovoMedicamento {
  fk_paciente_id: number;
  fk_registrado_por_id: number;
  nome_medicamento: string;
  dosagem?: string;
  frequencia?: string;
  instrucoes?: string;
  data_inicio?: string;
  data_termino?: string;
}

// Interface para a busca SQL de medicamentos recorrentes
interface IMedicamentoRecorrente {
    titulo: string;
    horario_tarefa: string;
    repete_ate: string; // Data de término ou data única
    tipo_recorrencia: 'Única' | 'Diária' | 'Semanal' | 'Mensal';
}


export class Medicamento {
  
  /**
   * (M) MODEL: Cria um novo registro na tabela 'medicamentos'.
   */
  static async criar(dados: INovoMedicamento): Promise<any> {
    const { 
      fk_paciente_id, 
      fk_registrado_por_id, 
      nome_medicamento, 
      dosagem, 
      frequencia, 
      instrucoes, 
      data_inicio, 
      data_termino 
    } = dados;

    try {
      const [result] = await pool.query(
        `INSERT INTO medicamentos 
         (fk_paciente_id, fk_registrado_por_id, nome_medicamento, dosagem, frequencia, instrucoes, data_inicio, data_termino)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [fk_paciente_id, fk_registrado_por_id, nome_medicamento, dosagem, frequencia, instrucoes, data_inicio, data_termino]
      );

      // @ts-ignore
      return { id: result.insertId, ...dados };

    } catch (error) {
      console.error("Erro ao criar medicamento:", error);
      throw new Error("Falha ao criar medicamento no banco de dados.");
    }
  }

  /**
   * (M) MODEL: Busca todos os medicamentos ativos de um paciente.
   */
  static async buscarTodosPorPaciente(pacienteId: number): Promise<any[]> {
    try {
      const [rows] = await pool.query(
        `SELECT
          id, nome_medicamento, dosagem, frequencia, instrucoes, data_inicio, data_termino, fk_registrado_por_id
         FROM medicamentos
         WHERE fk_paciente_id = ?
         ORDER BY id DESC;`,
        [pacienteId]
      );
      
      // @ts-ignore
      return rows;
      
    } catch (error) {
      console.error("Erro ao buscar medicamentos por paciente:", error);
      return [];
    }
  }

  /**
   * (M) MODEL: Busca o próximo medicamento a ser administrado, considerando a recorrência.
   */
  static async buscarProximoMedicamento(pacienteId: number): Promise<IProximoMedicamentoData | null> {
    try {
      // 1. Busca todas as tarefas que parecem ser medicamentos e estão ativas
      const [rows] = await pool.query(
        `SELECT
          titulo,
          horario_tarefa,
          repete_ate,
          tipo_recorrencia
        FROM
          tarefas
        WHERE
          fk_paciente_id = ?
          AND titulo LIKE '%medicamento%' 
          AND status = 'Pendente'
          -- Filtra tarefas cuja data de término (repete_ate) ainda não passou
          AND (repete_ate IS NULL OR repete_ate >= CURRENT_DATE());
        `,
        [pacienteId]
      );
      
      // @ts-ignore
      const medicamentosRecorrentes: IMedicamentoRecorrente[] = rows;
      
      let proximo: { data: Date; item: IMedicamentoRecorrente } | null = null;
      const agora = new Date();

      // 2. Calcula a próxima ocorrência real no lado do servidor (TS)
      for (const item of medicamentosRecorrentes) {
        const { data, horario } = calcularProximaOcorrencia(agora, item.horario_tarefa, item.tipo_recorrencia);
        
        if (data) {
            const dataOcorrencia = parseISO(`${data}T${horario}`);
            
            // Verifica se a nova ocorrência não ultrapassa a data de término (repete_ate)
            if (item.repete_ate && isPast(parseISO(item.repete_ate)) && item.tipo_recorrencia !== 'Única') continue;

            if (!proximo || dataOcorrencia < proximo.data) {
                proximo = {
                    data: dataOcorrencia,
                    item: item,
                };
            }
        }
      }

      if (proximo) {
        return {
          nome_medicamento: proximo.item.titulo,
          horario_tarefa: format(proximo.data, 'HH:mm:ss'),
          repete_ate: format(proximo.data, 'yyyy-MM-dd'),
        };
      }

      return null;

    } catch (error) {
      console.error("Erro ao buscar próximo medicamento:", error);
      return null;
    }
  }
}