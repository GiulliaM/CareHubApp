/**
 * EXEMPLO DE USO - Tela "Novo Medicamento"
 * 
 * Este exemplo segue EXATAMENTE a Feature Spec:
 * "Recurring Medication Schedule Generator"
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import IntervalModal from '../components/IntervalModal';
import HorariosList from '../components/HorariosList';
import { useMedicamentoSchedule } from '../hooks/useMedicamentoSchedule';
import { formatHorariosForDB } from '../utils/medicamentoSchedule';
import api from '../config/api';

export default function NovoMedicamentoExample() {
  // ====== AC #3: Prerequisite - User must select startTime first ======
  const [startTime, setStartTime] = useState('12:00');
  const [showTimePicker, setShowTimePicker] = useState(false);

  // ====== AC #1: Modal para seleção de intervalo ======
  const [showIntervalModal, setShowIntervalModal] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState<number | null>(null);

  // ====== AC #6 & #7: State Management & Display ======
  // Usando o custom hook que implementa os handlers da spec
  const {
    generatedTimes,
    handleSelectInterval,
    handleEditTime,
    handleRemoveTime,
  } = useMedicamentoSchedule();

  // ====== Dados do medicamento ======
  const [nome, setNome] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [dataInicio, setDataInicio] = useState(new Date());
  const [tipoDuracao, setTipoDuracao] = useState<'continuo' | 'dataFixa'>('continuo');
  const [dataFim, setDataFim] = useState<Date | null>(null);
  const [pacienteId, setPacienteId] = useState(1);

  /**
   * AC #4: Core Logic - Quando usuário seleciona intervalo
   */
  const handleIntervalSelect = (interval: number) => {
    setSelectedInterval(interval);
    
    // AC #4: Calls generateScheduleTimes immediately
    handleSelectInterval(startTime, interval);
    
    setShowIntervalModal(false);
  };

  /**
   * AC #9: Save to Database - The Core Problem Solution
   * Salvamos apenas o PADRÃO recorrente, não doses individuais
   */
  const handleSalvarMedicamento = async () => {
    if (!nome || generatedTimes.length === 0) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    // ====== Data Model conforme especificado ======
    const medicamento = {
      nome,
      dosagem,
      paciente_id: pacienteId,
      
      // AC #8: Esta é a lista modificada pelo usuário
      horarios: formatHorariosForDB(generatedTimes), // ["12:00", "04:30"]
      
      // Campos do modelo de dados
      inicio: dataInicio.toISOString().split('T')[0], // "2025-11-12"
      tipo_agendamento: selectedInterval ? 'intervalo' : 'manual',
      intervalo_horas: selectedInterval,
      
      // AC #10: tipoDuracao & dataFim
      uso_continuo: tipoDuracao === 'continuo' ? 1 : 0,
      data_fim: tipoDuracao === 'dataFixa' ? dataFim?.toISOString().split('T')[0] : null,
    };

    try {
      await api.post('/medicamentos', medicamento);
      Alert.alert('Sucesso', 'Medicamento cadastrado!');
      // navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar o medicamento');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Novo Medicamento</Text>

      {/* Nome e Dosagem (simplificado) */}
      {/* ... TextInputs ... */}

      {/* ====== AC #3: Prerequisite - Select Start Time ====== */}
      <Text style={styles.label}>Horário de Início</Text>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.timeText}>{startTime}</Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={new Date(`2000-01-01T${startTime}`)}
          mode="time"
          is24Hour={true}
          onChange={(event, date) => {
            setShowTimePicker(false);
            if (date) {
              const hours = date.getHours().toString().padStart(2, '0');
              const minutes = date.getMinutes().toString().padStart(2, '0');
              setStartTime(`${hours}:${minutes}`);
            }
          }}
        />
      )}

      {/* ====== AC #1: Trigger - "Use Intervals" Button ====== */}
      <TouchableOpacity
        style={styles.intervalButton}
        onPress={() => setShowIntervalModal(true)}
      >
        <Text style={styles.intervalButtonText}>
          {selectedInterval
            ? `🕐 Intervalo: ${selectedInterval}/${selectedInterval}h`
            : '🕐 Usar Intervalos'}
        </Text>
      </TouchableOpacity>

      {/* ====== AC #2: Modal with interval options ====== */}
      <IntervalModal
        visible={showIntervalModal}
        onClose={() => setShowIntervalModal(false)}
        onSelect={handleIntervalSelect}
      />

      {/* ====== AC #7: Display Generated Times ====== */}
      {/* ====== AC #8: Manual Override (Edit/Delete) ====== */}
      {generatedTimes.length > 0 && (
        <View style={styles.generatedSection}>
          <Text style={styles.sectionTitle}>Horários Gerados:</Text>
          <HorariosList
            horarios={generatedTimes}
            onChange={(newTimes) => {
              // O HorariosList já implementa edit/remove internamente
              // Mas podemos usar nossos handlers também:
              // handleEditTime(index, newTime)
              // handleRemoveTime(index)
            }}
            editable={true}
          />
        </View>
      )}

      {/* ====== AC #10: Duration Type ====== */}
      <Text style={styles.label}>Duração</Text>
      <View style={styles.durationContainer}>
        <TouchableOpacity
          style={[
            styles.durationButton,
            tipoDuracao === 'continuo' && styles.durationButtonActive,
          ]}
          onPress={() => setTipoDuracao('continuo')}
        >
          <Text
            style={[
              styles.durationText,
              tipoDuracao === 'continuo' && styles.durationTextActive,
            ]}
          >
            Uso Contínuo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.durationButton,
            tipoDuracao === 'dataFixa' && styles.durationButtonActive,
          ]}
          onPress={() => setTipoDuracao('dataFixa')}
        >
          <Text
            style={[
              styles.durationText,
              tipoDuracao === 'dataFixa' && styles.durationTextActive,
            ]}
          >
            Data de Término
          </Text>
        </TouchableOpacity>
      </View>

      {/* Se não é uso contínuo, mostrar DatePicker */}
      {tipoDuracao === 'dataFixa' && (
        <View>
          <Text style={styles.label}>Data de Término</Text>
          {/* DatePicker aqui */}
        </View>
      )}

      {/* Botão Salvar */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSalvarMedicamento}
      >
        <Text style={styles.saveButtonText}>Salvar Medicamento</Text>
      </TouchableOpacity>

      {/* ====== EXPLICAÇÃO: Como a tela principal usa estes dados ====== */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ Como funciona:</Text>
        <Text style={styles.infoText}>
          1. Geramos horários: {JSON.stringify(generatedTimes)}{'\n'}
          2. Salvamos apenas este PADRÃO no banco{'\n'}
          3. A tela "Remédios" calcula dinamicamente:{'\n'}
          {'   '}- Busca medicamentos ativos hoje{'\n'}
          {'   '}- Exibe os horários salvos{'\n'}
          {'   '}- SEM criar registros infinitos! ✅
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  timeButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
  },
  intervalButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  intervalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  generatedSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  durationContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  durationButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  durationButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#E8F4FF',
  },
  durationText: {
    fontSize: 14,
    color: '#666',
  },
  durationTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  infoBox: {
    marginTop: 30,
    padding: 16,
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#333',
  },
});
