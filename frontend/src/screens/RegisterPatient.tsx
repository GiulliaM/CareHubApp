import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import cores from "../config/cores";
import { API_URL } from "../config/api";
import { getToken } from "../utils/auth";

export default function RegisterPatient({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");

  const cadastrar = async () => {
    if (!nome) return Alert.alert("Erro", "Informe o nome do paciente.");

    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/pacientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, idade: idade || null }),
      });

      const json = await res.json();
      if (!res.ok) return Alert.alert(json.message || "Erro ao cadastrar.");

      Alert.alert("Sucesso", "Paciente cadastrado!");
      navigation.goBack();
    } catch {
      Alert.alert("Erro", "Falha de conexão com o servidor.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Cadastrar Paciente</Text>

        <TextInput
          placeholder="Nome do paciente"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />
        <TextInput
          placeholder="Idade"
          value={idade}
          onChangeText={setIdade}
          keyboardType="numeric"
          style={styles.input}
        />

        <TouchableOpacity style={styles.btn} onPress={cadastrar}>
          <Text style={styles.btnText}>Salvar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.background },
  container: { flexGrow: 1, padding: 16, justifyContent: "center" },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: cores.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  btn: {
    backgroundColor: cores.primary,
    padding: 14,
    borderRadius: 10,
    marginTop: 16,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
