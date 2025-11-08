// frontend/src/telas/TarefasTela.tsx

import React, { useState, useEffect, useCallback } from 'react';
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
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import axios from 'axios'; 

import { cores } from '../constantes/cores';
import styles from '../style/tarefaStyle'; 
import { formatarDataAmigavel, adicionarDia, subtrairDia } from '../ferramentas/logicaData';

// URL da API
const API_URL = 'http://54.39.173.152:3000';

// TIPAGEM DA TAREFA
type TipoRecorrencia = 'Única' | 'Diária' | 'Semanal' | 'Mensal';
type StatusTarefa = 'Pendente' | 'Concluída' | 'Atrasada';

type TarefaItem = {
    id: number;
    titulo: string;
    horario_tarefa: string | null;
    status: StatusTarefa;
};

// ---
// FUNÇÕES E COMPONENTES DE LAYOUT
// ---

const getMarkedDates = (date: Date): Record<string, any> => {
  const key = format(date, 'yyyy-MM-dd');
  return {
    [key]: { selected: true, selectedColor: cores.primaria },
  };
};

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

const TarefaCard = ({ tarefa }: { tarefa: TarefaItem }) => (
    <View style={styles.taskCard}>
        <View style={{ flex: 1 }}>
            <Text style={styles.taskTitle}>{tarefa.titulo}</Text>
            <Text style={styles.taskSubtitle}>Horário: {tarefa.horario_tarefa ? tarefa.horario_tarefa.substring(0, 5) : 'Dia todo'}</Text>
        </View>
    </View>
);

// --- Seletor de Recorrência ---
type RecorrenciaSelectorProps = {
    value: TipoRecorrencia;
    onChange: (value: TipoRecorrencia) => void;
};

const RecorrenciaSelector: React.FC<RecorrenciaSelectorProps> = ({ value, onChange }) => {
    const options: TipoRecorrencia[] = ['Única', 'Diária', 'Semanal', 'Mensal'];

    return (
        <View style={{ marginTop: 15 }}>
            <Text style={styles.formSubtitle}>Repetição:</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.secondaryButton, 
                            { 
                                width: '23%', 
                                marginTop: 8,
                                paddingVertical: 8,
                                backgroundColor: value === option ? cores.secundaria : '#fff',
                                borderColor: value === option ? cores.primaria : styles.input.borderColor,
                                borderWidth: value === option ? 2 : 1,
                            }
                        ]}
                        onPress={() => onChange(option)}
                    >
                        <Text 
                            style={{ 
                                ...styles.secondaryButtonText, 
                                fontWeight: value === option ? '700' : '600',
                                color: value === option ? cores.branco : cores.preto,
                                fontSize: 11
                            }}
                        >
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};


// --- ADD TASK FORM (INTEGRAÇÃO REAL) ---
type AddTaskFormProps = {
  onCancelOrSave: (success: boolean) => void; 
  dataSelecionada: Date; 
};
const AddTaskForm: React.FC<AddTaskFormProps> = ({ onCancelOrSave, dataSelecionada }) => {
  const [titulo, setTitulo] = useState('');
  const [horario, setHorario] = useState('');
  const [tipoRecorrencia, setTipoRecorrencia] = useState<TipoRecorrencia>('Única'); 
  const [isLoading, setIsLoading] = useState(false);
  
  // TODO: Substituir pelo ID REAL do paciente logado e usuário logado
  const PACIENTE_ID = 1;
  const RESPONSAVEL_ID = 1; 

  const handleSaveTask = async () => {
    if (!titulo) {
      Alert.alert('Erro', 'O título da tarefa é obrigatório.');
      return;
    }
    setIsLoading(true);
    
    const payload = {
      fk_paciente_id: PACIENTE_ID,
      fk_responsavel_id: RESPONSAVEL_ID,
      titulo: titulo,
      horario_tarefa: horario || null,
      repete_ate: format(dataSelecionada, 'yyyy-MM-dd'),
      tipo_recorrencia: tipoRecorrencia,
    };
    
    try {
      // **CHAMADA CORRIGIDA: Adicionado /api/ no path**
      const response = await axios.post(`${API_URL}/api/tarefas`, payload);
      
      setIsLoading(false);
      Alert.alert('Sucesso!', 'Tarefa salva com ID: ' + response.data.id);
      onCancelOrSave(true); 
    } catch (e: any) {
      setIsLoading(false);
      const errorMessage = e.response?.data?.message || e.message || 'Erro de rede ou servidor';
      Alert.alert('Erro', `Falha ao salvar a tarefa: ${errorMessage}`);
      onCancelOrSave(false);
    }
  };

  return (
    <View style={styles.screenContainer}> 
      <TouchableOpacity onPress={() => onCancelOrSave(false)} style={{ padding: 15 }}>
        <ArrowLeft size={24} color={cores.preto} />
      </TouchableOpacity>
      
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>Adicionar Tarefa</Text>
        <Text style={styles.formSubtitle}>
          Para o dia: {formatarDataAmigavel(dataSelecionada)}
        </Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nome da tarefa (ex: Medir pressão)"
          value={titulo}
          onChangeText={setTitulo}
        />
        <TextInput
          style={styles.input}
          placeholder="Horário (ex: 08:00 - Opcional)"
          value={horario}
          onChangeText={setHorario}
          keyboardType={Platform.select({ ios: 'numbers-and-punctuation', android: 'default' })}
        />
        
        <RecorrenciaSelector 
            value={tipoRecorrencia} 
            onChange={setTipoRecorrencia} 
        />
        
        <View style={styles.flexSpacer} /> 
        
        {isLoading ? (
          <ActivityIndicator size="large" color={cores.primaria} />
        ) : (
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleSaveTask} 
            disabled={!titulo}
          >
            <Text style={styles.buttonText}>Salvar Tarefa</Text>
          </TouchableOpacity>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};


// --- TELA PRINCIPAL DE TAREFAS ---
const TarefasTela: React.FC = function(){
  const [listaTarefas, setListaTarefas] = useState<TarefaItem[]>([]); 
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isLoadingTarefas, setIsLoadingTarefas] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [markedDates, setMarkedDates] = useState<Record<string, any>>(() => getMarkedDates(new Date()));
  
  const PACIENTE_ID = 1; 

  // FUNÇÃO DE BUSCA/RECARREGAMENTO DE DADOS (CHAMADA REAL À API)
  const buscarTarefasDoDia = useCallback(async (data: Date) => {
    const dataISO = format(data, 'yyyy-MM-dd');
    
    setIsLoadingTarefas(true); 
    setListaTarefas([]); 
    
    try {
      // **CHAMADA CORRIGIDA: Adicionado /api/ no path**
      const response = await axios.get(`${API_URL}/api/paciente/${PACIENTE_ID}/tarefas/date/${dataISO}`);
      const tarefasDoDia: TarefaItem[] = response.data;
      
      setListaTarefas(tarefasDoDia);
      
    } catch (e: any) {
      console.error("Falha ao buscar tarefas:", e.message);
      setListaTarefas([]);
    } finally {
      setIsLoadingTarefas(false);
    }
  }, []);

  const setNovaData = useCallback((novaData: Date) => {
    setDataSelecionada(novaData);
    setMarkedDates(getMarkedDates(novaData));
    buscarTarefasDoDia(novaData); 
  }, [buscarTarefasDoDia]);

  useEffect(() => {
    setNovaData(new Date()); 
  }, [setNovaData]);

  const handleOnCancelOrSave = (success: boolean) => {
    setIsAddingTask(false);
    if (success) {
      buscarTarefasDoDia(dataSelecionada); 
    }
  };

  const handleDiaSeguinte = () => {
    setNovaData(adicionarDia(dataSelecionada));
  };
  
  const handleDiaAnterior = () => {
    setNovaData(subtrairDia(dataSelecionada));
  };
  
  const temTarefas = listaTarefas.length > 0;
  var titulo = isLoadingTarefas
    ? "Carregando Tarefas..."
    : (temTarefas ? `Tarefas (${listaTarefas.length})` : "Nenhuma Tarefa"); 

  if (isAddingTask) {
    return <AddTaskForm 
              onCancelOrSave={handleOnCancelOrSave} 
              dataSelecionada={dataSelecionada} 
            />;
  }

  return(
      <View style={styles.screenContainer}>
          <View style={{ paddingHorizontal: 12, paddingTop: 8 }}>
            <Calendar
              onDayPress={(day) => {
                const selected = new Date(day.dateString + 'T00:00:00');
                setNovaData(selected);
              }}
              markedDates={markedDates}
              theme={{
                selectedDayBackgroundColor: cores.primaria,
                todayTextColor: cores.primaria,
                arrowColor: cores.primaria,
                monthTextColor: cores.preto,
              }}
              firstDay={1}
            />
          </View>
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
            {isLoadingTarefas ? (
              <ActivityIndicator size="large" color={cores.primaria} style={{ marginTop: 20 }} />
            ) : temTarefas ? (
              <View>
                {listaTarefas.map((tarefa) => (
                    <TarefaCard key={tarefa.id} tarefa={tarefa} />
                ))}
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