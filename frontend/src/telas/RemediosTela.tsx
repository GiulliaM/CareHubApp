import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView,
    Alert,
    TextInput,
    ActivityIndicator,
    Platform
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Plus, Menu, ArrowLeft, ArrowRight, PlusCircle, Pill } from 'lucide-react-native';
import { Checkbox } from '@futurejj/react-native-checkbox';

//importando os estilo
import {cores} from '../constantes/cores';
import {styles} from '../style/homeStyle';
// Importando nossos helpers de data
import { formatarDataAmigavel, adicionarDia, subtrairDia } from '../ferramentas/logicaData';

// ---
// COMPONENTES (Reutilizados da tela de Tarefas)
// ---

const Header = ({ onBack, title }: { title: string, onBack?: () => void }) => (
  <View style={styles.headerContainer}>
    {onBack ? (
      <TouchableOpacity onPress={onBack}>
        <ArrowLeft color={cores.primaria} />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity>
        <Menu color={cores.primaria} />
      </TouchableOpacity>
    )}
    <Text style={styles.headerTitle}>{title}</Text>
    <View style={{ width: 28 }} />
  </View>
);

type CardDataProps = {
  data: Date;
  onAnterior: () => void;
  onProximo: () => void;
};
const CardData: React.FC<CardDataProps> = ({ data, onAnterior, onProximo }) => (
  <View style={styles.viewData}> 
      <TouchableOpacity onPress={onAnterior}><ArrowLeft color={cores.preto} /></TouchableOpacity>
      <Text style={styles.textoNormal}>{formatarDataAmigavel(data)}</Text>
      <TouchableOpacity onPress={onProximo}><ArrowRight color={cores.preto} /></TouchableOpacity>
  </View>
);

const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeaderContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const ButtonAddRemedio = ({ onPress }: { onPress: () => void }) =>(
  <TouchableOpacity style={styles.plusButton} onPress={onPress}>
    <Plus size={35} color={cores.branco} />
  </TouchableOpacity>
);

// --- Componente Específico de Remédio ---
const CardListaRemedio = () => {
  const [checked, setChecked] = useState(false);
  const toggleCheckbox = () => setChecked(!checked);

  return (
    <View style={styles.cardRemedio}>
      <Pill size={30} color={cores.primaria} />
      <View style={styles.cardRemedioText}>
          <Text style={styles.textoNormal}>08:00</Text>
          <Text style={styles.textoNormal}>Clonazepam 2mg</Text>
      </View>
      <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={toggleCheckbox}
          color={cores.primaria}
      />
    </View>
  );
};

const EmptyState = ({ onPress }: { onPress: () => void }) => (
  <View style={styles.emptyCard}>
    <Text style={styles.emptyCardText}>
      Nenhum remédio agendado para este dia.
    </Text>
    <TouchableOpacity style={styles.emptyCardButton} onPress={onPress}>
      <PlusCircle size={18} color={cores.primaria} style={{ marginRight: 8 }} />
      <Text style={styles.emptyCardButtonText}>Adicionar Remédio</Text>
    </TouchableOpacity>
  </View>
);

// --- Formulário de Adicionar Remédio ---
type AddRemedioFormProps = {
  onBack: () => void;
  dataSelecionada: Date;
};
const AddRemedioForm: React.FC<AddRemedioFormProps> = ({ onBack, dataSelecionada }) => {
  const [nome, setNome] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [horario, setHorario] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveRemedio = async () => {
    if (!nome || !horario) {
      Alert.alert('Erro', 'Nome e horário são obrigatórios.');
      return;
    }
    setIsLoading(true);
    // PENSANDO NO BACK-END:
    // const dados = { 
    //   nome_medicamento: nome, 
    //   dosagem: dosagem, 
    //   horario: horario, 
    //   data_inicio: dataSelecionada.toISOString().split('T')[0],
    //   frequencia: 'Diária' // (Precisaríamos de um input para isso)
    //   paciente_id: 1
    // };
    // await fetch(`${API_URL}/medicamentos`, { method: 'POST', ...});
    
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Sucesso!', 'Remédio salvo.');
      onBack(); 
    }, 1500);
  };

  return (
    <View style={styles.screenContainer}> 
      <Header title="Novo Remédio" onBack={onBack} />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.formSubtitle}>
          Agendando remédio para: {formatarDataAmigavel(dataSelecionada)}
        </Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nome do remédio (ex: Paracetamol)"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Dosagem (ex: 500mg)"
          value={dosagem}
          onChangeText={setDosagem}
        />
        <TextInput
          style={styles.input}
          placeholder="Horário (ex: 08:00)"
          value={horario}
          onChangeText={setHorario}
        />
        
        <View style={styles.flexSpacer} /> 
        
        {isLoading ? (
          <ActivityIndicator size="large" color={cores.primaria} />
        ) : (
          <TouchableOpacity style={styles.primaryButton} onPress={handleSaveRemedio}>
            <Text style={styles.buttonText}>Salvar Remédio</Text>
          </TouchableOpacity>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};


// --- TELA PRINCIPAL DE REMÉDIOS ---
const RemediosTela: React.FC = function(){
  // --- Estados ---
  const [temRemedio, setRemedio] = useState(1); // 1 = true (para mostrar o card)
  const [isAddingRemedio, setIsAddingRemedio] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  const handleDiaSeguinte = () => {
    setDataSelecionada(adicionarDia(dataSelecionada));
  };
  
  const handleDiaAnterior = () => {
    setDataSelecionada(subtrairDia(dataSelecionada));
  };
  
  var titulo = temRemedio ? "Medicamentos de Hoje" : "Nenhum Medicamento"; 

  // 1. Se estiver ADICIONANDO, mostre o formulário
  if (isAddingRemedio) {
    return <AddRemedioForm 
              onBack={() => setIsAddingRemedio(false)} 
              dataSelecionada={dataSelecionada} 
            />;
  }

  // 2. Se estiver na LISTA, mostre a lista
  return(
      <View style={styles.screenContainer}>
          <Header title="Remédios" />
          <CardData 
            data={dataSelecionada}
            onAnterior={handleDiaAnterior}
            onProximo={handleDiaSeguinte}
          />
          <SectionHeader title={titulo} />
          
          <ScrollView 
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {temRemedio ? (
              <View>
                {/* Aqui viria o .map() dos remédios */}
                <CardListaRemedio />
                <CardListaRemedio />
              </View>
            ) : (
              <EmptyState onPress={() => setIsAddingRemedio(true)} />
            )}
          </ScrollView>
          
          <ButtonAddRemedio onPress={() => setIsAddingRemedio(true)} />
      </View>
  );

}

export default RemediosTela;