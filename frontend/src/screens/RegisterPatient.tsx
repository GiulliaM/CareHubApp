import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import cores from "../config/cores";
import { API_URL } from "../config/api";
import { getToken } from "../utils/auth";
export default function RegisterPatient({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const cadastrar = async () => {
    if (!nome) return Alert.alert("Informe o nome do paciente");
    const token = await getToken();
    try {
      const res = await fetch(`${API_URL}/pacientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nome, idade: idade || null })
      });
      const json = await res.json();
      if (!res.ok) return Alert.alert(json.message || "Erro");
      Alert.alert("Paciente cadastrado");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Erro de conexão");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Paciente</Text>
      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput placeholder="Idade" value={idade} onChangeText={setIdade} style={styles.input} keyboardType="numeric" />
      <TouchableOpacity style={styles.btn} onPress={cadastrar}><Text style={styles.btnText}>Salvar</Text></TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: cores.background },
  title: { fontSize: 20, fontWeight: "700", color: cores.primary, marginBottom: 12 },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginTop: 8 },
  btn: { backgroundColor: cores.primary, padding: 14, borderRadius: 12, marginTop: 16, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" }
});
