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
import { Plus, Menu, ArrowLeft, ArrowRight, PlusCircle } from 'lucide-react-native';

//importando os estilo
import {cores} from '../constantes/cores';
import {styles} from '../style/homeStyle';
// <<< MUDANÇA: Importando nossos helpers de data
import { formatarDataAmigavel, adicionarDia, subtrairDia } from '../ferramentas/logicaData';

// ---
// COMPONENTES MOVIDOS PARA FORA (Evita bug do teclado)
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

// --- Seletor de Data ---
// <<< MUDANÇA: Agora recebe props para funcionar
type CardDataProps = {
  data: Date;
  onAnterior: () => void;
  onProximo: () => void;
};
const CardData: React.FC<CardDataProps> = ({ data, onAnterior, onProximo }) => (
  <View style={styles.viewData}> 
      <TouchableOpacity onPress={onAnterior}><ArrowLeft color={cores.preto} /></TouchableOpacity>
      {/* <<< MUDANÇA: Exibe a data formatada */}
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

// --- Formulário de Adicionar Tarefa ---
type AddTaskFormProps = {
  onBack: () => void; // Função para voltar
  dataSelecionada: Date; // Para saber em qual dia salvar
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
    
    // PENSANDO NO BACK-END:
    // Aqui nós chamaríamos a API
    // const dados = { 
    //   titulo: titulo, 
    //   horario: horario, 
    //   data_tarefa: dataSelecionada.toISOString().split('T')[0] // Formato YYYY-MM-DD
    //   paciente_id: 1 // (Pegaríamos o ID do paciente ativo)
    // };
    // await fetch(`${API_URL}/tarefas`, { method: 'POST', body: JSON.stringify(dados), ...});
    
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Sucesso!', 'Tarefa salva.');
      onBack(); 
    }, 1500);
  };

  return (
    <View style={styles.screenContainer}> 
      <Header title="Nova Tarefa" onBack={onBack} />
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
  // --- Estados ---
  const [temTarefas, setTarefas] = useState(0); 
  const [isAddingTask, setIsAddingTask] = useState(false);
  // <<< MUDANÇA: Estado para controlar a data
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  // <<< MUDANÇA: Funções para mudar a data
  const handleDiaSeguinte = () => {
    setDataSelecionada(adicionarDia(dataSelecionada));
    // PENSANDO NO BACK-END:
    // Aqui nós buscaríamos as tarefas da nova data
    // fetchTarefas(adicionarDia(dataSelecionada));
  };
  
  const handleDiaAnterior = () => {
    setDataSelecionada(subtrairDia(dataSelecionada));
    // PENSANDO NO BACK-END:
    // fetchTarefas(subtrairDia(dataSelecionada));
  };
  
  // PENSANDO NO BACK-END:
  // useEffect(() => {
  //   fetchTarefas(dataSelecionada);
  // }, [dataSelecionada]); // Roda toda vez que a data muda

  var titulo = temTarefas ? "Tarefas para Hoje" : "Nenhuma Tarefa"; 

  // 1. Se estiver ADICIONANDO TAREFA, mostre o formulário
  if (isAddingTask) {
    return <AddTaskForm 
              onBack={() => setIsAddingTask(false)} 
              dataSelecionada={dataSelecionada} 
            />;
  }

  // 2. Se estiver na LISTA, mostre a lista
  return(
      <View style={styles.screenContainer}>
          <Header title="Tarefas" />
          {/* <<< MUDANÇA: Passando a data e as funções */}
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