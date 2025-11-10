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

export default function Medicamentos({ navigation }: any) {
  const [meds, setMeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${API_URL}/medicamentos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const j = await res.json();
        setMeds(j);
      } catch (err) {
        console.error("Erro ao buscar medicamentos:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Medicamentos</Text>

        {loading ? (
          <ActivityIndicator size="large" color={cores.primary} style={{ marginTop: 40 }} />
        ) : meds.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum medicamento cadastrado.</Text>
        ) : (
          <FlatList
            data={meds}
            keyExtractor={(i: any) =>
              i.medicamento_id?.toString() || Math.random().toString()
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.nome}</Text>
                <Text style={styles.cardText}>{item.dosagem || "Sem dosagem informada"}</Text>
              </View>
            )}
          />
        )}

        <TouchableOpacity
          style={styles.add}
          onPress={() => navigation.navigate("NovaMedicamento")}
        >
          <Text style={styles.addText}>+ Novo</Text>
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
    borderRadius: 12,
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
    marginBottom: 4,
  },
  cardText: {
    color: "#444",
  },
  add: {
    backgroundColor: cores.primary,
    padding: 14,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 16,
  },
  addText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
