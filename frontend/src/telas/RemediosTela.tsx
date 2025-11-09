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

import {cores} from '../constantes/cores';
// <<< MUDANÇA: Importando o novo estilo mestre
import {styles} from '../style/estilosGlobais';
import { formatarDataAmigavel, adicionarDia, subtrairDia } from '../ferramentas/logicaData';
// <<< MUDANÇA: Importar SafeAreaView
import { SafeAreaView } from 'react-native-safe-area-context';

// ---
// (O Header foi removido)
// ---

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
    // ... (lógica de salvar)
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Sucesso!', 'Remédio salvo.');
      onBack(); 
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.screenContainer}> 
      {/* (O Header foi removido) */}
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* (Botão de Voltar - pode ser adicionado aqui) */}
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 10 }}>
           <ArrowLeft color={cores.primaria} />
        </TouchableOpacity>
        
        <Text style={styles.formTitle}>Novo Remédio</Text>
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
    </SafeAreaView>
  );
};


// --- TELA PRINCIPAL DE REMÉDIOS ---
const RemediosTela: React.FC = function(){
  const [temRemedio, setRemedio] = useState(1);
  const [isAddingRemedio, setIsAddingRemedio] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  const handleDiaSeguinte = () => {
    setDataSelecionada(adicionarDia(dataSelecionada));
  };
  
  const handleDiaAnterior = () => {
    setDataSelecionada(subtrairDia(dataSelecionada));
  };
  
  var titulo = temRemedio ? "Medicamentos de Hoje" : "Nenhum Medicamento"; 

  if (isAddingRemedio) {
    return <AddRemedioForm 
              onBack={() => setIsAddingRemedio(false)} 
              dataSelecionada={dataSelecionada} 
            />;
  }

  return(
      <View style={styles.screenContainer}>
          {/* <Header /> foi removido */}
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