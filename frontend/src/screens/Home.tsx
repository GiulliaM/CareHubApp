import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import cores from "../config/cores";
import { useTheme } from '../context/ThemeContext';
import { API_URL } from "../config/api";
import { getToken } from "../utils/auth";

export default function Home({ navigation }: any) {
  const { colors } = useTheme();
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [medicamentos, setMedicamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const [resTarefas, resMedicamentos] = await Promise.all([
          fetch(`${API_URL}/tarefas`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/medicamentos`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const dataTarefas = await resTarefas.json();
        const dataMedicamentos = await resMedicamentos.json();

        setTarefas(dataTarefas);
        setMedicamentos(dataMedicamentos);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }] }>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Resumo do Dia</Text>

        {loading ? (
          <ActivityIndicator size="large" color={cores.primary} style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* 🗂️ Tarefas */}
            <View style={styles.section}>
              <View style={styles.header}>
                  <Text style={[styles.sectionTitle, { color: colors.primary }]}>Tarefas</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Tarefas")}>
                    <Text style={[styles.link, { color: colors.primary }]}>Ver todas</Text>
                </TouchableOpacity>
              </View>

              {tarefas.length === 0 ? (
                <Text style={styles.emptyText}>Nenhuma tarefa para hoje.</Text>
              ) : (
                <FlatList
                  data={tarefas.slice(0, 3)}
                  keyExtractor={(item) => item.tarefa_id?.toString() || Math.random().toString()}
                  renderItem={({ item }) => (
                    <View style={styles.card}>
                      <Text style={[styles.cardTitle, { color: colors.primary }]}>{item.titulo}</Text>
                      <Text style={[styles.cardText, { color: colors.text }]}>{item.detalhes}</Text>
                    </View>
                  )}
                />
              )}
            </View>

            {/* 💊 Medicamentos */}
            <View style={styles.section}>
              <View style={styles.header}>
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>Medicamentos</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Medicamentos")}>
                  <Text style={[styles.link, { color: colors.primary }]}>Ver todos</Text>
                </TouchableOpacity>
              </View>

              {medicamentos.length === 0 ? (
                <Text style={styles.emptyText}>Nenhum medicamento agendado.</Text>
              ) : (
                <FlatList
                  data={medicamentos.slice(0, 3)}
                  keyExtractor={(item) =>
                    item.medicamento_id?.toString() || Math.random().toString()
                  }
                  renderItem={({ item }) => (
                    <View style={styles.card}>
                      <Text style={[styles.cardTitle, { color: colors.primary }]}>{item.nome}</Text>
                      <Text style={[styles.cardText, { color: colors.text }]}>{item.dosagem}</Text>
                    </View>
                  )}
                />
              )}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: cores.background,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: cores.primary,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: cores.primary,
  },
  link: {
    color: cores.primary,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 15,
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: "700",
    color: cores.primary,
    marginBottom: 2,
  },
  cardText: {
    fontSize: 15,
    color: "#333",
  },
});
