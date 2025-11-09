import React from "react";
import { StyleSheet,ActivityIndicator, Text, View, ScrollView, TouchableOpacity, Image, ImageBackground} from "react-native";
import { Menu, Camera, PlusCircle, Pill, NotepadText, Smile } from 'lucide-react-native';

import {cores} from '../constantes/cores';
// <<< MUDANÇA: Importando o novo estilo mestre
import {styles} from '../style/estilosGlobais';

// (O componente Header foi removido, pois o AppNavigator cuida disso)

const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeaderContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <TouchableOpacity>
      <Text style={{ color: cores.primaria, fontWeight: 'bold' }}>Ver todos</Text>
    </TouchableOpacity>
  </View>
);

const EmptyStateCard = () => (
  <View style={styles.emptyCard}>
      <Text style={styles.emptyCardText}>Sem cuidados agendados para hoje.</Text>
      <TouchableOpacity style={styles.emptyCardButton}>
          <PlusCircle color={cores.primaria} size={18} style={{marginRight: 8}}/>
          <Text style={styles.emptyCardButtonText}>Agendar Cuidado</Text>
      </TouchableOpacity>
  </View>
);

type ResumoItemProps = {
  icon: React.ReactNode;
  titulo: string;
  subtitulo: string;
};
const ResumoItem: React.FC<ResumoItemProps> = ({ icon, titulo, subtitulo }) => (
  // <<< MUDANÇA: Usando 'resumoItemContainer' do estilo global
  <View style={styles.resumoItemContainer}>
    <View style={styles.resumoItemIcon}>
      {icon}
    </View>
    <View style={styles.resumoItemContent}>
      <Text style={styles.resumoItemTitle}>{titulo}</Text>
      <Text style={styles.resumoItemSubTitle}>{subtitulo}</Text>
    </View>
  </View>
);

const Home: React.FC = function(){
  
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
      {/* <Header /> foi removido */}
      
      <SectionHeader title="Próximos Cuidados" />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : proximosCuidados.length > 0 ? (
        <View style={{ paddingHorizontal: 20 }}>
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
      
      <SectionHeader title="Últimos Registros do Diário" />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : ultimosRegistros.length > 0 ? (
        <View style={{ paddingHorizontal: 20 }}>
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