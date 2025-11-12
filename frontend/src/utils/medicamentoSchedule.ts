/**
 * Utilitários para agendamento inteligente de medicamentos
 */

/**
 * Gera uma lista de horários baseado em um horário inicial e intervalo
 * @param startTime - Horário inicial no formato "HH:mm" (ex: "08:00")
 * @param intervalHours - Intervalo em horas (4, 6, 8 ou 12)
 * @returns Array de horários no formato "HH:mm"
 */
export function generateScheduleTimes(
  startTime: string,
  intervalHours: number
): string[] {
  const horarios: string[] = [];
  const [startHour, startMinute] = startTime.split(":").map(Number);

  // Calcular quantas doses cabem em 24h
  const numDoses = 24 / intervalHours;

  for (let i = 0; i < numDoses; i++) {
    const totalMinutes = startHour * 60 + startMinute + i * intervalHours * 60;
    const hour = Math.floor(totalMinutes / 60) % 24;
    const minute = totalMinutes % 60;

    const formattedTime = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
    horarios.push(formattedTime);
  }

  return horarios;
}

/**
 * Verifica se um medicamento está ativo em uma data específica
 * @param medicamento - Objeto do medicamento
 * @param dataVerificar - Data para verificar (formato YYYY-MM-DD ou Date)
 * @returns true se o medicamento está ativo na data
 */
export function isActiveMedication(
  medicamento: any,
  dataVerificar: string | Date = new Date()
): boolean {
  const dataCheck =
    typeof dataVerificar === "string"
      ? new Date(dataVerificar)
      : dataVerificar;

  const dataInicio = new Date(medicamento.inicio);

  // Se ainda não começou
  if (dataCheck < dataInicio) return false;

  // Se é uso contínuo, está sempre ativo após início
  if (medicamento.uso_continuo) return true;

  // Se tem data de fim, verificar se ainda não passou
  if (medicamento.data_fim) {
    const dataFim = new Date(medicamento.data_fim);
    return dataCheck <= dataFim;
  }

  // Se tem duração em dias
  if (medicamento.duracao_days) {
    const dataFim = new Date(dataInicio);
    dataFim.setDate(dataFim.getDate() + medicamento.duracao_days);
    return dataCheck <= dataFim;
  }

  return true;
}

/**
 * Filtra medicamentos ativos para um dia específico
 * @param medicamentos - Array de medicamentos
 * @param data - Data para filtrar (formato YYYY-MM-DD ou Date)
 * @returns Array de medicamentos ativos
 */
export function getActiveMedicationsForDate(
  medicamentos: any[],
  data: string | Date = new Date()
): any[] {
  return medicamentos.filter((med) => isActiveMedication(med, data));
}

/**
 * Verifica se o medicamento deve aparecer em um dia da semana específico
 * @param medicamento - Objeto do medicamento
 * @param diaSemana - Número do dia (0 = domingo, 6 = sábado)
 * @returns true se o medicamento deve aparecer nesse dia
 */
export function shouldShowOnWeekday(
  medicamento: any,
  diaSemana: number
): boolean {
  // Se não tem dias_semana definido, mostrar todos os dias
  if (!medicamento.dias_semana) return true;

  const diasArray = medicamento.dias_semana
    .split(",")
    .map((d: string) => parseInt(d.trim()));
  return diasArray.includes(diaSemana);
}

/**
 * Obtém os horários do medicamento (parseia JSON ou string)
 * @param medicamento - Objeto do medicamento
 * @returns Array de horários no formato "HH:mm"
 */
export function getMedicamentoHorarios(medicamento: any): string[] {
  if (!medicamento.horarios) return [];

  // Se já é array
  if (Array.isArray(medicamento.horarios)) {
    return medicamento.horarios;
  }

  // Se é string JSON
  if (typeof medicamento.horarios === "string") {
    try {
      const parsed = JSON.parse(medicamento.horarios);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // Se não é JSON, pode ser string separada por vírgula (fallback)
      return medicamento.horarios.split(",").map((h: string) => h.trim());
    }
  }

  return [];
}

/**
 * Formata array de horários para salvar no banco
 * @param horarios - Array de horários
 * @returns String JSON para salvar
 */
export function formatHorariosForDB(horarios: string[]): string {
  return JSON.stringify(horarios);
}

/**
 * Opções de intervalo disponíveis
 */
export const INTERVAL_OPTIONS = [
  { value: 4, label: "4/4 horas", doses: 6 },
  { value: 6, label: "6/6 horas", doses: 4 },
  { value: 8, label: "8/8 horas", doses: 3 },
  { value: 12, label: "12/12 horas", doses: 2 },
];

/**
 * Dias da semana para seleção
 */
export const DIAS_SEMANA = [
  { value: 0, label: "Dom", fullLabel: "Domingo" },
  { value: 1, label: "Seg", fullLabel: "Segunda-feira" },
  { value: 2, label: "Ter", fullLabel: "Terça-feira" },
  { value: 3, label: "Qua", fullLabel: "Quarta-feira" },
  { value: 4, label: "Qui", fullLabel: "Quinta-feira" },
  { value: 5, label: "Sex", fullLabel: "Sexta-feira" },
  { value: 6, label: "Sáb", fullLabel: "Sábado" },
];
