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
import cores from "../config/cores";
import { useTheme } from '../context/ThemeContext';
import { API_URL } from "../config/api";
import { getToken } from "../utils/auth";

export default function NovoRegistro({ navigation }: any) {
  const { colors } = useTheme();
  const [texto, setTexto] = useState("");

  async function handleSalvar() {
    if (!texto) {
      Alert.alert("Erro", "Escreva algo no registro antes de salvar.");
      return;
    }

    try {
      const token = await getToken();
      await fetch(`${API_URL}/diario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ texto }),
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

        <TextInput
          style={[styles.input, { height: 150 }]}
          placeholder="Escreva seu registro diário aqui..."
          value={texto}
          onChangeText={setTexto}
          multiline
        />

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSalvar}>
          <Text style={styles.buttonText}>Salvar</Text>
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
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
