/**
 * Utilitários para agendamento inteligente de medicamentos
 */

/**
 * Gera lista de horários com base em um horário inicial e intervalo
 * @param startTime - Horário inicial no formato "HH:MM" (ex: "12:00")
 * @param intervalHours - Intervalo em horas (4, 6, 8 ou 12)
 * @returns Array de horários no formato "HH:MM"
 * 
 * Exemplo:
 * generateScheduleTimes("12:00", 8) => ["12:00", "20:00", "04:00"]
 */
export function generateScheduleTimes(
  startTime: string,
  intervalHours: number
): string[] {
  // Validação de entrada
  if (!startTime || !intervalHours) return [];
  if (![4, 6, 8, 12].includes(intervalHours)) {
    throw new Error('Intervalo deve ser 4, 6, 8 ou 12 horas');
  }

  // Parse do horário inicial
  const [hours, minutes] = startTime.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error('Horário inicial inválido. Use formato HH:MM');
  }

  // Calcular quantidade de doses em 24h
  const dosesPerDay = 24 / intervalHours;
  const schedules: string[] = [];

  // Gerar horários
  for (let i = 0; i < dosesPerDay; i++) {
    const totalMinutes = hours * 60 + minutes + i * intervalHours * 60;
    const finalHours = Math.floor(totalMinutes / 60) % 24;
    const finalMinutes = totalMinutes % 60;

    const timeString = `${String(finalHours).padStart(2, '0')}:${String(
      finalMinutes
    ).padStart(2, '0')}`;
    schedules.push(timeString);
  }

  return schedules;
}

/**
 * Verifica se um medicamento está ativo em uma determinada data
 * @param medicamento - Objeto do medicamento
 * @param targetDate - Data para verificar (Date object)
 * @returns true se o medicamento está ativo nesta data
 */
export function isMedicamentoAtivoNaData(
  medicamento: any,
  targetDate: Date
): boolean {
  const inicio = new Date(medicamento.inicio);
  inicio.setHours(0, 0, 0, 0);
  
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  // Verifica se a data alvo é >= data de início
  if (target < inicio) return false;

  // Se for uso contínuo, está ativo
  if (medicamento.uso_continuo) return true;

  // Se tiver data_fim, verifica se está dentro do período
  if (medicamento.data_fim) {
    const fim = new Date(medicamento.data_fim);
    fim.setHours(23, 59, 59, 999);
    return target <= fim;
  }

  // Se tiver duracao_days, calcula a data final
  if (medicamento.duracao_days) {
    const fimCalculado = new Date(inicio);
    fimCalculado.setDate(fimCalculado.getDate() + medicamento.duracao_days);
    fimCalculado.setHours(23, 59, 59, 999);
    return target <= fimCalculado;
  }

  return false;
}

/**
 * Verifica se um medicamento deve ser tomado em um dia da semana específico
 * @param medicamento - Objeto do medicamento
 * @param targetDate - Data para verificar
 * @returns true se deve ser tomado neste dia da semana
 */
export function isMedicamentoValidoNoDiaSemana(
  medicamento: any,
  targetDate: Date
): boolean {
  // Se não tiver restrição de dias da semana, é válido para todos os dias
  if (!medicamento.dias_semana) return true;

  const diaSemanaTarget = targetDate.getDay(); // 0 = Domingo, 6 = Sábado
  const diasPermitidos = medicamento.dias_semana
    .split(',')
    .map((d: string) => parseInt(d.trim()));

  return diasPermitidos.includes(diaSemanaTarget);
}

/**
 * Obtém todos os horários de medicamentos ativos para uma data específica
 * @param medicamentos - Array de medicamentos
 * @param targetDate - Data alvo (padrão: hoje)
 * @returns Array de objetos com medicamento e seus horários do dia
 */
export function getMedicamentosParaData(
  medicamentos: any[],
  targetDate: Date = new Date()
): Array<{ medicamento: any; horarios: string[] }> {
  return medicamentos
    .filter(
      (med) =>
        isMedicamentoAtivoNaData(med, targetDate) &&
        isMedicamentoValidoNoDiaSemana(med, targetDate)
    )
    .map((med) => ({
      medicamento: med,
      horarios: Array.isArray(med.horarios) ? med.horarios : [],
    }));
}

/**
 * Formata intervalo de horas para exibição amigável
 * @param intervalHours - Intervalo em horas (4, 6, 8, 12)
 * @returns String formatada (ex: "8/8 horas")
 */
export function formatarIntervalo(intervalHours: number): string {
  return `${intervalHours}/${intervalHours} horas`;
}

/**
 * Obtém descrição da quantidade de doses por dia
 * @param intervalHours - Intervalo em horas
 * @returns Descrição (ex: "3 doses por dia")
 */
export function getDescricaoDoses(intervalHours: number): string {
  const doses = 24 / intervalHours;
  return `${doses} ${doses === 1 ? 'dose' : 'doses'} por dia`;
}

/**
 * Valida se um horário está no formato correto
 * @param time - Horário no formato "HH:MM"
 * @returns true se válido
 */
export function isHorarioValido(time: string): boolean {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(time);
}

/**
 * Opções de intervalos disponíveis
 */
export const INTERVALOS_DISPONIVEIS = [
  { horas: 4, label: '4/4 horas', doses: 6 },
  { horas: 6, label: '6/6 horas', doses: 4 },
  { horas: 8, label: '8/8 horas', doses: 3 },
  { horas: 12, label: '12/12 horas', doses: 2 },
];
