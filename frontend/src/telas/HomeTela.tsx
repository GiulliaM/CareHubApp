import React from "react";//para a sintaxe
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ImageBackground} from "react-native";//importando os componentes que vamos usar na tela
//pg de estilo, paragrafo, div, div q da pra descer, area de toque, imagem

import { Menu, Percent, Truck, CalendarClock, Camera, PlusCircle } from 'lucide-react-native';


//importar as cores que definimos
import {cores} from '../constantes/cores';
import {styles} from '../style/homeStyle';


//mesmo nome do arquivo, tipo o uma funcao construtora de java
//Home e a funcao q vai exibir a p[agina home, ent o return dela vai ter tudo q ela vai mostrar, como uma pagina em html
const Home: React.FC = function(){

    // Componente para o cabeçalho da tela
  const Header = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity>
        <Menu color={cores.primaria} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>CareHub</Text>
      <View style={{ width: 28 }} />
    </View>
  );

  // Componente para o banner principal (Clube CareHub)
  const ClubeCareHubCard = () => (
    <View style={styles.clubeCardContainer}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1576765608866-5b518682c379?q=80&w=1974&auto=format&fit=crop' }}
        style={styles.clubeCardBackground}
        imageStyle={{ borderRadius: 16 }}
      >
        <View style={styles.clubeCardOverlay}>
          <Text style={styles.clubeCardTitle}>CLUBE CAREHUB</Text>
          <Text style={styles.clubeCardSubtitle}>MAIS PRATICIDADE E ECONOMIA PARA VOCÊ!</Text>
          <TouchableOpacity style={styles.clubeCardButton}>
            <Text style={styles.clubeCardButtonText}>ATIVE AGORA E APROVEITE</Text>
          </TouchableOpacity>
          <View style={styles.clubeFeaturesContainer}>
            <View style={styles.featureItem}>
              <Percent color={cores.branco} size={18} />
              <Text style={styles.featureText}>Descontos exclusivos</Text>
            </View>
            <View style={styles.featureItem}>
              <Truck color={cores.branco} size={18} />
              <Text style={styles.featureText}>Frete grátis parceiro</Text>
            </View>
            <View style={styles.featureItem}>
              <CalendarClock color={cores.branco} size={18} />
              <Text style={styles.featureText}>Receba com recorrência</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );

   // Componente para o cabeçalho de uma seção
  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity>
        <Camera color={cores.secundaria} size={24} />
      </TouchableOpacity>
    </View>
  );

  // Componente para o card de "estado vazio"
  const EmptyMedicationCard = () => (
    <View style={styles.emptyCard}>
        <Text style={styles.emptyCardText}>Sem cuidados para exibir</Text>
        <TouchableOpacity style={styles.emptyCardButton}>
            <PlusCircle color={cores.primaria} size={18} style={{marginRight: 8}}/>
            <Text style={styles.emptyCardButtonText}>Cadastrar Cuidado</Text>
        </TouchableOpacity>
    </View>
  );


    return(
        <ScrollView style={styles.screenContainer} showsVerticalScrollIndicator={false}>
        <Header />
        <SectionHeader title="Próximos Cuidados" />
        <EmptyMedicationCard />
        </ScrollView>
    );
}




export default Home;
// React.FC significa "Functional Component". É a forma de dizer ao TypeScript
// que esta função é um componente React.