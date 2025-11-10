// HomeTela.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle, 
  TextStyle,
} from 'react-native';
import {
  Pill,
  Smile,
  PlusCircle,
  Stethoscope,
  AlertTriangle, 
  Clock,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { cores } from '../constantes/cores';
// 💡 Mantenha esta linha se você tem o arquivo de estilos separado, mas use a definição abaixo para compilar:
// import { styles } from '../style/homeStyle'; 
import { IDadosDashboard, initialDashboardData, IRegistroResumo } from '../tipos/IDadosDashboard'; 

const API_URL = 'http://54.39.173.152:3000'; 

// --- FUNÇÃO DE FETCH ---
async function fetchDashboardData(pacienteId: number): Promise<IDadosDashboard> {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const res = await fetch(`${API_URL}/api/dashboard/${pacienteId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
        throw new Error(`Falha ao buscar dados: ${errorBody.message || `HTTP ${res.status}`}`);
    }
    return (await res.json()) as IDadosDashboard;
  } catch (e) {
    console.warn('Falha ao buscar dashboard:', e);
    return initialDashboardData; 
  }
}

// --- PEÇAS DA UI ---

// 💡 CORREÇÃO: Usando React.ReactNode em vez de JSX.Element para compatibilidade.
const ResumoItem = ({ icon, titulo, subtitulo, data }: { icon: React.ReactNode; titulo: string; subtitulo?: string; data?: string; }) => (
    <View style={styles.resumoItemContainer}>
        <View style={styles.resumoItemIcon}>{icon}</View>
        <View style={styles.resumoItemContent}>
            <Text style={styles.resumoItemTitle}>{titulo}</Text>
            {subtitulo && <Text style={styles.resumoItemSubTitle}>{subtitulo}</Text>}
        </View>
        {data && <Text style={styles.resumoItemDate}>{data}</Text>}
    </View>
);

const SummaryCard = ({ title, count }: { title: string; count: number | string }) => (
    <View style={styles.summaryCard}>
        <Text style={styles.summaryCardTitle}>{title}</Text>
        <Text style={styles.summaryCardCount}>{count}</Text>
    </View>
);

const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity>
            <Text style={styles.sectionAction}>Ver todos</Text>
        </TouchableOpacity>
    </View>
);

const EmptyStateCard = () => (
    <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>Nenhum item encontrado.</Text>
    </View>
);

// --- Componente Principal ---
export const HomeTela = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pacienteId, setPacienteId] = useState<number | null>(null); 
  const [dashboardData, setDashboardData] = useState<IDadosDashboard>(initialDashboardData);

  // Carregar ID do paciente (Mock)
  useEffect(() => {
    async function loadPacienteId() {
      // Usar o ID do paciente ativo que você definiu na sua autenticação
      const id = await AsyncStorage.getItem('pacienteIdAtivo'); 
      if (id) {
        setPacienteId(parseInt(id, 10));
      } else {
        setPacienteId(1); // Mock para desenvolvimento
      }
    }
    loadPacienteId();
  }, []);

  // Fetch dos dados do Dashboard
  useEffect(() => {
    if (pacienteId) {
      setLoading(true);
      setError(null);
      fetchDashboardData(pacienteId)
        .then(data => setDashboardData(data))
        .catch(e => {
             setError('Falha ao carregar o Dashboard. Verifique sua conexão ou servidor.');
             setDashboardData(initialDashboardData);
        })
        .finally(() => setLoading(false));
    }
  }, [pacienteId]);
  
  // Lógica de Memoização para Cuidados (inclui medicamento e consulta)
  const proximosCuidados = useMemo(() => {
    const cuidados: { tipo: 'remedio' | 'consulta'; titulo: string; subtitulo: string }[] = [];
    
    // 1. Adiciona Próximo Medicamento
    if (dashboardData.proximoMedicamento) {
      cuidados.push({
        tipo: 'remedio',
        titulo: dashboardData.proximoMedicamento.nome,
        subtitulo: `Horário: ${dashboardData.proximoMedicamento.horario}`,
      });
    }

    // 2. Adiciona Próxima Consulta
    if (dashboardData.proximaConsulta) { 
        cuidados.push({
            tipo: 'consulta',
            titulo: dashboardData.proximaConsulta.nome,
            subtitulo: `Agendado: ${dashboardData.proximaConsulta.horario}`,
        });
    }

    return cuidados;
  }, [dashboardData.proximoMedicamento, dashboardData.proximaConsulta]);


  // Lógica de Memoização para Registros
  const ultimosRegistros = useMemo<IRegistroResumo[]>(() => {
    return dashboardData.atividadesRecentes || [];
  }, [dashboardData.atividadesRecentes]);

  return (
    <ScrollView style={styles.container}>
        
        {/* ----- HEADER & PERFIL ----- */}
        <View style={styles.headerContainer}>
            <Text style={styles.welcomeText}>Olá,</Text>
            <Text style={styles.pacienteName}>{dashboardData.perfilPaciente?.nome_paciente || 'Carregando...'}</Text>
            
            <View style={styles.infoRow}>
                <Text style={styles.cuidadorText}>
                    Cuidador Ativo: {dashboardData.cuidadorAtivo.nome || 'Não definido'}
                </Text>
            </View>
        </View>

        {/* ----- SUMMARY CARDS ----- */}
        <View style={styles.summaryCardsRow}>
            <SummaryCard title="Cuidados Agendados" count={proximosCuidados.length} />
            <SummaryCard title="Alertas Pendentes" count={dashboardData.alertasPendentes.total} />
        </View>
        
        {loading && <ActivityIndicator size="large" color={cores.primaria} style={{ marginVertical: 40 }} />}
        
        {error && <Text style={{ color: 'red', textAlign: 'center', margin: 20 }}>{error}</Text>}

        {/* ----- SEÇÃO PRÓXIMOS CUIDADOS ----- */}
        {!loading && !error && (
            <>
                <SectionHeader title="Próximos Cuidados" />
                {proximosCuidados.length > 0 ? (
                    <View style={styles.sectionContent}>
                        {proximosCuidados.map((item, idx) => (
                            <ResumoItem
                                key={idx}
                                icon={item.tipo === 'remedio' 
                                    ? <Pill color={cores.primaria} /> 
                                    : <Stethoscope color={cores.primaria} />
                                }
                                titulo={item.titulo}
                                subtitulo={item.subtitulo}
                            />
                        ))}
                    </View>
                ) : (
                    <EmptyStateCard />
                )}

                {/* ----- SEÇÃO ÚLTIMOS REGISTROS ----- */}
                <SectionHeader title="Últimos Registros do Diário" />
                {ultimosRegistros.length > 0 ? (
                    <View style={styles.sectionContent}>
                        {ultimosRegistros.map((item: IRegistroResumo, idx: number) => (
                            <ResumoItem 
                                key={idx} 
                                // Renderiza ícone de alerta se for "Botão Pânico"
                                icon={item.tipo === 'Botão Pânico' 
                                    ? <AlertTriangle color='red' />
                                    : <Clock color={cores.primaria} />
                                } 
                                titulo={item.titulo} 
                                subtitulo={item.subtitulo} 
                                data={item.data}
                            />
                        ))}
                    </View>
                ) : (
                    <EmptyStateCard />
                )}
            </>
        )}
        
        <View style={{ height: 50 }} />
    </ScrollView>
  );
};


// ----------------------------------------------------
// ⚠️ DEFINIÇÃO DE ESTILOS PARA CORRIGIR OS ERROS 2339
// ----------------------------------------------------
// MANTENHA ESTE BLOCO NO FINAL DO ARQUIVO SE O SEU ../style/homeStyle.ts NÃO ESTIVER FUNCIONANDO
// ISTO GARANTE QUE TODOS OS NOMES DE ESTILO REFERENCIADOS EXISTAM

const styles = StyleSheet.create({
    // Estruturas Principais
    container: { flex: 1, backgroundColor: '#f0f4f7' } as ViewStyle,
    headerContainer: { padding: 20, backgroundColor: cores.branco } as ViewStyle,
    welcomeText: { fontSize: 16, color: cores.secundaria } as TextStyle,
    pacienteName: { fontSize: 24, fontWeight: 'bold', color: cores.preto, marginTop: 4 } as TextStyle,
    infoRow: { marginTop: 10 } as ViewStyle,
    cuidadorText: { fontSize: 14, color: cores.secundaria } as TextStyle,
    summaryCardsRow: { flexDirection: 'row', paddingHorizontal: 10, marginTop: 10 } as ViewStyle,
    sectionContent: { marginHorizontal: 16 } as ViewStyle,
    sectionHeaderContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 20, marginBottom: 10 } as ViewStyle,
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: cores.preto } as TextStyle,
    sectionAction: { color: cores.primaria, fontWeight: 'bold' } as TextStyle,

    // SummaryCard
    summaryCard: { flex: 1, backgroundColor: cores.branco, padding: 15, margin: 5, borderRadius: 12, elevation: 2, alignItems: 'center' } as ViewStyle,
    summaryCardTitle: { fontSize: 13, color: '#666', marginTop: 5, textAlign: 'center' } as TextStyle,
    summaryCardCount: { fontSize: 20, fontWeight: 'bold', color: cores.primaria } as TextStyle,

    // ResumoItem
    resumoItemContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: cores.branco, borderRadius: 8, marginBottom: 8, paddingHorizontal: 10, elevation: 0.5 } as ViewStyle,
    resumoItemIcon: { padding: 10, borderRadius: 50, backgroundColor: cores.primaria + '20', marginRight: 16 } as ViewStyle,
    resumoItemContent: { flex: 1 } as ViewStyle,
    resumoItemTitle: { fontSize: 15, fontWeight: 'bold', color: cores.preto } as TextStyle,
    resumoItemSubTitle: { fontSize: 13, color: cores.secundaria } as TextStyle,
    resumoItemDate: { fontSize: 12, color: cores.secundaria } as TextStyle,

    // Empty State
    emptyCard: { backgroundColor: cores.branco, margin: 20, padding: 30, borderRadius: 10, alignItems: 'center' } as ViewStyle,
    emptyText: { color: cores.secundaria, fontSize: 16 } as TextStyle,
    
    // Placeholder (para evitar erros de nomes que não apareceram no HomeTela.tsx, mas que o TS pode esperar)
    clubeCardContainer: {} as ViewStyle, clubeCardBackground: {} as ViewStyle, clubeCardOverlay: {} as ViewStyle, clubeCardTitle: {} as TextStyle, clubeCardSubtitle: {} as TextStyle, inputLabel: {} as TextStyle,
});

export default HomeTela;