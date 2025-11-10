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

export default function Diario({ navigation }: any) {
  const [registros, setRegistros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/diario`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setRegistros(data);
      } catch (error) {
        console.error("Erro ao carregar registros:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Diário</Text>

        {loading ? (
          <ActivityIndicator size="large" color={cores.primary} style={{ marginTop: 30 }} />
        ) : registros.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum registro encontrado.</Text>
        ) : (
          <FlatList
            data={registros}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.data}</Text>
                <Text style={styles.cardText}>{item.texto}</Text>
              </View>
            )}
          />
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("NovoRegistro")}
        >
          <Text style={styles.addButtonText}>+ Novo Registro</Text>
        </TouchableOpacity>
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
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: "700",
    color: cores.primary,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 15,
    color: "#333",
  },
  addButton: {
    backgroundColor: cores.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
