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

export default function Tarefas({ navigation }: any) {
  const { colors } = useTheme();

  const [tarefas, setTarefas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const hoje = new Date().toISOString().split("T")[0];
  const [dataSelecionada, setDataSelecionada] = useState(hoje);

  // 🔹 Buscar tarefas do paciente
  const fetchTarefas = useCallback(async () => {
    setLoading(true);
    try {
      const rawPaciente = await AsyncStorage.getItem("paciente");
      const paciente = rawPaciente ? JSON.parse(rawPaciente) : null;

      if (!paciente?.paciente_id) {
        setTarefas([]);
        setLoading(false);
        return;
      }

      const data = await api.get(`/tarefas?paciente_id=${paciente.paciente_id}`);
      setTarefas(data || []);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchTarefas(); }, [fetchTarefas]));

  // 📅 Filtrar tarefas por data
  const tarefasDoDia = tarefas.filter((t) => {
    if (!t.data) return false;
    const normalizada = t.data.includes("T") ? t.data.split("T")[0] : t.data;
    return normalizada === dataSelecionada;
  });

  // 🔵 Marcação no calendário
  const marcarDias = () => {
    const marked: any = {};

    tarefas.forEach((t) => {
      const date = t.data.includes("T") ? t.data.split("T")[0] : t.data;
      if (date) {
        marked[date] = { marked: true, dotColor: colors.primary };
      }
    });

    marked[dataSelecionada] = {
      selected: true,
      selectedColor: colors.primary,
    };

    return marked;
  };

  // 🟢 Alternar concluída
  const toggleConcluida = async (tarefa: any) => {
    try {
      await api.patch(`/tarefas/${tarefa.tarefa_id}`, {
        concluida: tarefa.concluida ? 0 : 1,
        titulo: tarefa.titulo,
        detalhes: tarefa.detalhes,
        data: tarefa.data,
        hora: tarefa.hora,
        dias_repeticao: tarefa.dias_repeticao || "",
      });

      fetchTarefas();
    } catch (err) {
      console.error("Erro ao atualizar conclusão:", err);
      Alert.alert("Erro", "Não foi possível atualizar o status.");
    }
  };

  // 🗑️ Excluir com confirmação
  const excluirTarefa = (id: number) => {
    Alert.alert(
      "Confirmar exclusão",
      "Deseja realmente excluir esta tarefa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/tarefas/${id}`);
              fetchTarefas();
              Alert.alert("Sucesso", "Tarefa excluída!");
            } catch (error) {
              console.error("Erro ao excluir:", error);
              Alert.alert("Erro", "Não foi possível excluir.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Tarefas</Text>

        {/* 🗓️ Calendário */}
        <Calendar
          markedDates={marcarDias()}
          onDayPress={(day) => setDataSelecionada(day.dateString)}
          theme={{
            todayTextColor: colors.primary,
            selectedDayBackgroundColor: colors.primary,
          }}
        />

        {/* 📋 Lista de tarefas */}
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />

        ) : tarefasDoDia.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.muted }]}>
            Nenhuma tarefa neste dia.
          </Text>

        ) : (
          <FlatList
            data={tarefasDoDia}
            keyExtractor={(item) => item.tarefa_id.toString()}
            renderItem={({ item }) => (
              <View style={[styles.card, { backgroundColor: colors.card }]}>

                <View style={styles.cardHeader}>
                  <TouchableOpacity onPress={() => toggleConcluida(item)}>
                    <Ionicons
                      name={item.concluida ? "checkbox" : "square-outline"}
                      size={26}
                      color={item.concluida ? "#2ecc71" : colors.primary}
                    />
                  </TouchableOpacity>

                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={[styles.cardTitle, { color: colors.primary }]}>
                      {item.titulo}
                    </Text>
                    <Text style={[styles.cardText, { color: colors.text }]}>
                      🕒 {item.hora}
                    </Text>
                  </View>

                  {/* Botões */}
                  <TouchableOpacity
                    onPress={() => navigation.navigate("EditTarefa", { tarefa: item })}
                  >
                    <Ionicons name="create-outline" size={22} color={colors.primary} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => excluirTarefa(item.tarefa_id)}>
                    <Ionicons name="trash-outline" size={22} color="#e74c3c" style={{ marginLeft: 12 }} />
                  </TouchableOpacity>
                </View>

                {item.detalhes ? (
                  <Text style={[styles.cardText, { marginTop: 4, color: colors.text }]}>
                    📝 {item.detalhes}
                  </Text>
                ) : null}

                {item.dias_repeticao ? (
                  <Text style={[styles.cardText, { marginTop: 4, color: colors.text }]}>
                    🔁 Repetição: {item.dias_repeticao}
                  </Text>
                ) : null}
              </View>
            )}
          />
        )}

        {/* ➕ Botão de adicionar */}
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

  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },

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
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardTitle: { fontSize: 18, fontWeight: "700" },
  cardText: { fontSize: 15 },

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
