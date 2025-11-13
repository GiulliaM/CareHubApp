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
import { useTheme } from "../context/ThemeContext";
import { API_URL } from "../config/api";
import { getToken } from "../utils/auth";
import { Ionicons } from "@expo/vector-icons";

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
      const rawPaciente = await AsyncStorage.getItem("paciente");
      const paciente = rawPaciente ? JSON.parse(rawPaciente) : null;

      if (!paciente?.paciente_id) {
        Alert.alert("Erro", "Nenhum paciente cadastrado.");
        return;
      }

      const hoje = new Date();
      const dataFormatada = hoje.toISOString().split("T")[0];
      const horaFormatada = hoje.toTimeString().split(" ")[0];

      await fetch(`${API_URL}/diario`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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

        {/* Card principal */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>

          <Text style={[styles.label, { color: colors.text }]}>Atividades realizadas</Text>
          <TextInput
            style={[styles.input, { height: 110 }]}
            placeholder="Ex: Caminhada, leitura, jogos..."
            placeholderTextColor={colors.muted}
            value={atividades}
            onChangeText={setAtividades}
            multiline
          />

          <Text style={[styles.label, { color: colors.text }]}>Comentário / Observações</Text>
          <TextInput
            style={[styles.input, { height: 140 }]}
            placeholder="Como foi o dia? Alguma observação importante?"
            placeholderTextColor={colors.muted}
            value={comentario}
            onChangeText={setComentario}
            multiline
          />

        </View>

        {/* Botões */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={18} color="#fff" />
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSalvar}
          >
            <Ionicons name="checkmark" size={20} color="#fff" />
            <Text style={styles.saveText}>Salvar</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  container: {
    padding: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 12,
    marginBottom: 18,
    textAlignVertical: "top",
    fontSize: 15,
  },

  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: "#b71c1c",
    padding: 12,
    borderRadius: 10,
    marginRight: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },

  cancelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    marginLeft: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
