import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import api from "../utils/apiClient";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

export default function Tarefas({ navigation }: any) {
  const { colors } = useTheme();
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // dia selecionado
  const hoje = dayjs().format("YYYY-MM-DD");
  const [dataSelecionada, setDataSelecionada] = useState(hoje);

  // 🔹 Normalizar datas → evita pular para dia seguinte
  const normalizar = (data: string) => {
    return dayjs(data).format("YYYY-MM-DD");
  };

  // 🔹 Buscar tarefas
  const fetchTarefas = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await AsyncStorage.getItem("paciente");
      const paciente = raw ? JSON.parse(raw) : null;

      if (!paciente?.paciente_id) {
        setTarefas([]);
        return;
      }

      const data = await api.get(`/tarefas?paciente_id=${paciente.paciente_id}`);
      console.log("🔍 Tarefas recebidas:", data);

      // normalizar datas agora
      const tarefasCorrigidas = (data || []).map((t: any) => ({
        ...t,
        data: normalizar(t.data),
      }));

      setTarefas(tarefasCorrigidas);
    } catch (e) {
      console.log("Erro ao carregar tarefas:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTarefas();
    }, [fetchTarefas])
  );

  // 🔍 Filtrar tarefas do dia + repetição
  const tarefasDoDia = tarefas.filter((t) => {
    if (!t.data) return false;

    const dataTarefa = t.data;
    const diaSelecionado = dayjs(dataSelecionada);

    // 🔁 repetição (ex: seg,qua,sex)
    if (t.dias_repeticao && t.dias_repeticao.trim() !== "") {
      const rep = t.dias_repeticao.split(",");
      const diaSemana = diaSelecionado.day(); // 0 = dom

      const map: any = {
        dom: 0, seg: 1, ter: 2, qua: 3, qui: 4, sex: 5, sab: 6,
      };

      return rep.some((d: string) => map[d.trim()] === diaSemana);
    }

    return dataTarefa === dataSelecionada;
  });

  // 🔵 marcar datas no calendário
  const marcarDias = () => {
    const marked: any = {};

    tarefas.forEach((t) => {
      const d = t.data;
      if (!d) return;

      marked[d] = {
        marked: true,
        dotColor: colors.primary,
      };
    });

    marked[dataSelecionada] = {
      ...(marked[dataSelecionada] || {}),
      selected: true,
      selectedColor: colors.primary,
    };

    return marked;
  };

  // ✔ concluir
  const concluirTarefa = async (tarefa: any) => {
    Alert.alert("Confirmar", "Marcar esta tarefa como concluída?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Concluir",
        onPress: async () => {
          try {
            await api.patch(`/tarefas/${tarefa.tarefa_id}`, {
              ...tarefa,
              concluida: 1,
            });
            fetchTarefas();
          } catch {
            Alert.alert("Erro", "Não foi possível concluir a tarefa.");
          }
        },
      },
    ]);
  };

  // ❌ excluir
  const excluirTarefa = (id: number) => {
    Alert.alert("Excluir", "Deseja realmente excluir esta tarefa?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/tarefas/${id}`);
            fetchTarefas();
          } catch {
            Alert.alert("Erro", "Não foi possível excluir.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Tarefas</Text>

        <Calendar
          markedDates={marcarDias()}
          onDayPress={(d) => setDataSelecionada(d.dateString)}
          theme={{
            todayTextColor: colors.primary,
            selectedDayBackgroundColor: colors.primary,
          }}
        />

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : tarefasDoDia.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.muted }]}>
            Nenhuma tarefa neste dia.
          </Text>
        ) : (
          <FlatList
            data={tarefasDoDia}
            keyExtractor={(i) => i.tarefa_id.toString()}
            renderItem={({ item }) => (
              <View style={[styles.card, { backgroundColor: colors.card }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: colors.primary }]}>
                    {item.titulo}
                  </Text>
                  <Text
                    style={[
                      styles.status,
                      { color: item.concluida ? "#2ecc71" : "#e74c3c" },
                    ]}
                  >
                    {item.concluida ? "Concluída" : "Pendente"}
                  </Text>
                </View>

                <Text style={[styles.cardText, { color: colors.text }]}>
                  🕒 {item.hora || "—"}
                </Text>

                {item.detalhes ? (
                  <Text style={[styles.cardText, { color: colors.text }]}>
                    📝 {item.detalhes}
                  </Text>
                ) : null}

                {item.dias_repeticao ? (
                  <Text style={[styles.cardText, { color: colors.text }]}>
                    🔁 Repetição: {item.dias_repeticao}
                  </Text>
                ) : null}

                <View style={styles.actions}>
                  {!item.concluida && (
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: "#2ecc71" }]}
                      onPress={() => concluirTarefa(item)}
                    >
                      <Ionicons name="checkmark" size={20} color="#fff" />
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#3498db" }]}
                    onPress={() => navigation.navigate("EditTarefa", { tarefa: item })}
                  >
                    <Ionicons name="create-outline" size={20} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#e74c3c" }]}
                    onPress={() => excluirTarefa(item.tarefa_id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

        {/* Botão adicionar */}
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate("NovaTarefa")}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16 },
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardTitle: { fontSize: 18, fontWeight: "700" },
  cardText: { marginTop: 4, fontSize: 15 },
  status: { fontSize: 15, fontWeight: "700" },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtn: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});
