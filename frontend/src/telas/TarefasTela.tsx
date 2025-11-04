import React, { useState } from 'react';
import { 
    View, 
    Text, 
    Button, 
    TouchableOpacity, 
    ScrollView,
    Alert,
    TextInput,
    ActivityIndicator,
    Platform
} from 'react-native';
// Lembre-se de instalar: npm i react-native-keyboard-aware-scroll-view
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Plus, Menu, ArrowLeft, ArrowRight, PlusCircle } from 'lucide-react-native';

//importando os estilo
import {cores} from '../constantes/cores';
// Importa APENAS o HomeStyle (que agora contém os estilos comuns)
import {styles} from '../style/homeStyle';

// ---
// COMPONENTES MOVIDOS PARA FORA (Evita bug do teclado)
// ---

// --- Cabeçalho (com 'onBack' para o formulário) ---
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
const CardData = () => (
  // <<< MUDANÇA: Usando styles.viewData (do HomeStyle)
  <View style={styles.viewData}> 
      <TouchableOpacity><ArrowLeft /></TouchableOpacity>
      <Text>Hoje - 22 de Outubro</Text>
      <TouchableOpacity><ArrowRight /></TouchableOpacity>
  </View>
);

// --- Título da Seção ---
const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeaderContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

// --- Botão de Adicionar (Agora com onPress) ---
const ButtonAddTask = ({ onPress }: { onPress: () => void }) =>(
  <TouchableOpacity style={styles.plusButton} onPress={onPress}>
    <Plus size={35} color={cores.branco} />
  </TouchableOpacity>
);

// --- Estado Vazio (Reutilizando seu estilo 'emptyCard') ---
const EmptyState = ({ onPress }: { onPress: () => void }) => (
  <View style={styles.emptyCard}>
    <Text style={styles.emptyCardText}>
      Nenhuma tarefa encontrada para hoje. Que tal adicionar uma?
    </Text>
    <TouchableOpacity style={styles.emptyCardButton} onPress={onPress}>
      <PlusCircle size={18} color={cores.primaria} style={{ marginRight: 8 }} />
      <Text style={styles.emptyCardButtonText}>Adicionar Tarefa</Text>
    </TouchableOpacity>
  </View>
);

// ---
// NOVO COMPONENTE: Formulário de Adicionar Tarefa
// ---
type AddTaskFormProps = {
  onBack: () => void; // Função para voltar
};

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onBack }) => {
  const [titulo, setTitulo] = useState('');
  const [horario, setHorario] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Função para salvar a tarefa (chama a API, etc.)
  const handleSaveTask = async () => {
    if (!titulo) {
      Alert.alert('Erro', 'O título da tarefa é obrigatório.');
      return;
    }
    setIsLoading(true);
    // Simula uma chamada de API
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Sucesso!', 'Tarefa salva.');
      onBack(); // Volta para a lista
    }, 1500);
  };

  return (
    // Usa o screenContainer para ter a cor de fundo correta
    <View style={styles.screenContainer}> 
      <Header title="Nova Tarefa" onBack={onBack} />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Usando os estilos de formulário (do comumEstilos) */}
        <Text style={styles.formSubtitle}>Preencha os dados da nova tarefa.</Text>
        
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
        
        {/* Usa o flexSpacer (do comumEstilos) */}
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


// ---
// TELA PRINCIPAL DE TAREFAS
// ---
const TarefasTela: React.FC = function(){
  // --- Estados ---
  const [temTarefas, setTarefas] = useState(0); // 0 = false, 1 = true
  const [isAddingTask, setIsAddingTask] = useState(false); // Controla o fluxo

  // --- Lógica do Título ---
  var titulo;
  if(temTarefas){
    titulo = "Tarefas para Hoje";
  } else {
    titulo = "Nenhuma Tarefa"; 
  }

  // ---
  // RENDERIZAÇÃO CONDICIONAL (O Fluxo)
  // ---

  // 1. Se estiver ADICIONANDO TAREFA, mostre o formulário
  if (isAddingTask) {
    return <AddTaskForm onBack={() => setIsAddingTask(false)} />;
  }

  // 2. Se estiver na LISTA, mostre a lista
  return(
      // Usamos o 'screenContainer' (com flex: 1) como o contêiner PAI
      <View style={styles.screenContainer}>
          <Header title="Tarefas" />
          <CardData />
          <SectionHeader title={titulo} />
          
          {/* O ScrollView agora só envolve a lista */}
          <ScrollView 
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Renderização condicional da lista ou estado vazio */}
            {temTarefas ? (
              <View>
                {/* Aqui é onde você fará o .map() 
                  das suas tarefas quando elas vierem da API 
                */}
                <Text style={{ paddingHorizontal: 20 }}>Item de Tarefa 1</Text>
                <Text style={{ paddingHorizontal: 20 }}>Item de Tarefa 2</Text>
              </View>
            ) : (
              <EmptyState onPress={() => setIsAddingTask(true)} />
            )}
          </ScrollView>
          
          {/* O Botão de Adicionar fica FORA do ScrollView,
              posicionado de forma absoluta pelo 'styles.plusButton' */}
          <ButtonAddTask onPress={() => setIsAddingTask(true)} />
          
      </View>
  );

}

export default TarefasTela;