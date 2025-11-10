import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import cores from "../config/cores";
import { API_URL } from "../config/api";
import { saveToken } from "../utils/auth";
export default function Register({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("familiar");
  const cadastrar = async () => {
    if (!nome || !email || !senha) return Alert.alert("Preencha os campos");
    try {
      const res = await fetch(`${API_URL}/usuarios/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, tipo })
      });
      const json = await res.json();
      if (!res.ok) return Alert.alert(json.message || "Erro");
      await saveToken(json.token);
      navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
    } catch (err) {
      Alert.alert("Erro de conexão");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar</Text>
      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" style={styles.input} />
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry style={styles.input} />
      <TouchableOpacity style={styles.btn} onPress={() => cadastrar()}><Text style={styles.btnText}>Criar conta</Text></TouchableOpacity>
      <TouchableOpacity style={styles.linkWrap} onPress={() => navigation.navigate("RegisterPatient")}><Text style={styles.link}>Cadastrar paciente</Text></TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: cores.background },
  title: { fontSize: 22, fontWeight: "700", color: cores.primary, marginBottom: 16 },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginTop: 8 },
  btn: { backgroundColor: cores.primary, padding: 14, borderRadius: 12, marginTop: 16, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
  link: { color: cores.primary, marginTop: 12, textAlign: "center" },
  linkWrap: { alignItems: "center" }
});
