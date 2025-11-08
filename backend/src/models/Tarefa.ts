// back-end/src/models/Tarefa.ts
import { pool } from '../db';
import { calcularProximaOcorrencia } from '../utils/recorrencias'; 
import { parseISO, isPast, format } from 'date-fns'; 

// Estrutura esperada de Tarefa/Consulta pelo Controller de Dashboard
export interface IProximaConsultaData {
  titulo: string;
  repete_ate: string; // Data da próxima ocorrência (YYYY-MM-DD)
  horario_tarefa: string; // Horário (HH:MM:SS)
}

// Interface para criar uma nova tarefa (usada no Controller POST)
interface INovaTarefa {
  fk_paciente_id: number;
  fk_responsavel_id: number; // Quem deve realizar a tarefa
  titulo: string;
  tipo_recorrencia: 'Única' | 'Diária' | 'Semanal' | 'Mensal';
  horario_tarefa?: string;
  repete_ate?: string; // Data de término ou data única
}

// Interface para a busca SQL de tarefas recorrentes
interface ITarefaRecorrente {
    titulo: string;
    horario_tarefa: string;
    repete_ate: string; 
    tipo_recorrencia: 'Única' | 'Diária' | 'Semanal' | 'Mensal';
}

export class Tarefa {
  
  /**
   * (M) MODEL: Cria um novo registro na tabela 'tarefas'.
   */
  static async criar(dados: INovaTarefa): Promise<any> {
    const { 
      fk_paciente_id, 
      fk_responsavel_id, 
      titulo, 
      tipo_recorrencia, 
      horario_tarefa, 
      repete_ate 
    } = dados;

    try {
      const [result] = await pool.query(
        `INSERT INTO tarefas
         (fk_paciente_id, fk_responsavel_id, titulo, status, tipo_recorrencia, horario_tarefa, repete_ate)
         VALUES (?, ?, ?, 'Pendente', ?, ?, ?);`, // Status inicial 'Pendente'
        [fk_paciente_id, fk_responsavel_id, titulo, tipo_recorrencia, horario_tarefa, repete_ate]
      );

      // @ts-ignore
      return { id: result.insertId, ...dados, status: 'Pendente' };

    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      throw new Error("Falha ao criar tarefa no banco de dados.");
    }
  }

  /**
   * (M) MODEL: Busca todas as tarefas ativas de um paciente.
   */
  static async buscarTodasPorPaciente(pacienteId: number): Promise<any[]> {
    try {
      const [rows] = await pool.query(
        `SELECT
          id, titulo, status, tipo_recorrencia, horario_tarefa, repete_ate, fk_responsavel_id
         FROM tarefas
         WHERE fk_paciente_id = ?
         ORDER BY repete_ate DESC, horario_tarefa DESC;`,
        [pacienteId]
      );
      
      // @ts-ignore
      return rows;
      
    } catch (error) {
      console.error("Erro ao buscar tarefas por paciente:", error);
      return [];
    }
  }

  /**
   * (M) MODEL: Busca a próxima consulta agendada, considerando a recorrência.
   */
  static async buscarProximaConsulta(pacienteId: number): Promise<IProximaConsultaData | null> {
    try {
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
          AND titulo LIKE '%consulta%' 
          AND status = 'Pendente'
          AND (repete_ate IS NULL OR repete_ate >= CURRENT_DATE());
        `,
        [pacienteId]
      );

      // @ts-ignore
      const tarefasRecorrentes: ITarefaRecorrente[] = rows; 

      let proximo: { data: Date; item: ITarefaRecorrente } | null = null;
      const agora = new Date();

      for (const item of tarefasRecorrentes) {
        const { data, horario } = calcularProximaOcorrencia(agora, item.horario_tarefa, item.tipo_recorrencia);
        
        if (data) {
            const dataOcorrencia = parseISO(`${data}T${horario}`);
            
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
          titulo: proximo.item.titulo,
          horario_tarefa: format(proximo.data, 'HH:mm:ss'),
          repete_ate: format(proximo.data, 'yyyy-MM-dd'),
        };
      }
      
      return null;
      
    } catch (error) {
      console.error("Erro ao buscar próxima consulta:", error);
      return null;
    }
  }
  
  /**
   * (M) MODEL: Busca todas as tarefas (recorrentes e únicas) ativas em uma data específica.
   */
  static async buscarTarefasAtivasPorData(pacienteId: number, dataISO: string): Promise<any[]> {
    try {
      const dataBuscada = parseISO(dataISO);
      
      // 1. Busca todas as tarefas ATIVAS (status Pendente ou Atrasada) que tem data de término futura.
      // 💡 CORREÇÃO APLICADA AQUI: Desestruturação para [rows]
      const [rows] = await pool.query(
        `SELECT
          id, titulo, status, horario_tarefa, repete_ate, tipo_recorrencia
        FROM
          tarefas
        WHERE
          fk_paciente_id = ?
          AND status IN ('Pendente', 'Atrasada')
          AND (repete_ate IS NULL OR repete_ate >= ?); 
        `,
        [pacienteId, dataISO]
      );

      // Garantir que rows é um array antes de usar .filter()
      const tarefasAtivas: any[] = Array.isArray(rows) ? rows : [];

      const tarefasDoDia = tarefasAtivas.filter((tarefa: any) => {
        const recorrencia = tarefa.tipo_recorrencia;
        const dataFim = tarefa.repete_ate ? parseISO(tarefa.repete_ate) : null;
        
        if (recorrencia === 'Única') {
          if (tarefa.repete_ate === dataISO) {
            return true;
          }
        } else {
          if (dataFim && dataBuscada > dataFim) {
              return false;
          }

          if (recorrencia === 'Diária') return true;

          if (recorrencia === 'Semanal') {
            const diaDaSemanaTarefa = parseISO(tarefa.repete_ate || dataISO).getDay();
            const diaDaSemanaBuscado = dataBuscada.getDay();
            return diaDaSemanaTarefa === diaDaSemanaBuscado;
          }

          if (recorrencia === 'Mensal') {
            const diaDoMesTarefa = parseISO(tarefa.repete_ate || dataISO).getDate();
            const diaDoMesBuscado = dataBuscada.getDate();
            return diaDoMesTarefa === diaDoMesBuscado;
          }
        }

        return false;
      });

      return tarefasDoDia;

    } catch (error) {
      console.error("Erro ao buscar tarefas por data:", error);
      return [];
    }
  }
}