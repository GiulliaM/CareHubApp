import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import cores from "../config/cores";
import { API_URL } from "../config/api";
import { saveToken } from "../utils/auth";
export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const login = async () => {
    if (!email || !senha) return Alert.alert("Preencha os campos");
    try {
      const res = await fetch(`${API_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
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
      <Text style={styles.title}>Entrar</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry style={styles.input} />
      <TouchableOpacity style={styles.btn} onPress={login}><Text style={styles.btnText}>Entrar</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}><Text style={styles.link}>Criar conta</Text></TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: cores.background },
  title: { fontSize: 22, fontWeight: "700", color: cores.primary, marginBottom: 16 },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginTop: 8 },
  btn: { backgroundColor: cores.primary, padding: 14, borderRadius: 12, marginTop: 16, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
  link: { color: cores.primary, marginTop: 12, textAlign: "center" }
});
