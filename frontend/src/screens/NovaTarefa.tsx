// NovaTarefa.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/apiClient";
import { useTheme } from "../context/ThemeContext";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

const WEEKDAYS = [
  { label: "Dom", idx: 0 },
  { label: "Seg", idx: 1 },
  { label: "Ter", idx: 2 },
  { label: "Qua", idx: 3 },
  { label: "Qui", idx: 4 },
  { label: "Sex", idx: 5 },
  { label: "Sáb", idx: 6 },
];

export default function NovaTarefa({ navigation, route }: any) {
  const { colors } = useTheme();
  const editingTarefa = route?.params?.tarefa ?? null;

  const [titulo, setTitulo] = useState(editingTarefa?.titulo ?? "");
  const [detalhes, setDetalhes] = useState(editingTarefa?.detalhes ?? "");
  const [data, setData] = useState(
    editingTarefa?.data ? new Date(editingTarefa.data) : new Date()
  );
  const [hora, setHora] = useState(
    editingTarefa?.hora ? new Date(`1970-01-01T${editingTarefa.hora}`) : new Date()
  );
  const [showDataPicker, setShowDataPicker] = useState(false);
  const [showHoraPicker, setShowHoraPicker] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // diasRepeticao: array de índices (0..6). No banco, salvamos string "0,1,2"
  const initialDias =
    editingTarefa?.dias_repeticao && typeof editingTarefa.dias_repeticao === "string"
      ? editingTarefa.dias_repeticao.split(",").map((s: string) => s.trim()).filter(Boolean).map(Number)
      : [];

  const [diasRepeticaoArr, setDiasRepeticaoArr] = useState<number[]>(initialDias);
  const [preset, setPreset] = useState<string>(
    () => {
      if (!initialDias || initialDias.length === 0) return "";
      if (initialDias.length === 7) return "todos";
      // custom detection for seg/qua/sex or ter/qui, otherwise custom
      const segQuaSex = [1,3,5].every(i => initialDias.includes(i)) && initialDias.length === 3;
      const terQui = [2,4].every(i => initialDias.includes(i)) && initialDias.length === 2;
      if (segQuaSex) return "segqua";
      if (terQui) return "terqui";
      return "custom";
    }
  );

  useEffect(() => {
    // keep preset in sync with manual toggles
    if (diasRepeticaoArr.length === 0) setPreset("");
    else if (diasRepeticaoArr.length === 7) setPreset("todos");
    else {
      const segQuaSex = [1,3,5].every(i => diasRepeticaoArr.includes(i)) && diasRepeticaoArr.length === 3;
      const terQui = [2,4].every(i => diasRepeticaoArr.includes(i)) && diasRepeticaoArr.length === 2;
      if (segQuaSex) setPreset("segqua");
      else if (terQui) setPreset("terqui");
      else setPreset("custom");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diasRepeticaoArr.length]);

  const toggleWeekday = (idx: number) => {
    setDiasRepeticaoArr(prev => {
      if (prev.includes(idx)) return prev.filter(i => i !== idx);
      return [...prev, idx].sort((a,b) => a-b);
    });
  };

  const applyPreset = (value: string) => {
    setPreset(value);
    if (value === "") setDiasRepeticaoArr([]);
    else if (value === "todos") setDiasRepeticaoArr(WEEKDAYS.map(d => d.idx));
    else if (value === "segqua") setDiasRepeticaoArr([1,3,5]);
    else if (value === "terqui") setDiasRepeticaoArr([2,4]);
    else if (value === "custom") {
      // keep current arr (no-op) — user can pick manually
    }
  };

  const formatTimeForDB = (d: Date) => {
    // HH:MM:SS
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  const handleSalvar = async () => {
    if (!titulo.trim()) {
      Alert.alert("Atenção", "Dê um título para a tarefa.");
      return;
    }
    setSalvando(true);
    try {
      const rawPaciente = await AsyncStorage.getItem("paciente");
      const paciente = rawPaciente ? JSON.parse(rawPaciente) : null;
      if (!paciente?.paciente_id) {
        Alert.alert("Erro", "Nenhum paciente vinculado encontrado.");
        setSalvando(false);
        return;
      }

      if (editingTarefa && editingTarefa.tarefa_id) {
        // ✅ EDIÇÃO: Atualiza apenas a tarefa específica (sem criar repetições)
        const payload: any = {
          titulo: titulo.trim(),
          detalhes: detalhes.trim(),
          data: dayjs(data).format("YYYY-MM-DD"),
          hora: formatTimeForDB(hora),
          concluida: editingTarefa.concluida ? 1 : 0,
          dias_repeticao: "", // Remove repetição ao editar
          paciente_id: paciente.paciente_id,
        };
        
        await api.patch(`/tarefas/${editingTarefa.tarefa_id}`, payload);
        Alert.alert("Sucesso", "Tarefa atualizada com sucesso!");
        navigation.goBack();
      } else {
        // ✅ CRIAÇÃO: Cria tarefas individuais para cada dia
        
        if (diasRepeticaoArr.length === 0) {
          // Sem repetição: cria apenas uma tarefa
          const payload: any = {
            titulo: titulo.trim(),
            detalhes: detalhes.trim(),
            data: dayjs(data).format("YYYY-MM-DD"),
            hora: formatTimeForDB(hora),
            concluida: 0,
            dias_repeticao: "",
            paciente_id: paciente.paciente_id,
          };
          
          await api.post("/tarefas", payload);
          Alert.alert("Sucesso", "Tarefa cadastrada com sucesso!");
        } else {
          // Com repetição: cria múltiplas tarefas individuais
          const tarefasCriadas: string[] = [];
          const dataInicio = dayjs(data);
          const quantidadeSemanas = 12; // Cria para 12 semanas (3 meses)
          
          // Para cada semana
          for (let semana = 0; semana < quantidadeSemanas; semana++) {
            // Para cada dia da repetição
            for (const diaIdx of diasRepeticaoArr) {
              // Encontra a próxima ocorrência desse dia da semana
              const diasAteProximoDia = (diaIdx - dataInicio.day() + 7) % 7;
              const proximaData = dataInicio
                .add(semana * 7, "day")
                .add(diasAteProximoDia, "day");
              
              const payload: any = {
                titulo: titulo.trim(),
                detalhes: detalhes.trim(),
                data: proximaData.format("YYYY-MM-DD"),
                hora: formatTimeForDB(hora),
                concluida: 0,
                dias_repeticao: "", // Cada tarefa é individual, sem repetição
                paciente_id: paciente.paciente_id,
              };
              
              await api.post("/tarefas", payload);
              tarefasCriadas.push(proximaData.format("DD/MM"));
            }
          }
          
          const totalCriadas = tarefasCriadas.length;
          Alert.alert(
            "Sucesso!",
            `${totalCriadas} tarefas foram criadas para os próximos 3 meses.\n\nPrimeiras datas: ${tarefasCriadas.slice(0, 5).join(", ")}...`
          );
        }
        
        navigation.goBack();
      }
    } catch (err: any) {
      console.error("Erro ao salvar tarefa:", err?.response?.data || err?.message || err);
      Alert.alert("Erro", "Não foi possível salvar a tarefa. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>
          {editingTarefa ? "Editar Tarefa" : "Nova Tarefa"}
        </Text>

        {/* Título */}
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={[styles.input]}
          placeholder="Ex: Trocar curativo"
          value={titulo}
          onChangeText={setTitulo}
        />

        {/* Detalhes */}
        <Text style={styles.label}>Detalhes</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Detalhes da tarefa..."
          value={detalhes}
          multiline
          onChangeText={setDetalhes}
        />

        {/* Data */}
        <TouchableOpacity style={styles.selectButton} onPress={() => setShowDataPicker(true)}>
          <Text style={styles.selectButtonText}>
            Data: {dayjs(data).format("DD/MM/YYYY")}
          </Text>
        </TouchableOpacity>

        {showDataPicker && (
          <DateTimePicker
            value={data}
            mode="date"
            display="default"
            onChange={(e, dateSel) => {
              setShowDataPicker(false);
              if (dateSel) setData(dateSel);
            }}
          />
        )}

        {/* Hora */}
        <TouchableOpacity style={styles.selectButton} onPress={() => setShowHoraPicker(true)}>
          <Text style={styles.selectButtonText}>
            Hora: {dayjs(hora).format("HH:mm")}
          </Text>
        </TouchableOpacity>

        {showHoraPicker && (
          <DateTimePicker
            value={hora}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(e, dateSel) => {
              setShowHoraPicker(false);
              if (dateSel) setHora(dateSel);
            }}
          />
        )}

        {/* Repetição */}
        <Text style={styles.label}>Repetição</Text>

        <View style={styles.repeticaoContainer}>
          {[
            { label: "Nenhuma", value: "" },
            { label: "Todos os dias", value: "todos" },
            { label: "Seg/Qua/Sex", value: "segqua" },
            { label: "Ter/Qui", value: "terqui" },
            { label: "Personalizar", value: "custom" },
          ].map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.repeticaoBtn,
                preset === item.value && { backgroundColor: colors.primary },
              ]}
              onPress={() => applyPreset(item.value)}
            >
              <Text
                style={[
                  styles.repeticaoBtnText,
                  preset === item.value && { color: "#fff" },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom weekday toggles (visible when custom or when preset active but user wants change) */}
        <View style={styles.weekdaysRow}>
          {WEEKDAYS.map((d) => {
            const active = diasRepeticaoArr.includes(d.idx);
            return (
              <TouchableOpacity
                key={d.idx}
                style={[
                  styles.weekdayBtn,
                  { borderColor: colors.primary },
                  active && { backgroundColor: colors.primary },
                ]}
                onPress={() => toggleWeekday(d.idx)}
              >
                <Text style={[styles.weekdayText, active && { color: "#fff" }]}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Botões */}
        <TouchableOpacity
          style={[styles.btnSalvar, { backgroundColor: colors.primary }]}
          disabled={salvando}
          onPress={handleSalvar}
        >
          {salvando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>{editingTarefa ? "Salvar alterações" : "Salvar Tarefa"}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnCancelar, { borderColor: colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.btnCancelarText, { color: colors.primary }]}>
            Cancelar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 10,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
  },
  selectButton: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  selectButtonText: {
    fontWeight: "600",
    color: "#333",
  },

  repeticaoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  repeticaoBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
    marginBottom: 8,
  },
  repeticaoBtnText: {
    fontWeight: "600",
  },

  weekdaysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  weekdayBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  weekdayText: {
    fontWeight: "700",
  },

  btnSalvar: {
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  btnCancelar: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 2,
  },
  btnCancelarText: {
    fontWeight: "700",
    fontSize: 16,
  },
});
