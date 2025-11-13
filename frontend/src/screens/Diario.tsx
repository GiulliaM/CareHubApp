import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { API_URL } from "../config/api";
import { getToken } from "../utils/auth";
import { useFocusEffect } from "@react-navigation/native";

export default function Diario({ navigation }: any) {
  const { colors } = useTheme();
  const [registros, setRegistros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistros = useCallback(async () => {
    setLoading(true);
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
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRegistros();
    }, [fetchRegistros])
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Diário</Text>

        {/* Lista */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 30 }}
          />
        ) : registros.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.text }]}>
            Nenhum registro encontrado.
          </Text>
        ) : (
          <FlatList
            data={registros}
            keyExtractor={(item) =>
              item.registro_id?.toString() || Math.random().toString()
            }
            renderItem={({ item }) => (
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card || "#fff",
                    borderColor: colors.muted,
                  },
                ]}
              >
                {/* Cabeçalho */}
                <View style={styles.cardHeader}>
                  <View>
                    <Text
                      style={[
                        styles.cardDate,
                        { color: colors.primary, fontWeight: "700" },
                      ]}
                    >
                      {new Date(item.data).toLocaleDateString("pt-BR")}
                    </Text>
                    <Text style={[styles.cardTime, { color: colors.text }]}>
                      {item.hora ? item.hora.slice(0, 5) : ""}
                    </Text>
                  </View>

                  <Ionicons
                    name="journal-outline"
                    size={26}
                    color={colors.primary}
                  />
                </View>

                {/* Atividades */}
                {item.atividades && (
                  <View style={styles.cardSection}>
                    <Text
                      style={[
                        styles.cardLabel,
                        { color: colors.muted, marginBottom: 4 },
                      ]}
                    >
                      Atividades:
                    </Text>
                    <Text style={[styles.cardText, { color: colors.text }]}>
                      {item.atividades}
                    </Text>
                  </View>
                )}

                {/* Comentário */}
                {item.comentario && (
                  <View style={styles.cardSection}>
                    <Text
                      style={[
                        styles.cardLabel,
                        { color: colors.muted, marginBottom: 4 },
                      ]}
                    >
                      Comentário:
                    </Text>
                    <Text style={[styles.cardText, { color: colors.text }]}>
                      {item.comentario}
                    </Text>
                  </View>
                )}
              </View>
            )}
          />
        )}

        {/* Botão flutuante */}
        <TouchableOpacity
          style={[styles.floatingBtn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate("NovoRegistro")}
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
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 18,
  },

  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },

  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  cardDate: {
    fontSize: 17,
    fontWeight: "700",
  },

  cardTime: {
    fontSize: 14,
    marginTop: 3,
  },

  cardSection: {
    marginBottom: 10,
  },

  cardLabel: {
    fontSize: 13,
    fontWeight: "600",
  },

  cardText: {
    fontSize: 15,
    lineHeight: 20,
  },

  floatingBtn: {
    position: "absolute",
    bottom: 26,
    right: 26,
    width: 58,
    height: 58,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});
