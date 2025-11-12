import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import cores from "../config/cores";
import { useTheme } from '../context/ThemeContext';
import { API_URL } from "../config/api";
import { getToken } from "../utils/auth";

export default function NovoRegistro({ navigation }: any) {
  const { colors } = useTheme();
  const [comentario, setComentario] = useState("");
  const [atividades, setAtividades] = useState("");

  async function handleSalvar() {
    if (!comentario && !atividades) {
      Alert.alert("Erro", "Escreva algo no registro antes de salvar.");
      return;
    }

    try {
      const token = await getToken();
      
      // Buscar paciente_id do AsyncStorage
      const rawPaciente = await AsyncStorage.getItem("paciente");
      const paciente = rawPaciente ? JSON.parse(rawPaciente) : null;

      if (!paciente?.paciente_id) {
        Alert.alert("Erro", "Nenhum paciente cadastrado.");
        return;
      }

      const hoje = new Date();
      const dataFormatada = hoje.toISOString().split('T')[0]; // "2025-11-12"
      const horaFormatada = hoje.toTimeString().split(' ')[0]; // "14:30:00"

      await fetch(`${API_URL}/diario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: dataFormatada,
          hora: horaFormatada,
          atividades: atividades || null,
          comentario: comentario || null,
          paciente_id: paciente.paciente_id,
        }),
      });
      
      Alert.alert("Sucesso", "Registro adicionado!");
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível salvar o registro.");
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Novo Registro</Text>

        <Text style={styles.label}>Atividades realizadas</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Ex: Caminhada, leitura, jogos..."
          value={atividades}
          onChangeText={setAtividades}
          multiline
        />

        <Text style={styles.label}>Comentário / Observações</Text>
        <TextInput
          style={[styles.input, { height: 120 }]}
          placeholder="Como foi o dia? Alguma observação importante?"
          value={comentario}
          onChangeText={setComentario}
          multiline
        />

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSalvar}>
          <Text style={styles.buttonText}>Salvar Registro</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.background },
  container: { padding: 16 },
  title: {
    fontSize: 24,
    color: cores.primary,
    fontWeight: "700",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 12,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 16,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: cores.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
