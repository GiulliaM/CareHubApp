import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView,
    FlatList, // Usaremos para o carrossel
    ImageBackground,
    StyleSheet,
    Dimensions
} from 'react-native';
import { Menu, ArrowRight } from 'lucide-react-native';

import {cores} from '../constantes/cores';
import {styles as estilosGlobais} from '../style/homeStyle'; // Importa estilos globais

// Pega a largura da tela para o carrossel
const { width: screenWidth } = Dimensions.get('window');

// --- DADOS FALSOS (MOCK) ---
// PENSANDO NO BACK-END: Isso viria da API (GET /artigos)
const ARTIGOS_DESTAQUE = [
  { id: '1', title: '5 Dicas para a Saúde do Cuidador', image: 'https://images.unsplash.com/photo-1516549655169-8b02135e8e21?q=80&w=1974&auto=format&fit=crop' },
  { id: '2', title: 'Entendendo o Alzheimer', image: 'https://images.unsplash.com/photo-1618335829737-25a4115317b1?q=80&w=2070&auto=format&fit=crop' },
  { id: '3', title: 'Nutrição Adequada para Idosos', image: 'https://images.unsplash.com/photo-1540420773420-3366772f0441?q=80&w=1974&auto=format&fit=crop' },
];

const CATEGORIAS = [
  { id: '1', title: 'Saúde Mental' },
  { id: '2', title: 'Atividade Física' },
  { id: '3', title: 'Direitos e Leis' },
  { id: '4', title: 'Alimentação' },
];

// --- COMPONENTES ---

const Header = () => (
  <View style={estilosGlobais.headerContainer}>
    <TouchableOpacity>
      <Menu color={cores.primaria} />
    </TouchableOpacity>
    <Text style={estilosGlobais.headerTitle}>Conteúdo</Text>
    <View style={{ width: 28 }} />
  </View>
);

// --- Item do Carrossel ---
type ArtigoCardProps = {
  item: { id: string; title: string; image: string; };
};
const ArtigoCard: React.FC<ArtigoCardProps> = ({ item }) => (
  <TouchableOpacity style={styles.cardContainer}>
    <ImageBackground
      source={{ uri: item.image }}
      style={styles.cardImage}
      imageStyle={{ borderRadius: 16 }}
    >
      <View style={styles.cardOverlay}>
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

// --- TELA PRINCIPAL DE CONTEÚDO ---
const ConteudoTela: React.FC = function(){

  return(
      <View style={estilosGlobais.screenContainer}>
          <Header />
          <ScrollView 
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Carrossel Principal */}
            <Text style={[estilosGlobais.sectionTitle, { paddingHorizontal: 20, marginTop: 10 }]}>
              Destaques para você
            </Text>
            <FlatList
              data={ARTIGOS_DESTAQUE}
              renderItem={({ item }) => <ArtigoCard item={item} />}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              // Efeito de "parar" no item
              pagingEnabled 
              // Garante que o padding não corte o último item
              contentContainerStyle={{ paddingHorizontal: 20 }} 
              // Remove o espaço extra
              ItemSeparatorComponent={() => <View style={{ width: 16 }} />} 
            />

            {/* Lista de Categorias */}
            <Text style={[estilosGlobais.sectionTitle, { paddingHorizontal: 20, marginTop: 30 }]}>
              Explorar Categorias
            </Text>
            <View style={{ paddingHorizontal: 20 }}>
              {CATEGORIAS.map(cat => (
                <TouchableOpacity key={cat.id} style={styles.categoriaItem}>
                  <Text style={styles.categoriaTexto}>{cat.title}</Text>
                  <ArrowRight size={18} color={cores.secundaria} />
                </TouchableOpacity>
              ))}
            </View>

          </ScrollView>
      </View>
  );
}

// Estilos específicos desta tela
const styles = StyleSheet.create({
  cardContainer: {
    width: screenWidth * 0.8, // 80% da largura da tela
    height: screenWidth * 0.5, // Proporção
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  cardOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.branco,
  },
  categoriaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoriaTexto: {
    fontSize: 16,
    fontWeight: '500',
    color: cores.preto,
  }
});

export default ConteudoTela;