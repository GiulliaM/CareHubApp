import React, { useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";
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
import api from "../utils/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

export default function Tarefas({ navigation }: any) {
  const { colors } = useTheme();
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTarefas = useCallback(async () => {
    setLoading(true);
    try {
      const rawPaciente = await AsyncStorage.getItem("paciente");
      const paciente = rawPaciente ? JSON.parse(rawPaciente) : null;
      if (!paciente?.paciente_id) {
        setTarefas([]);
        setLoading(false);
        return;
      }
      const res = await api.get(`/tarefas?paciente_id=${paciente.paciente_id}`);
      setTarefas(res.data);
    } catch (err) {
      console.error("Erro ao carregar tarefas:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTarefas();
    }, [fetchTarefas])
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Tarefas</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 30 }} />
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
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={async () => {
                    try {
                      await api.patch(`/tarefas/${item.tarefa_id}`, { concluida: !item.concluida });
                      setTarefas((prev) => prev.map((t) => t.tarefa_id === item.tarefa_id ? { ...t, concluida: !t.concluida } : t));
                    } catch (e) {
                      Alert.alert("Erro", "Não foi possível atualizar a tarefa.");
                    }
                  }}
                >
                  <View style={[styles.checkboxBox, item.concluida && styles.checkboxChecked]} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: colors.primary }]}>{item.titulo}</Text>
                  <Text style={{ color: colors.text }}>{item.detalhes || ""}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', marginLeft: 12 }}>
                  <Text style={{ color: '#666', fontSize: 12 }}>{item.hora || item.horario || ''}</Text>
                  <Text style={{ color: '#666', fontSize: 12 }}>{item.data || ''}</Text>
                </View>
              </View>
            )}
          />
        )}

        <TouchableOpacity
          style={[styles.add, { backgroundColor: colors.primary }]}
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
    flexDirection: 'row',
    alignItems: 'center',
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
  checkbox: {
    marginRight: 12,
    alignSelf: 'center',
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: cores.primary,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: cores.primary,
  },
});
