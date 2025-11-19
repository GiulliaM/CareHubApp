import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  LayoutAnimation,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/apiClient";
import { useFocusEffect } from "@react-navigation/native";

// Imports do dayjs com plugin de locale
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/pt-br";

// Configuração de idioma e início da semana
dayjs.extend(updateLocale);
dayjs.locale("pt-br");
dayjs.updateLocale("pt-br", { weekStart: 1 });

export default function Medicamentos({ navigation }: any) {
  const { colors } = useTheme();
  const [medicamentos, setMedicamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [weekDays, setWeekDays] = useState<dayjs.Dayjs[]>([]);

  // Gera dias da semana (segunda a domingo)
  const generateWeekDays = useCallback((baseDate: dayjs.Dayjs) => {
    const startOfWeek = baseDate.startOf("week");
    const days = Array.from({ length: 7 }).map((_, i) =>
      startOfWeek.add(i, "day")
    );
    setWeekDays(days);
  }, []);

  useEffect(() => {
    generateWeekDays(selectedDate);
  }, [selectedDate]);

  // Buscar medicamentos do paciente logado
    const fetchMedicamentos = useCallback(async () => {
      try {
        setLoading(true);

        const rawPaciente = await AsyncStorage.getItem("paciente");
        const paciente = rawPaciente ? JSON.parse(rawPaciente) : null;

        if (!paciente?.paciente_id) {
          Alert.alert("Aviso", "Nenhum paciente vinculado encontrado.");
          setMedicamentos([]);
          return;
        }

        console.log("Buscando medicamentos do paciente ID:", paciente.paciente_id);

        // ⭐ AQUI ESTÁ A CORREÇÃO ⭐
        const response = await api.get(`/medicamentos/${paciente.paciente_id}`);

        console.log("Response bruto:", response);

        // Como response JÁ é o array:
        setMedicamentos(Array.isArray(response) ? response : []);

      } catch (err: any) {
        console.error("Erro ao buscar medicamentos:", err.response?.data || err.message);
        Alert.alert("Erro", "Não foi possível carregar os medicamentos.");
      } finally {
        setLoading(false);
      }
    }, []);



  useFocusEffect(
    useCallback(() => {
      fetchMedicamentos();
    }, [fetchMedicamentos])
  );

  // Filtra medicamentos pelo dia selecionado
  const medicamentosDoDia = medicamentos.filter((m) => {
    if (!m.inicio) return false;

    const dataInicio = dayjs(m.inicio.split("T")[0]);

    if (m.uso_continuo === 1 || m.uso_continuo === true) {
      return (
        selectedDate.isSame(dataInicio, "day") ||
        selectedDate.isAfter(dataInicio, "day")
      );
    }

    if (m.duracao_days && m.duracao_days > 0) {
      const dataFim = dataInicio.add(m.duracao_days - 1, "day");
      return (
        (selectedDate.isSame(dataInicio, "day") ||
          selectedDate.isAfter(dataInicio, "day")) &&
        (selectedDate.isSame(dataFim, "day") ||
          selectedDate.isBefore(dataFim, "day"))
      );
    }

    return selectedDate.isSame(dataInicio, "day");
  });

  // Excluir medicamento
  const handleExcluir = async (id: number) => {
    Alert.alert(
      "Confirmar exclusão",
      "Deseja realmente excluir este medicamento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/medicamentos/${id}`);
              fetchMedicamentos();
              Alert.alert("Sucesso", "Medicamento excluído com sucesso!");
            } catch (error) {
              console.error("Erro ao excluir medicamento:", error);
              Alert.alert("Erro", "Não foi possível excluir o medicamento.");
            }
          },
        },
      ]
    );
  };

  // Navegação semanal
  const handleNextWeek = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedDate(selectedDate.add(7, "day"));
  };

  const handlePrevWeek = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedDate(selectedDate.subtract(7, "day"));
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Medicamentos</Text>

        {/* Calendário semanal */}
        <View style={styles.calendarContainer}>
          <TouchableOpacity onPress={handlePrevWeek}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </TouchableOpacity>

          {weekDays.map((day, index) => {
            const isSelected = day.isSame(selectedDate, "day");
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayItem,
                  isSelected && { backgroundColor: colors.primary },
                ]}
                onPress={() => setSelectedDate(day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    { color: isSelected ? "#fff" : colors.text },
                  ]}
                >
                  {day.format("dd").toUpperCase()}
                </Text>
                <Text
                  style={[
                    styles.dayNumber,
                    { color: isSelected ? "#fff" : colors.text },
                  ]}
                >
                  {day.format("D")}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity onPress={handleNextWeek}>
            <Ionicons name="chevron-forward" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Lista de medicamentos */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 40 }}
          />
        ) : medicamentosDoDia.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.muted }]}>
            Nenhum medicamento para este dia.
          </Text>
        ) : (
          <FlatList
            data={medicamentosDoDia}
            keyExtractor={(item) => item.medicamento_id.toString()}
            renderItem={({ item }) => (
              <View
                style={[styles.card, { backgroundColor: colors.card || "#fff" }]}
              >
                <View style={styles.cardHeader}>
                  <Ionicons
                    name="medkit-outline"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    {item.nome}
                  </Text>
                </View>

                <Text style={[styles.cardInfo, { color: colors.text }]}>
                  💊 {item.dosagem}
                </Text>
                <Text style={[styles.cardInfo, { color: colors.text }]}>
                  ⏰ {item.horarios?.join(", ")}
                </Text>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#1976D2" }]}
                    onPress={() =>
                      navigation.navigate("ViewMedicamento", { medicamento: item })
                    }
                  >
                    <Ionicons name="eye-outline" size={18} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#2196F3" }]}
                    onPress={() =>
                      navigation.navigate("EditMedicamento", { medicamento: item })
                    }
                  >
                    <Ionicons name="create-outline" size={18} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#E53935" }]}
                    onPress={() => handleExcluir(item.medicamento_id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

        {/* ➕ Botão novo medicamento */}
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate("NovaMedicamento")}
        >
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Estilos
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  calendarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dayItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  dayText: { fontSize: 12, fontWeight: "600" },
  dayNumber: { fontSize: 14, fontWeight: "700" },
  emptyText: { textAlign: "center", fontSize: 16, marginTop: 40 },
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  cardTitle: { fontSize: 17, fontWeight: "700" },
  cardInfo: { fontSize: 15, marginBottom: 4 },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    gap: 10,
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
    width: 56,
    height: 56,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});
