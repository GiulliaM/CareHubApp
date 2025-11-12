import { useState } from 'react';
import { generateScheduleTimes } from '../utils/medicamentoSchedule';

/**
 * Custom Hook para gerenciar o agendamento de medicamentos
 * Segue exatamente a Feature Spec: Recurring Medication Schedule Generator
 */
export function useMedicamentoSchedule(initialTimes: string[] = []) {
  // State para armazenar os horários gerados/editados pelo usuário
  const [generatedTimes, setGeneratedTimes] = useState<string[]>(initialTimes);

  /**
   * AC #4: Quando o usuário seleciona um intervalo, gera os horários automaticamente
   * @param startTime - Horário inicial (ex: "12:00")
   * @param interval - Intervalo em horas (4, 6, 8, 12)
   */
  function handleSelectInterval(startTime: string, interval: number): void {
    // Gera os horários usando a função core
    const times = generateScheduleTimes(startTime, interval);
    
    // Atualiza o estado com os horários gerados
    setGeneratedTimes(times);
  }

  /**
   * AC #8: Permite ao usuário editar manualmente um horário específico
   * Exemplo: Mudar "04:00" para "04:30"
   * @param index - Índice do horário na lista
   * @param newTime - Novo horário no formato "HH:mm"
   */
  function handleEditTime(index: number, newTime: string): void {
    // Validação básica do formato
    if (!newTime.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      console.warn('Formato de horário inválido. Use HH:mm');
      return;
    }

    setGeneratedTimes((prevTimes) => {
      const newTimes = [...prevTimes];
      newTimes[index] = newTime;
      // Opcional: ordenar os horários após edição
      return newTimes.sort();
    });
  }

  /**
   * AC #8: Permite ao usuário remover um horário da lista
   * Exemplo: Remover "20:00" clicando no "X"
   * @param index - Índice do horário a ser removido
   */
  function handleRemoveTime(index: number): void {
    setGeneratedTimes((prevTimes) => prevTimes.filter((_, i) => i !== index));
  }

  /**
   * Adiciona um novo horário manualmente à lista
   * @param newTime - Horário a ser adicionado no formato "HH:mm"
   */
  function handleAddTime(newTime: string): void {
    if (!newTime.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      console.warn('Formato de horário inválido. Use HH:mm');
      return;
    }

    setGeneratedTimes((prevTimes) => {
      // Evitar duplicatas
      if (prevTimes.includes(newTime)) {
        return prevTimes;
      }
      // Adicionar e ordenar
      return [...prevTimes, newTime].sort();
    });
  }

  /**
   * Reseta os horários para um array vazio
   */
  function handleResetTimes(): void {
    setGeneratedTimes([]);
  }

  /**
   * Define os horários manualmente (útil ao carregar dados salvos)
   */
  function setTimes(times: string[]): void {
    setGeneratedTimes(times);
  }

  return {
    // Estado principal
    generatedTimes,
    
    // Handlers conforme a spec
    handleSelectInterval,
    handleEditTime,
    handleRemoveTime,
    
    // Handlers extras úteis
    handleAddTime,
    handleResetTimes,
    setTimes,
  };
}
