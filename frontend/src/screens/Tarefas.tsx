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
import { API_URL } from "../config/api";
import { getToken } from "../utils/auth";

export default function Tarefas({ navigation }: any) {
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${API_URL}/tarefas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const j = await res.json();
        setTarefas(j);
      } catch (err) {
        console.error("Erro ao carregar tarefas:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Tarefas</Text>

        {loading ? (
          <ActivityIndicator size="large" color={cores.primary} style={{ marginTop: 30 }} />
        ) : tarefas.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma tarefa cadastrada.</Text>
        ) : (
          <FlatList
            data={tarefas}
            keyExtractor={(i: any) =>
              i.tarefa_id?.toString() || Math.random().toString()
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.titulo}</Text>
                <Text>{item.detalhes || ""}</Text>
              </View>
            )}
          />
        )}

        <TouchableOpacity
          style={styles.add}
          onPress={() => navigation.navigate("NovaTarefa")}
        >
          <Text style={styles.addText}>+ Nova</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.background },
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: cores.primary,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 30,
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardTitle: {
    fontWeight: "700",
    color: cores.primary,
    marginBottom: 4,
  },
  add: {
    backgroundColor: cores.primary,
    padding: 14,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 16,
  },
  addText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
