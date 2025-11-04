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
import { Plus, ArrowLeft, ArrowRight, PlusCircle } from 'lucide-react-native';

import {cores} from '../constantes/cores';
import {styles} from '../style/homeStyle';
import { formatarDataAmigavel, adicionarDia, subtrairDia } from '../ferramentas/logicaData';

// ---
// COMPONENTES
// ---

// O 'Header' foi REMOVIDO daqui.

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

const ButtonAddTask = ({ onPress }: { onPress: () => void }) =>(
  <TouchableOpacity style={styles.plusButton} onPress={onPress}>
    <Plus size={35} color={cores.branco} />
  </TouchableOpacity>
);

const EmptyState = ({ onPress }: { onPress: () => void }) => (
  <View style={styles.emptyCard}>
    <Text style={styles.emptyCardText}>
      Nenhuma tarefa encontrada para este dia. Que tal adicionar uma?
    </Text>
    <TouchableOpacity style={styles.emptyCardButton} onPress={onPress}>
      <PlusCircle size={18} color={cores.primaria} style={{ marginRight: 8 }} />
      <Text style={styles.emptyCardButtonText}>Adicionar Tarefa</Text>
    </TouchableOpacity>
  </View>
);

type AddTaskFormProps = {
  onBack: () => void; 
  dataSelecionada: Date; 
};
const AddTaskForm: React.FC<AddTaskFormProps> = ({ onBack, dataSelecionada }) => {
  const [titulo, setTitulo] = useState('');
  const [horario, setHorario] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveTask = async () => {
    if (!titulo) {
      Alert.alert('Erro', 'O título da tarefa é obrigatório.');
      return;
    }
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Sucesso!', 'Tarefa salva.');
      onBack(); 
    }, 1500);
  };

  return (
    <View style={styles.screenContainer}> 
      
      {/* A chamada <Header /> foi REMOVIDA daqui. 
          AVISO: Precisaremos de uma solução de "Stack" para este formulário
          ter um cabeçalho com botão "Voltar", mas por agora,
          isso corrige o erro de crash.
      */}

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.formSubtitle}>
          Adicionando tarefa para: {formatarDataAmigavel(dataSelecionada)}
        </Text>
        
        <TextInput
          style={styles.input}
          placeholder="Título da tarefa (ex: Medir pressão)"
          value={titulo}
          onChangeText={setTitulo}
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
          <TouchableOpacity style={styles.primaryButton} onPress={handleSaveTask}>
            <Text style={styles.buttonText}>Salvar Tarefa</Text>
          </TouchableOpacity>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};


// --- TELA PRINCIPAL DE TAREFAS ---
const TarefasTela: React.FC = function(){
  const [temTarefas, setTarefas] = useState(0); 
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  const handleDiaSeguinte = () => {
    setDataSelecionada(adicionarDia(dataSelecionada));
  };
  
  const handleDiaAnterior = () => {
    setDataSelecionada(subtrairDia(dataSelecionada));
  };
  
  var titulo = temTarefas ? "Tarefas para Hoje" : "Nenhuma Tarefa"; 

  if (isAddingTask) {
    return <AddTaskForm 
              onBack={() => setIsAddingTask(false)} 
              dataSelecionada={dataSelecionada} 
            />;
  }

  return(
      <View style={styles.screenContainer}>
          {/* A chamada <Header /> foi REMOVIDA daqui */}
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
            {temTarefas ? (
              <View>
                <Text style={{ paddingHorizontal: 20 }}>Item de Tarefa 1</Text>
                <Text style={{ paddingHorizontal: 20 }}>Item de Tarefa 2</Text>
              </View>
            ) : (
              <EmptyState onPress={() => setIsAddingTask(true)} />
            )}
          </ScrollView>
          
          <ButtonAddTask onPress={() => setIsAddingTask(true)} />
      </View>
  );
}

export default TarefasTela;