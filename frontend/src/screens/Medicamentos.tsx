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
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import api from "../utils/apiClient";

export default function Medicamentos({ navigation }: any) {
  const { colors } = useTheme();
  const [medicamentos, setMedicamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🧩 Buscar medicamentos do paciente
  const fetchMedicamentos = useCallback(async () => {
    setLoading(true);
    try {
      const rawPaciente = await AsyncStorage.getItem("paciente");
      const paciente = rawPaciente ? JSON.parse(rawPaciente) : null;

      if (!paciente?.paciente_id) {
        setMedicamentos([]);
        setLoading(false);
        return;
      }

      const { data } = await api.get(`/medicamentos?paciente_id=${paciente.paciente_id}`);
      setMedicamentos(data || []);
    } catch (error) {
      console.error("Erro ao carregar medicamentos:", error);
      setMedicamentos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchMedicamentos(); }, [fetchMedicamentos]));

  // 🗑️ Excluir medicamento
  const handleDelete = (id: number) => {
    Alert.alert("Excluir medicamento", "Deseja realmente excluir este medicamento?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/medicamentos/${id}`);
            fetchMedicamentos();
          } catch (err) {
            console.error("Erro ao excluir medicamento:", err);
          }
        },
      },
    ]);
  };

  // 🕓 Formatar data (YYYY-MM-DD → DD/MM/YYYY)
  const formatarData = (data: string) => {
    if (!data) return "—";
    const partes = data.includes("T") ? data.split("T")[0].split("-") : data.split("-");
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : data;
  };

  // ⏰ Formatar horários
  const formatarHorarios = (horarios: any) => {
    if (!horarios) return "—";
    if (Array.isArray(horarios)) return horarios.join(", ");
    try {
      const parsed = JSON.parse(horarios);
      if (Array.isArray(parsed)) return parsed.join(", ");
    } catch {}
    return horarios;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Medicamentos</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : medicamentos.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum medicamento cadastrado.</Text>
        ) : (
          <FlatList
            data={medicamentos}
            keyExtractor={(item) => item.medicamento_id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: colors.primary }]}>{item.nome}</Text>
                  <Text style={styles.cardText}>💊 Dosagem: {item.dosagem || "—"}</Text>
                  <Text style={styles.cardText}>
                    🕒 Horários: {formatarHorarios(item.horarios)}
                  </Text>
                  <Text style={styles.cardText}>
                    📅 Início: {formatarData(item.inicio)}
                  </Text>
                  <Text style={styles.cardText}>
                    ⏳ Duração: {item.duracao_days ? `${item.duracao_days} dias` : "—"}
                  </Text>
                  <Text style={styles.cardText}>
                    🔁 Uso contínuo: {item.uso_continuo ? "Sim" : "Não"}
                  </Text>
                  <Text
                    style={[
                      styles.status,
                      { color: item.concluido ? "green" : colors.primary },
                    ]}
                  >
                    {item.concluido ? "✅ Concluído" : "⏱️ Em uso"}
                  </Text>
                </View>

                {/* ✏️ Ações */}
                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("EditMedicamento", { medicamento: item })
                    }
                  >
                    <Ionicons name="create-outline" size={22} color={colors.primary} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleDelete(item.medicamento_id)}>
                    <Ionicons name="trash-outline" size={22} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate("NovaMedicamento")}
        >
          <Text style={styles.addText}>+ Novo Medicamento</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
  emptyText: { textAlign: "center", color: "#666", marginTop: 30 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: { fontSize: 18, fontWeight: "700" },
  cardText: { color: "#444", marginTop: 2 },
  status: { fontWeight: "700", marginTop: 8 },
  actions: { justifyContent: "space-around", alignItems: "center", marginLeft: 10 },
  addButton: { padding: 14, borderRadius: 10, alignItems: "center", marginTop: 10 },
  addText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
