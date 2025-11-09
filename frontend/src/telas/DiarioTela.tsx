import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView,
    Alert,
    StyleSheet
} from 'react-native';
import { Menu, ArrowLeft, ArrowRight, Smile, Bed, Droplet, UserCheck, AlertTriangle, MessageSquare } from 'lucide-react-native';

import {cores} from '../constantes/cores';
// <<< MUDANÇA: Importando o novo estilo mestre
import {styles as estilosGlobais} from '../style/estilosGlobais';
import { formatarDataAmigavel, adicionarDia, subtrairDia } from '../ferramentas/logicaData';

// ---
// (O Header foi removido)
// ---

type CardDataProps = {
  data: Date;
  onAnterior: () => void;
  onProximo: () => void;
};
const CardData: React.FC<CardDataProps> = ({ data, onAnterior, onProximo }) => (
  <View style={estilosGlobais.viewData}> 
      <TouchableOpacity onPress={onAnterior}><ArrowLeft color={cores.preto} /></TouchableOpacity>
      <Text style={estilosGlobais.textoNormal}>{formatarDataAmigavel(data)}</Text>
      <TouchableOpacity onPress={onProximo}><ArrowRight color={cores.preto} /></TouchableOpacity>
  </View>
);

type BotaoRegistroProps = {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
};
const BotaoRegistro: React.FC<BotaoRegistroProps> = ({ label, icon, onPress }) => (
  <TouchableOpacity style={localStyles.botaoRegistro} onPress={onPress}>
    {icon}
    <Text style={localStyles.botaoRegistroTexto}>{label}</Text>
  </TouchableOpacity>
);

const DiarioTela: React.FC = function(){
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  const handleDiaSeguinte = () => {
    setDataSelecionada(adicionarDia(dataSelecionada));
  };
  
  const handleDiaAnterior = () => {
    setDataSelecionada(subtrairDia(dataSelecionada));
  };

  const handleRegistrarEvento = (tipo: string) => {
    Alert.alert("Registro", `Evento "${tipo}" seria registrado aqui.`);
  };

  return(
      <View style={estilosGlobais.screenContainer}>
          {/* <Header /> foi removido */}
          <CardData 
            data={dataSelecionada}
            onAnterior={handleDiaAnterior}
            onProximo={handleDiaSeguinte}
          />
          
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {/* <<< MUDANÇA: Usando estilos globais */}
            <Text style={estilosGlobais.formSubtitle}>O que você gostaria de registrar?</Text>
            
            <View style={localStyles.gridContainer}>
              <BotaoRegistro 
                label="Humor" 
                icon={<Smile color={cores.primaria} size={32} />}
                onPress={() => handleRegistrarEvento('Humor')}
              />
              <BotaoRegistro 
                label="Sono" 
                icon={<Bed color={cores.primaria} size={32} />}
                onPress={() => handleRegistrarEvento('Sono')}
              />
              <BotaoRegistro 
                label="Xixi" 
                icon={<Droplet color={cores.primaria} size={32} />}
                onPress={() => handleRegistrarEvento('Xixi')}
              />
              <BotaoRegistro 
                label="Fezes" 
                icon={<UserCheck color={cores.primaria} size={32} />}
                onPress={() => handleRegistrarEvento('Fezes')}
              />
              <BotaoRegistro 
                label="Vazamento" 
                icon={<AlertTriangle color={cores.primaria} size={32} />}
                onPress={() => handleRegistrarEvento('Vazamento')}
              />
              <BotaoRegistro 
                label="Outro" 
                icon={<MessageSquare color={cores.primaria} size={32} />}
                onPress={() => handleRegistrarEvento('Outro')}
              />
            </View>

            <View style={{ marginTop: 40 }}>
              <Text style={estilosGlobais.sectionTitle}>Registros de Hoje</Text>
              <View style={estilosGlobais.emptyCard}>
                <Text style={estilosGlobais.emptyCardText}>Nenhum registro feito ainda.</Text>
              </View>
            </View>

          </ScrollView>
      </View>
  );
}

// Estilos locais (específicos desta tela)
const localStyles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  botaoRegistro: {
    backgroundColor: cores.branco,
    width: '48%', 
    aspectRatio: 1, 
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 10,
  },
  botaoRegistroTexto: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.preto,
  }
});

export default DiarioTela;