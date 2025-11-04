import React from "react";
import { StyleSheet,ActivityIndicator, Text, View, ScrollView, TouchableOpacity, Image, ImageBackground} from "react-native";
import { Menu, Camera, PlusCircle, Pill, NotepadText, Smile } from 'lucide-react-native';

import {cores} from '../constantes/cores';
import {styles} from '../style/homeStyle';

// --- COMPONENTES DA TELA HOME ---

const Header = () => (
  <View style={styles.headerContainer}>
    <TouchableOpacity>
      <Menu color={cores.primaria} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Resumo de Hoje</Text>
    {/* Removido o espaço vazio, podemos adicionar um ícone se quisermos */}
    <View style={{ width: 28 }} /> 
  </View>
);

const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeaderContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {/* Removi a câmera, não parecia se encaixar no contexto de "cuidados" */}
    <TouchableOpacity>
      <Text style={{ color: cores.primaria, fontWeight: 'bold' }}>Ver todos</Text>
    </TouchableOpacity>
  </View>
);

// Componente para o card de "estado vazio"
const EmptyStateCard = () => (
  <View style={styles.emptyCard}>
      <Text style={styles.emptyCardText}>Sem cuidados agendados para hoje.</Text>
      <TouchableOpacity style={styles.emptyCardButton}>
          <PlusCircle color={cores.primaria} size={18} style={{marginRight: 8}}/>
          <Text style={styles.emptyCardButtonText}>Agendar Cuidado</Text>
      </TouchableOpacity>
  </View>
);

// NOVO: Componente para um item da lista de resumo
type ResumoItemProps = {
  icon: React.ReactNode;
  titulo: string;
  subtitulo: string;
};
const ResumoItem: React.FC<ResumoItemProps> = ({ icon, titulo, subtitulo }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20 }}>
    <View style={{ 
      padding: 10, 
      borderRadius: 50, 
      backgroundColor: cores.primaria + '20', // Fundo com opacidade
      marginRight: 16 
    }}>
      {icon}
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: cores.preto }}>{titulo}</Text>
      <Text style={{ fontSize: 14, color: cores.secundaria }}>{subtitulo}</Text>
    </View>
  </View>
);

// --- TELA PRINCIPAL DA HOME ---
const Home: React.FC = function(){
  
  // PENSANDO NO BACK-END:
  // const [proximosCuidados, setProximosCuidados] = useState([]);
  // const [ultimosRegistros, setUltimosRegistros] = useState([]);
  
  // Vamos simular dados
  const loading = false;
  const proximosCuidados = [
    { tipo: 'remedio', titulo: 'Paracetamol', subtitulo: '08:00 - 500mg' },
    { tipo: 'tarefa', titulo: 'Medir pressão', subtitulo: '08:15' },
  ];
  const ultimosRegistros = [
    { tipo: 'humor', titulo: 'Bom humor', subtitulo: 'Registrado às 09:30' },
  ];

  return(
      <ScrollView style={styles.screenContainer} showsVerticalScrollIndicator={false}>
      <Header />
      
      {/* Seção de Próximos Cuidados */}
      <SectionHeader title="Próximos Cuidados" />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : proximosCuidados.length > 0 ? (
        <View>
          {proximosCuidados.map((item, index) => (
            <ResumoItem 
              key={index}
              icon={item.tipo === 'remedio' ? 
                <Pill color={cores.primaria} /> : 
                <NotepadText color={cores.primaria} />
              }
              titulo={item.titulo}
              subtitulo={item.subtitulo}
            />
          ))}
        </View>
      ) : (
        <EmptyStateCard />
      )}
      
      {/* Seção de Últimos Registros do Diário */}
      <SectionHeader title="Últimos Registros do Diário" />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : ultimosRegistros.length > 0 ? (
        <View>
          {ultimosRegistros.map((item, index) => (
            <ResumoItem 
              key={index}
              icon={<Smile color={cores.primaria} />}
              titulo={item.titulo}
              subtitulo={item.subtitulo}
            />
          ))}
        </View>
      ) : (
         <View style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>Nenhum registro no diário hoje.</Text>
         </View>
      )}

      </ScrollView>
  );
}

export default Home;