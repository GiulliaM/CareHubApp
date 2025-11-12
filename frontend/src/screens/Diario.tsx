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
import cores from "../config/cores";
import { useTheme } from '../context/ThemeContext';
import { API_URL } from "../config/api";
import { getToken } from "../utils/auth";
import { useFocusEffect } from '@react-navigation/native';

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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Diário</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 30 }} />
        ) : registros.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum registro encontrado.</Text>
        ) : (
          <FlatList
            data={registros}
            keyExtractor={(item) => item.registro_id?.toString() || Math.random().toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardDate, { color: colors.primary }]}>
                    {new Date(item.data).toLocaleDateString('pt-BR')}
                  </Text>
                  <Text style={styles.cardTime}>
                    {item.hora ? item.hora.slice(0, 5) : ''}
                  </Text>
                </View>
                
                {item.atividades && (
                  <View style={styles.cardSection}>
                    <Text style={styles.cardLabel}>Atividades:</Text>
                    <Text style={[styles.cardText, { color: colors.text }]}>
                      {item.atividades}
                    </Text>
                  </View>
                )}
                
                {item.comentario && (
                  <View style={styles.cardSection}>
                    <Text style={styles.cardLabel}>Comentário:</Text>
                    <Text style={[styles.cardText, { color: colors.text }]}>
                      {item.comentario}
                    </Text>
                  </View>
                )}
              </View>
            )}
          />
        )}

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cardDate: {
    fontWeight: "700",
    fontSize: 16,
    color: cores.primary,
  },
  cardTime: {
    fontSize: 14,
    color: "#666",
  },
  cardSection: {
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  cardTitle: {
    fontWeight: "700",
    color: cores.primary,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 20,
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
