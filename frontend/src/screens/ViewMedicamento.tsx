import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

export default function ViewMedicamento({ route, navigation }: any) {
  const { colors } = useTheme();
  const { medicamento } = route.params;

  if (!medicamento) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Medicamento não encontrado.
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.btnBack, { backgroundColor: colors.primary }]}>
            <Ionicons name="arrow-back" size={18} color="#fff" />
            <Text style={styles.btnBackText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.primary }]}>Detalhes do Medicamento</Text>

        <View style={[styles.card, { backgroundColor: colors.card || "#fff" }]}>
          <View style={styles.headerCard}>
            <Ionicons name="medkit-outline" size={32} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>{medicamento.nome}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="tablet-portrait-outline" size={20} color={colors.accent} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              Dosagem: <Text style={styles.bold}>{medicamento.dosagem || "—"}</Text>
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color={colors.accent} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              Horários:{" "}
              <Text style={styles.bold}>
                {Array.isArray(medicamento.horarios)
                  ? medicamento.horarios.join(", ")
                  : medicamento.horarios || "—"}
              </Text>
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={colors.accent} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              Início:{" "}
              <Text style={styles.bold}>
                {medicamento.inicio
                  ? dayjs(medicamento.inicio).format("DD/MM/YYYY")
                  : "—"}
              </Text>
            </Text>
          </View>

          {medicamento.data_fim && (
            <View style={styles.infoRow}>
              <Ionicons name="calendar-clear-outline" size={20} color={colors.accent} />
              <Text style={[styles.infoText, { color: colors.text }]}>
                Término:{" "}
                <Text style={styles.bold}>
                  {dayjs(medicamento.data_fim).format("DD/MM/YYYY")}
                </Text>
              </Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Ionicons name="hourglass-outline" size={20} color={colors.accent} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              Duração:{" "}
              <Text style={styles.bold}>
                {medicamento.duracao_days
                  ? `${medicamento.duracao_days} dias`
                  : medicamento.uso_continuo
                  ? "Uso contínuo"
                  : "—"}
              </Text>
            </Text>
          </View>

          {medicamento.intervalo_horas && (
            <View style={styles.infoRow}>
              <Ionicons name="repeat-outline" size={20} color={colors.accent} />
              <Text style={[styles.infoText, { color: colors.text }]}>
                Intervalo:{" "}
                <Text style={styles.bold}>
                  {medicamento.intervalo_horas}h
                </Text>
              </Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={20} color={colors.accent} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              Tipo de Agendamento:{" "}
              <Text style={styles.bold}>
                {medicamento.tipo_agendamento === "manual"
                  ? "Manual"
                  : "Por intervalo"}
              </Text>
            </Text>
          </View>

          {medicamento.dias_semana && (
            <View style={styles.infoRow}>
              <Ionicons name="calendar-number-outline" size={20} color={colors.accent} />
              <Text style={[styles.infoText, { color: colors.text }]}>
                Dias da Semana:{" "}
                <Text style={styles.bold}>
                  {medicamento.dias_semana
                    .split(",")
                    .map((d: string) =>
                      ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][parseInt(d, 10)]
                    )
                    .join(", ")}
                </Text>
              </Text>
            </View>
          )}
        </View>

        {/* Botão de voltar */}
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

// Estilos
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { padding: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 12,
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
    gap: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    flexShrink: 1,
  },
  bold: { fontWeight: "700" },
  btnBack: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    gap: 6,
  },
  btnBackText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
