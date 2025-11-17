import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/pt-br";

dayjs.extend(utc);
dayjs.locale("pt-br");

export default function ViewTarefa({ route, navigation }: any) {
  const { colors } = useTheme();
  const { tarefa } = route.params;

  if (!tarefa) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.text }]}>Tarefa não encontrada.</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.btnBack, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="arrow-back" size={18} color="#fff" />
            <Text style={styles.btnBackText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Corrige a data usando UTC (evita cair no dia seguinte)
  const dataFormatada = tarefa.data
    ? dayjs.utc(tarefa.data).format("DD/MM/YYYY")
    : "—";

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.primary }]}>Detalhes da Tarefa</Text>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {/* Header */}
          <View style={styles.headerCard}>
            <Ionicons name="clipboard-outline" size={32} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {tarefa.titulo}
            </Text>
          </View>

          {/* Data */}
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={colors.accent} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              Data: <Text style={styles.bold}>{dataFormatada}</Text>
            </Text>
          </View>

          {/* Hora */}
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color={colors.accent} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              Hora: <Text style={styles.bold}>{tarefa.hora || "—"}</Text>
            </Text>
          </View>

          {/* Detalhes */}
          <View style={styles.infoRow}>
            <Ionicons name="document-text-outline" size={20} color={colors.accent} />
            <Text style={[styles.infoText, { color: colors.text, flex: 1 }]}>
              {tarefa.detalhes || "Sem detalhes"}
            </Text>
          </View>

          {/* Repetição */}
          {tarefa.dias_repeticao ? (
            <View style={styles.infoRow}>
              <Ionicons name="repeat-outline" size={20} color={colors.accent} />
              <Text style={[styles.infoText, { color: colors.text }]}>
                Repetição:{" "}
                <Text style={styles.bold}>
                  {tarefa.dias_repeticao === "todos"
                    ? "Todos os dias"
                    : tarefa.dias_repeticao === ""
                    ? "Nenhuma"
                    : tarefa.dias_repeticao.replace(/,/g, ", ")}
                </Text>
              </Text>
            </View>
          ) : null}

          {/* Status */}
          <View style={styles.infoRow}>
            <Ionicons
              name={tarefa.concluida ? "checkmark-circle" : "time-outline"}
              size={22}
              color={tarefa.concluida ? "#2ecc71" : colors.primary}
            />
            <Text
              style={[
                styles.status,
                { color: tarefa.concluida ? "#2ecc71" : colors.primary },
              ]}
            >
              {tarefa.concluida ? "Concluída" : "Pendente"}
            </Text>
          </View>
        </View>

        {/* Botão voltar */}
        <TouchableOpacity
          style={[styles.btnBack, { backgroundColor: colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={18} color="#fff" />
          <Text style={styles.btnBackText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, marginBottom: 12 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  cardTitle: { fontSize: 20, fontWeight: "700" },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  infoText: { fontSize: 16 },
  bold: { fontWeight: "700" },
  status: { fontSize: 16, fontWeight: "700" },
  btnBack: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  btnBackText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
