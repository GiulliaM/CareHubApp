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
import { Ionicons } from "@expo/vector-icons";

export default function Tarefas({ navigation }: any) {
  const { colors } = useTheme();
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSelecionada, setDataSelecionada] = useState(
    new Date().toISOString().split("T")[0]
  );

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
    const dataNormalizada = t.data.includes("T") ? t.data.split("T")[0] : t.data;
    return dataNormalizada === dataSelecionada;
  });

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

        {/* 🗓️ Calendário */}
        <Calendar
          markedDates={marcarDias()}
          onDayPress={(day) => setDataSelecionada(day.dateString)}
          theme={{
            todayTextColor: colors.primary,
            selectedDayBackgroundColor: colors.primary,
          }}
        />

        {/* Lista */}
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
                <Text style={[styles.cardTitle, { color: colors.primary }]}>
                  {item.titulo}
                </Text>

                <Text style={[styles.cardText, { color: colors.text }]}>
                  🕒 {item.hora || "—"}
                </Text>

                <Text style={[styles.cardText, { color: colors.text }]}>
                  📝 {item.detalhes || "Sem detalhes"}
                </Text>

                {item.dias_repeticao && (
                  <Text style={[styles.cardText, { color: colors.text }]}>
                    🔁 Repetição: {item.dias_repeticao}
                  </Text>
                )}

                <Text
                  style={[
                    styles.status,
                    { color: item.concluida ? "#2ecc71" : colors.primary },
                  ]}
                >
                  {item.concluida ? "✅ Concluída" : "⏱️ Pendente"}
                </Text>
              </View>
            )}
          />
        )}

        {/* ➕ Botão Flutuante */}
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
  cardTitle: { fontSize: 18, fontWeight: "700" },
  cardText: { marginTop: 4, fontSize: 15 },
  status: { marginTop: 8, fontWeight: "700" },

  // 🔵 Botão flutuante
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
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});
