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
import { saveToken } from "../utils/auth";

export default function Register({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("familiar");

  const cadastrar = async () => {
    if (!nome || !email || !senha)
      return Alert.alert("Campos obrigatórios", "Preencha todos os campos.");

    try {
      const res = await fetch(`${API_URL}/usuarios/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, tipo }),
      });
      const json = await res.json();

      if (!res.ok) return Alert.alert(json.message || "Erro ao cadastrar.");

      await saveToken(json.token);
      navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
    } catch (err) {
      Alert.alert("Erro", "Falha de conexão com o servidor.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Cadastrar Usuário</Text>

        <TextInput
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.btn} onPress={cadastrar}>
          <Text style={styles.btnText}>Criar Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkWrap}
          onPress={() => navigation.navigate("RegisterPatient")}
        >
          <Text style={styles.link}>Cadastrar Paciente</Text>
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
  linkWrap: { alignItems: "center", marginTop: 12 },
  link: { color: cores.primary, fontWeight: "600" },
});
