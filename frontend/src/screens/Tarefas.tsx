import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import api from "../utils/apiClient";

export default function Tarefas({ navigation }: any) {
  const { colors } = useTheme();
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSelecionada, setDataSelecionada] = useState(
    new Date().toISOString().split("T")[0]
  );

  // 🧠 Busca todas as tarefas do paciente
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

  // 🗓️ Filtra tarefas do dia selecionado
  const tarefasDoDia = tarefas.filter((t) => {
    if (!t.data) return false;
    const dataNormalizada = t.data.includes("T") ? t.data.split("T")[0] : t.data;
    return dataNormalizada === dataSelecionada;
  });

  // 🔹 Marca no calendário os dias com tarefas
  const marcarDias = () => {
    const marked: any = {};
    tarefas.forEach((t) => {
      const date = t.data?.includes("T") ? t.data.split("T")[0] : t.data;
      if (date) marked[date] = { marked: true, dotColor: colors.primary };
    });
    marked[dataSelecionada] = { selected: true, selectedColor: colors.primary };
    return marked;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Tarefas</Text>

        {/* Calendário funcional */}
        <Calendar
          markedDates={marcarDias()}
          onDayPress={(day) => setDataSelecionada(day.dateString)}
          theme={{
            todayTextColor: colors.primary,
            selectedDayBackgroundColor: colors.primary,
          }}
        />

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : tarefasDoDia.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma tarefa neste dia.</Text>
        ) : (
          <FlatList
            data={tarefasDoDia}
            keyExtractor={(item) => item.tarefa_id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={[styles.cardTitle, { color: colors.primary }]}>
                  {item.titulo}
                </Text>
                <Text style={styles.cardText}>🕒 {item.hora || "—"}</Text>
                <Text style={styles.cardText}>📝 {item.detalhes || "Sem detalhes"}</Text>
                {item.dias_repeticao && (
                  <Text style={styles.cardText}>
                    🔁 Repetição: {item.dias_repeticao || "—"}
                  </Text>
                )}
                <Text
                  style={[
                    styles.status,
                    { color: item.concluida ? "green" : colors.primary },
                  ]}
                >
                  {item.concluida ? "✅ Concluída" : "⏱️ Pendente"}
                </Text>
              </View>
            )}
          />
        )}

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate("NovaTarefa")}
        >
          <Text style={styles.addText}>+ Nova Tarefa</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  emptyText: { textAlign: "center", color: "#666", marginTop: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardTitle: { fontSize: 18, fontWeight: "700" },
  cardText: { color: "#444", marginTop: 2 },
  status: { fontWeight: "700", marginTop: 8 },
  addButton: { padding: 14, borderRadius: 10, alignItems: "center", marginTop: 10 },
  addText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
