// Este objeto nos ajuda a traduzir os nomes dos meses
const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

/**
 * Verifica se uma data é "Hoje"
 */
const isHoje = (data: Date): boolean => {
  const hoje = new Date();
  return data.getDate() === hoje.getDate() &&
         data.getMonth() === hoje.getMonth() &&
         data.getFullYear() === hoje.getFullYear();
};

/**
 * Verifica se uma data é "Amanhã"
 */
const isAmanha = (data: Date): boolean => {
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  return data.getDate() === amanha.getDate() &&
         data.getMonth() === amanha.getMonth() &&
         data.getFullYear() === amanha.getFullYear();
};

/**
 * Verifica se uma data é "Ontem"
 */
const isOntem = (data: Date): boolean => {
  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);
  return data.getDate() === ontem.getDate() &&
         data.getMonth() === ontem.getMonth() &&
         data.getFullYear() === ontem.getFullYear();
};

/**
 * Formata a data para um texto amigável, como "Hoje, 04 de Novembro"
 */
export const formatarDataAmigavel = (data: Date): string => {
  if (isHoje(data)) {
    return `Hoje, ${data.getDate()} de ${meses[data.getMonth()]}`;
  }
  if (isAmanha(data)) {
    return `Amanhã, ${data.getDate()} de ${meses[data.getMonth()]}`;
  }
  if (isOntem(data)) {
    return `Ontem, ${data.getDate()} de ${meses[data.getMonth()]}`;
  }
  
  // Para qualquer outra data
  return `${data.getDate()} de ${meses[data.getMonth()]} de ${data.getFullYear()}`;
};

/**
 * Retorna uma nova data com um dia adicionado
 */
export const adicionarDia = (data: Date): Date => {
  const novaData = new Date(data);
  novaData.setDate(novaData.getDate() + 1);
  return novaData;
};

/**
 * Retorna uma nova data com um dia subtraído
 */
export const subtrairDia = (data: Date): Date => {
  const novaData = new Date(data);
  novaData.setDate(novaData.getDate() - 1);
  return novaData;
};

/**
 * Converte uma string no formato "yyyy-MM-dd" para Date (timezone local).
 * Retorna null se a string for inválida.
 */
export const parseDateISO = (iso: string): Date | null => {
  if (!iso || typeof iso !== 'string') return null;
  const parts = iso.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  const [y, m, d] = parts;
  return new Date(y, m - 1, d);
};