import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView,
    FlatList, 
    ImageBackground,
    StyleSheet,
    Dimensions
} from 'react-native';
import { Menu, ArrowRight } from 'lucide-react-native';

import {cores} from '../constantes/cores';
// <<< MUDANÇA: Importando o novo estilo mestre
import {styles as estilosGlobais} from '../style/estilosGlobais';

const { width: screenWidth } = Dimensions.get('window');

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

// ---
// (O Header foi removido)
// ---

type ArtigoCardProps = {
  item: { id: string; title: string; image: string; };
};
const ArtigoCard: React.FC<ArtigoCardProps> = ({ item }) => (
  <TouchableOpacity style={localStyles.cardContainer}>
    <ImageBackground
      source={{ uri: item.image }}
      style={localStyles.cardImage}
      imageStyle={{ borderRadius: 16 }}
    >
      <View style={localStyles.cardOverlay}>
        <Text style={localStyles.cardTitle}>{item.title}</Text>
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

const ConteudoTela: React.FC = function(){

  return(
      <View style={estilosGlobais.screenContainer}>
          {/* <Header /> foi removido */}
          <ScrollView 
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[estilosGlobais.sectionTitle, { paddingHorizontal: 20, marginTop: 10 }]}>
              Destaques para você
            </Text>
            <FlatList
              data={ARTIGOS_DESTAQUE}
              renderItem={({ item }) => <ArtigoCard item={item} />}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled 
              contentContainerStyle={{ paddingHorizontal: 20 }} 
              ItemSeparatorComponent={() => <View style={{ width: 16 }} />} 
            />

            <Text style={[estilosGlobais.sectionTitle, { paddingHorizontal: 20, marginTop: 30 }]}>
              Explorar Categorias
            </Text>
            <View style={{ paddingHorizontal: 20 }}>
              {CATEGORIAS.map(cat => (
                <TouchableOpacity key={cat.id} style={localStyles.categoriaItem}>
                  <Text style={localStyles.categoriaTexto}>{cat.title}</Text>
                  <ArrowRight size={18} color={cores.secundaria} />
                </TouchableOpacity>
              ))}
            </View>

          </ScrollView>
      </View>
  );
}

// Estilos locais (específicos desta tela)
const localStyles = StyleSheet.create({
  cardContainer: {
    width: screenWidth * 0.8, 
    height: screenWidth * 0.5, 
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