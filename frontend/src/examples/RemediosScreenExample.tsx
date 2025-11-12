/**
 * EXEMPLO DE USO - Tela "Remédios" (Main Screen)
 * 
 * Este exemplo mostra como a tela principal calcula dinamicamente
 * as doses do dia sem sobrecarregar o banco de dados.
 * 
 * Conforme especificado na Feature Spec, seção:
 * "How the Main Screen ('Remédios') Will Use This Data"
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  getActiveMedicationsForDate,
  getMedicamentoHorarios,
} from '../utils/medicamentoSchedule';
import api from '../config/api';

interface Medicamento {
  medicamento_id: number;
  nome: string;
  dosagem: string;
  horarios: string; // JSON string: '["12:00", "20:00", "04:00"]'
  inicio: string; // "2025-11-12"
  data_fim: string | null; // "2025-11-20" or null
  uso_continuo: number; // 1 or 0
  tipo_agendamento: 'manual' | 'intervalo';
  intervalo_horas: number | null;
}

interface DoseItem {
  medicamento_id: number;
  nome: string;
  dosagem: string;
  horario: string;
  tomado: boolean;
}

export default function RemediosScreenExample() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [dosesDeHoje, setDosesDeHoje] = useState<DoseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarMedicamentosECalcularDoses();
  }, []);

  /**
   * SPEC: "The main 'Remédios' screen will execute this logic:"
   * 
   * 1. Fetch all medications where dataInicio <= today 
   *    AND (tipoDuracao == 'continuo' OR dataFim >= today)
   * 2. For each active medication, get its horarios array
   * 3. Display these times on the screen for the current day
   */
  const carregarMedicamentosECalcularDoses = async () => {
    try {
      setLoading(true);

      // Buscar todos os medicamentos do paciente
      const response = await api.get('/medicamentos', {
        params: { paciente_id: 1 }, // Ajustar conforme necessário
      });

      const todosMedicamentos: Medicamento[] = response.data;

      // ====== STEP 1: Filter active medications for today ======
      const hoje = new Date();
      const medicamentosAtivos = getActiveMedicationsForDate(
        todosMedicamentos,
        hoje
      );

      setMedicamentos(medicamentosAtivos);

      // ====== STEP 2 & 3: Get horarios array and create doses list ======
      const doses: DoseItem[] = [];

      medicamentosAtivos.forEach((med) => {
        // Parse horarios (pode ser JSON string ou array)
        const horarios = getMedicamentoHorarios(med);

        // Para cada horário, criar um item de dose
        horarios.forEach((horario) => {
          doses.push({
            medicamento_id: med.medicamento_id,
            nome: med.nome,
            dosagem: med.dosagem,
            horario: horario,
            tomado: false, // TODO: Verificar se já foi tomado
          });
        });
      });

      // Ordenar doses por horário
      doses.sort((a, b) => a.horario.localeCompare(b.horario));

      setDosesDeHoje(doses);
    } catch (error) {
      console.error('Erro ao carregar medicamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Marca uma dose como tomada
   */
  const marcarComoTomado = (medicamentoId: number, horario: string) => {
    setDosesDeHoje((prevDoses) =>
      prevDoses.map((dose) =>
        dose.medicamento_id === medicamentoId && dose.horario === horario
          ? { ...dose, tomado: !dose.tomado }
          : dose
      )
    );

    // TODO: Salvar no backend que a dose foi tomada
    // Pode ser uma tabela separada: medicamentos_tomados
  };

  const renderDoseItem = ({ item }: { item: DoseItem }) => (
    <TouchableOpacity
      style={[styles.doseCard, item.tomado && styles.doseCardTomado]}
      onPress={() => marcarComoTomado(item.medicamento_id, item.horario)}
    >
      <View style={styles.doseInfo}>
        <Text style={styles.horarioText}>{item.horario}</Text>
        <Text style={styles.nomeMedicamento}>{item.nome}</Text>
        <Text style={styles.dosagemText}>{item.dosagem}</Text>
      </View>
      <View style={styles.statusContainer}>
        {item.tomado ? (
          <Text style={styles.checkIcon}>✓</Text>
        ) : (
          <View style={styles.uncheckedCircle} />
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando medicamentos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header com data de hoje */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medicamentos</Text>
        <Text style={styles.headerSubtitle}>
          Hoje • {new Date().toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
          })}
        </Text>
      </View>

      {/* Estatísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{dosesDeHoje.length}</Text>
          <Text style={styles.statLabel}>Doses hoje</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {dosesDeHoje.filter((d) => d.tomado).length}
          </Text>
          <Text style={styles.statLabel}>Tomadas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{medicamentos.length}</Text>
          <Text style={styles.statLabel}>Medicamentos ativos</Text>
        </View>
      </View>

      {/* ====== Lista de doses calculadas dinamicamente ====== */}
      {dosesDeHoje.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhum medicamento para hoje! 🎉
          </Text>
        </View>
      ) : (
        <FlatList
          data={dosesDeHoje}
          renderItem={renderDoseItem}
          keyExtractor={(item, index) =>
            `${item.medicamento_id}-${item.horario}-${index}`
          }
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Informação sobre a estratégia */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          ℹ️ Esta lista é calculada dinamicamente.{'\n'}
          Não salvamos doses individuais no banco!{'\n'}
          Performance: ⚡ Zero sobrecarga
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  doseCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doseCardTomado: {
    backgroundColor: '#E8F5E9',
    opacity: 0.7,
  },
  doseInfo: {
    flex: 1,
  },
  horarioText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  nomeMedicamento: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  dosagemText: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    fontSize: 32,
    color: '#34C759',
  },
  uncheckedCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  infoBox: {
    margin: 16,
    padding: 12,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  infoText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
  },
});
