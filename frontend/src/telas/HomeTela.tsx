import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {
  Pill,
  Smile,
  PlusCircle,
  Stethoscope,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { cores } from '../constantes/cores';
import { styles } from '../style/homeStyle';
import { IDadosDashboard, initialDashboardData } from '../tipos/IDadosDashboard';

const API_URL = 'http://54.39.173.152:3000'; // ajuste se necessário

async function fetchDashboardData(pacienteId: number): Promise<IDadosDashboard> {
  try {
    const res = await fetch(`${API_URL}/api/dashboard/${pacienteId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as IDadosDashboard;
  } catch (e) {
    console.warn('Falha ao buscar dashboard, usando mock/local:', e);
    return initialDashboardData;
  }
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: 'Familiar' | 'Cuidador';
}

/* ----- Peças da UI ----- */
const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeaderContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <TouchableOpacity>
      <Text style={{ color: cores.primaria, fontWeight: 'bold' }}>Ver todos</Text>
    </TouchableOpacity>
  </View>
);

const EmptyStateCard = ({ onPress }: { onPress?: () => void }) => (
  <View style={styles.emptyCard}>
    <Text style={styles.emptyCardText}>Sem cuidados agendados para hoje.</Text>
    <TouchableOpacity style={styles.emptyCardButton} onPress={onPress}>
      <PlusCircle color={cores.primaria} size={18} style={{ marginRight: 8 }} />
      <Text style={styles.emptyCardButtonText}>Agendar Cuidado</Text>
    </TouchableOpacity>
  </View>
);

const ResumoItem = ({ icon, titulo, subtitulo }: { icon: React.ReactNode; titulo: string; subtitulo?: string }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20 }}>
    <View style={{
      padding: 10,
      borderRadius: 50,
      backgroundColor: cores.primaria + '20',
      marginRight: 16,
    }}>
      {icon}
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: cores.preto }}>{titulo}</Text>
      {subtitulo ? <Text style={{ fontSize: 14, color: cores.secundaria }}>{subtitulo}</Text> : null}
    </View>
  </View>
);

/* ----- Cabeçalho de Boas-Vindas ----- */
const WelcomeHeader = ({
  paciente,
  usuarioLogado,
  cuidadorAtivo,
}: {
  paciente?: string | null;
  usuarioLogado: Usuario | null;
  cuidadorAtivo?: string | null;
}) => (
  <View style={{ padding: 20, paddingTop: 28, backgroundColor: cores.branco }}>
    {/* Saudação personalizada */}
    <Text style={{ fontSize: 18, color: cores.secundaria }}>
      {usuarioLogado
        ? `Olá, ${usuarioLogado.tipo === 'Cuidador' ? 'cuidador(a)' : 'familiar'}`
        : 'Olá'}
    </Text>

    <Text
      style={{
        fontSize: 22,
        fontWeight: 'bold',
        color: cores.preto,
        marginTop: 4,
      }}
    >
      {usuarioLogado ? usuarioLogado.nome : 'Visitante'}
    </Text>

    {/* Visão do Paciente */}
    <View
      style={{
        marginTop: 15,
        padding: 12,
        borderRadius: 8,
        backgroundColor: cores.primaria + '10',
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: cores.primaria }}>
        Visão do Paciente: {paciente || 'Não Encontrado'}
      </Text>
      <Text
        style={{ fontSize: 13, color: cores.secundaria, marginTop: 4 }}
      >
        Cuidador Principal: {cuidadorAtivo || 'Não Definido'}
      </Text>
    </View>
  </View>
);

const SummaryCard = ({
  title,
  count,
}: {
  title: string;
  count: number;
}) => (
  <View
    style={{
      flex: 1,
      backgroundColor: '#fff',
      padding: 12,
      margin: 8,
      borderRadius: 12,
      elevation: 1,
      alignItems: 'center',
    }}
  >
    <Text style={{ fontSize: 18, fontWeight: 'bold', color: cores.preto }}>
      {count}
    </Text>
    <Text style={{ fontSize: 13, color: '#666', marginTop: 6 }}>{title}</Text>
  </View>
);

/* ----- Tela Home ----- */
const Home: React.FC = () => {
  const pacienteId = 1; // substituir por valor real (context/navegação)
  const [dashboardData, setDashboardData] = useState<IDadosDashboard>(initialDashboardData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // 🔹 Carregar informações do usuário logado
  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const dados = await AsyncStorage.getItem('usuario');
        if (dados) setUsuario(JSON.parse(dados));
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
      }
    };
    carregarUsuario();
  }, []);

  // 🔹 Carregar dados do dashboard
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      const data = await fetchDashboardData(pacienteId);
      if (!cancelled) {
        setDashboardData(data);
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [pacienteId]);

  const proximosCuidados = useMemo(() => {
    const cuidados: { tipo: 'remedio' | 'consulta' | 'outro'; titulo: string; subtitulo?: string }[] = [];
    if (dashboardData.proximoMedicamento) {
      cuidados.push({
        tipo: 'remedio',
        titulo: dashboardData.proximoMedicamento.nome,
        subtitulo: `Horário: ${dashboardData.proximoMedicamento.horario}`,
      });
    }
    if (dashboardData.proximaConsulta) {
      cuidados.push({
        tipo: 'consulta',
        titulo: dashboardData.proximaConsulta.nome,
        subtitulo: dashboardData.proximaConsulta.horario,
      });
    }
    return cuidados;
  }, [dashboardData]);

  const ultimosRegistros = useMemo(() => {
    return (dashboardData.atividadesRecentes || []).slice(0, 3);
  }, [dashboardData]);

  const totalCuidadosHoje = proximosCuidados.length;
  const totalRegistros = ultimosRegistros.length;
  const pacienteNome = dashboardData.perfilPaciente?.nome_paciente ?? 'Paciente';
  const cuidadorNome = dashboardData.cuidadorAtivo?.nome ?? 'Cuidador(a)';

  return (
    <ScrollView style={styles.screenContainer} showsVerticalScrollIndicator={false}>
      <WelcomeHeader paciente={pacienteNome} usuarioLogado={usuario} cuidadorAtivo={cuidadorNome} />

      <View style={{ flexDirection: 'row', paddingHorizontal: 12 }}>
        <SummaryCard title="Cuidados hoje" count={totalCuidadosHoje} />
        <SummaryCard title="Registros" count={totalRegistros} />
      </View>

      <SectionHeader title="Próximos Cuidados" />
      {loading ? (
        <ActivityIndicator size="large" color={cores.primaria} style={{ marginVertical: 20 }} />
      ) : error ? (
        <Text style={{ color: cores.primaria, textAlign: 'center', margin: 20 }}>{error}</Text>
      ) : proximosCuidados.length > 0 ? (
        <View style={{ marginHorizontal: 16 }}>
          {proximosCuidados.map((item, idx) => (
            <ResumoItem
              key={idx}
              icon={item.tipo === 'remedio' ? <Pill color={cores.primaria} /> : <Stethoscope color={cores.primaria} />}
              titulo={item.titulo}
              subtitulo={item.subtitulo}
            />
          ))}
        </View>
      ) : (
        <EmptyStateCard />
      )}

      <SectionHeader title="Últimos Registros do Diário" />
      {loading ? (
        <ActivityIndicator size="large" color={cores.primaria} style={{ marginVertical: 20 }} />
      ) : ultimosRegistros.length > 0 ? (
        <View style={{ marginHorizontal: 16 }}>
          {ultimosRegistros.map((item: any, idx: number) => (
            <ResumoItem key={idx} icon={<Smile color={cores.primaria} />} titulo={item.titulo} subtitulo={item.subtitulo} />
          ))}
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyCardText}>Nenhum registro no diário hoje.</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default Home;
