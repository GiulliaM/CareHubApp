// back-end/src/utils/recorrencia.ts
import { addDays, addWeeks, addMonths, isPast, parseISO, format } from 'date-fns';

/**
 * Calcula a próxima data e horário de ocorrência de uma tarefa recorrente.
 * @param dataAtual Data de referência (hoje).
 * @param horario Horário da tarefa (HH:mm:ss).
 * @param recorrencia Tipo de recorrência ('Única', 'Diária', 'Semanal', 'Mensal').
 * @returns {data: string, horario: string} Próxima data e hora (YYYY-MM-DD, HH:mm:ss).
 */
export function calcularProximaOcorrencia(
  dataAtual: Date,
  horario: string,
  recorrencia: 'Única' | 'Diária' | 'Semanal' | 'Mensal' | string
): { data: string; horario: string } {

  const [h, m, s] = horario.split(':').map(Number);
  
  // Cria um objeto Date combinando a data atual e o horário da tarefa
  let proximaOcorrencia = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate(), h, m, s || 0);
  
  // 1. Se o evento na data de hoje já passou, avançamos para o próximo ciclo.
  if (isPast(proximaOcorrencia)) {
    switch (recorrencia) {
      case 'Diária':
        proximaOcorrencia = addDays(proximaOcorrencia, 1);
        break;
      case 'Semanal':
        proximaOcorrencia = addWeeks(proximaOcorrencia, 1);
        break;
      case 'Mensal':
        proximaOcorrencia = addMonths(proximaOcorrencia, 1);
        break;
      case 'Única':
      default:
        // Tarefas únicas ou não recorrentes que passaram não têm próxima ocorrência
        return { data: '', horario: '' };
    }
  }

  // 2. Formata o resultado
  return {
    data: format(proximaOcorrencia, 'yyyy-MM-dd'),
    horario: format(proximaOcorrencia, 'HH:mm:ss')
  };
}