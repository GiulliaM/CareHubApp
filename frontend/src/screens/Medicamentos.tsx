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
import api from "../utils/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

export default function Medicamentos({ navigation }: any) {
  const { colors } = useTheme();
  const [meds, setMeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMeds = useCallback(async () => {
    setLoading(true);
    try {
      const rawPaciente = await AsyncStorage.getItem("paciente");
      const paciente = rawPaciente ? JSON.parse(rawPaciente) : null;
      if (!paciente?.paciente_id) {
        setMeds([]);
        setLoading(false);
        return;
      }
      const res = await api.get(`/medicamentos?paciente_id=${paciente.paciente_id}`);
      setMeds(res.data);
    } catch (err) {
      console.error("Erro ao buscar medicamentos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMeds();
    }, [fetchMeds])
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Medicamentos</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : meds.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum medicamento cadastrado.</Text>
        ) : (
          <FlatList
            data={meds}
            keyExtractor={(i: any) =>
              i.medicamento_id?.toString() || Math.random().toString()
            }
            renderItem={({ item }) => (
              <View style={[styles.card, { flexDirection: 'row', alignItems: 'center' }]}>
                <TouchableOpacity
                  style={{ marginRight: 12, alignSelf: 'center' }}
                  onPress={async () => {
                    try {
                      await api.patch(`/medicamentos/${item.medicamento_id}`, { concluido: !item.concluido });
                      setMeds((prev) => prev.map((m) => m.medicamento_id === item.medicamento_id ? { ...m, concluido: !m.concluido } : m));
                    } catch (e) {
                      alert("Não foi possível atualizar o medicamento.");
                    }
                  }}
                >
                  <View style={{ width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: colors.primary, backgroundColor: item.concluido ? colors.primary : '#fff' }} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: colors.primary }]}>{item.nome}</Text>
                  <Text style={[styles.cardText, { color: colors.text }]}>{item.dosagem || "Sem dosagem informada"}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', marginLeft: 12 }}>
                  <Text style={{ color: '#666', fontSize: 12 }}>{item.horario || item.hora || ''}</Text>
                  <Text style={{ color: '#666', fontSize: 12 }}>{item.intervalo || ''}</Text>
                </View>
              </View>
            )}
          />
        )}

        <TouchableOpacity
          style={[styles.add, { backgroundColor: colors.primary }]}
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
