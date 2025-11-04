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
import {styles as estilosGlobais} from '../style/homeStyle'; // Importa estilos globais
import { formatarDataAmigavel, adicionarDia, subtrairDia } from '../ferramentas/logicaData';

// --- COMPONENTES (Reutilizados) ---
const Header = () => (
  <View style={estilosGlobais.headerContainer}>
    <TouchableOpacity>
      <Menu color={cores.primaria} />
    </TouchableOpacity>
    <Text style={estilosGlobais.headerTitle}>Diário</Text>
    <View style={{ width: 28 }} />
  </View>
);

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

// --- COMPONENTE NOVO: Botão de Registro ---
type BotaoRegistroProps = {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
};
const BotaoRegistro: React.FC<BotaoRegistroProps> = ({ label, icon, onPress }) => (
  <TouchableOpacity style={styles.botaoRegistro} onPress={onPress}>
    {icon}
    <Text style={styles.botaoRegistroTexto}>{label}</Text>
  </TouchableOpacity>
);

// --- TELA PRINCIPAL DO DIÁRIO ---
const DiarioTela: React.FC = function(){
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  const handleDiaSeguinte = () => {
    setDataSelecionada(adicionarDia(dataSelecionada));
  };
  
  const handleDiaAnterior = () => {
    setDataSelecionada(subtrairDia(dataSelecionada));
  };

  // PENSANDO NO BACK-END:
  // Esta função seria chamada ao salvar o formulário/modal de registro
  const handleRegistrarEvento = (tipo: string) => {
    // 1. Abrir um Modal/Formulário para pedir detalhes (ex: "Qual foi o humor?")
    // 2. Enviar para a API:
    // const dados = { 
    //   tipo_registro: tipo, 
    //   comentario: "O usuário estava feliz.",
    //   data_registro: new Date(),
    //   paciente_id: 1
    // };
    // await fetch(`${API_URL}/registros`, { method: 'POST', ...});
    
    Alert.alert("Registro", `Evento "${tipo}" seria registrado aqui.`);
  };

  return(
      <View style={estilosGlobais.screenContainer}>
          <Header />
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
            <Text style={estilosGlobais.formSubtitle}>O que você gostaria de registrar?</Text>
            
            {/* Grid de Botões */}
            <View style={styles.gridContainer}>
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
                icon={<UserCheck color={cores.primaria} size={32} />} // (Ícone de exemplo)
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

            {/* Futura lista de registros do dia */}
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

// Estilos específicos desta tela
const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  botaoRegistro: {
    backgroundColor: cores.branco,
    width: '48%', // Quase metade da tela, com espaço
    aspectRatio: 1, // Para ser um quadrado
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