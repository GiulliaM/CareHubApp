import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import api from "../utils/apiClient";

dayjs.locale("pt-br");

export default function ViewTarefa({ route, navigation }: any) {
  const { colors } = useTheme();
  const { tarefa } = route.params;

  if (!tarefa) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
      >
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Tarefa não encontrada.
          </Text>

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

  // 🔹 Ajuste de data para não mudar de dia devido ao timezone
  const dataCorrigida = tarefa.data
    ? dayjs(tarefa.data + "T00:00:00").format("DD/MM/YYYY")
    : "—";

  // 🗑️ Excluir tarefa
  const handleDelete = () => {
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
            await api.delete(`/tarefas/${tarefa.tarefa_id}`);
            Alert.alert("Sucesso", "Tarefa excluída com sucesso!");
            navigation.goBack();
          } catch (err) {
            console.error("Erro ao excluir tarefa:", err);
            Alert.alert("Erro", "Não foi possível excluir a tarefa.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.primary }]}>
          Detalhes da Tarefa
        </Text>

        <View style={[styles.card, { backgroundColor: colors.card || "#fff" }]}>
          {/* Título */}
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
              Data: <Text style={styles.bold}>{dataCorrigida}</Text>
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
            <Text style={[styles.infoText, { color: colors.text }]}>
              Detalhes:{" "}
              <Text style={styles.bold}>
                {tarefa.detalhes || "Sem detalhes"}
              </Text>
            </Text>
          </View>

          {/* Repetição */}
          {tarefa.dias_repeticao && tarefa.dias_repeticao !== "" && (
            <View style={styles.infoRow}>
              <Ionicons name="repeat-outline" size={20} color={colors.accent} />
              <Text style={[styles.infoText, { color: colors.text }]}>
                Repetição:{" "}
                <Text style={styles.bold}>{tarefa.dias_repeticao}</Text>
              </Text>
            </View>
          )}

          {/* Status */}
          <View style={styles.infoRow}>
            <Ionicons
              name={
                tarefa.concluida
                  ? "checkmark-circle-outline"
                  : "alert-circle-outline"
              }
              size={20}
              color={tarefa.concluida ? "#2ecc71" : colors.primary}
            />
            <Text style={[styles.infoText, { color: colors.text }]}>
              Status:{" "}
              <Text
                style={[
                  styles.bold,
                  { color: tarefa.concluida ? "#2ecc71" : colors.primary },
                ]}
              >
                {tarefa.concluida ? "Concluída" : "Pendente"}
              </Text>
            </Text>
          </View>
        </View>

        {/* Botões */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#1976D2" }]}
            onPress={() => navigation.navigate("EditTarefa", { tarefa })}
          >
            <Ionicons name="create-outline" size={18} color="#fff" />
            <Text style={styles.btnText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#E53935" }]}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={18} color="#fff" />
            <Text style={styles.btnText}>Excluir</Text>
          </TouchableOpacity>
        </View>

        {/* VOLTAR */}
        <TouchableOpacity
          style={[styles.btnBack, { backgroundColor: colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={18} color="#fff" />
          <Text style={styles.btnBackText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

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

  bold: {
    fontWeight: "700",
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 14,
  },

  actionBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  btnBack: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    gap: 6,
  },

  btnBackText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
