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
import { useTheme } from '../context/ThemeContext';
import { API_URL } from "../config/api";
import { saveToken, saveUserMeta } from "../utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Register({ navigation }: any) {
  const { colors } = useTheme();
  const [step, setStep] = useState(1);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("familiar");
  const [nomePaciente, setNomePaciente] = useState("");
  const [idadePaciente, setIdadePaciente] = useState("");

  const cadastrarCompleto = async () => {
    if (!nome || !email || !senha || !nomePaciente) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos do usuário e do paciente.");
      return;
    }
    try {
      // 1. Cadastrar usuário
      const res = await fetch(`${API_URL}/usuarios/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, tipo }),
      });
      const json = await res.json();
      if (!res.ok) return Alert.alert(json.message || "Erro ao cadastrar usuário.");
      await saveToken(json.token);
      await saveUserMeta({ usuario_id: json.usuario_id, nome, tipo });

      // 2. Cadastrar paciente vinculado
      const token = json.token;
      const resPac = await fetch(`${API_URL}/pacientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome: nomePaciente, idade: idadePaciente || null }),
      });
      const jsonPac = await resPac.json();
      if (!resPac.ok) return Alert.alert(jsonPac.message || "Erro ao cadastrar paciente.");
      await AsyncStorage.setItem("paciente", JSON.stringify({ paciente_id: jsonPac.paciente_id, nome: nomePaciente, idade: idadePaciente }));

      // 3. Ir para o app
      navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
    } catch (err) {
      Alert.alert("Erro", "Falha de conexão com o servidor.");
    }
  };

  if (step === 1) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}
      >
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
          <TouchableOpacity style={styles.btn} onPress={() => setStep(2)}>
            <Text style={styles.btnText}>Próximo</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
  // Etapa 2: Cadastro do paciente
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Cadastrar Paciente Vinculado</Text>
        <TextInput
          placeholder="Nome do paciente"
          value={nomePaciente}
          onChangeText={setNomePaciente}
          style={styles.input}
        />
        <TextInput
          placeholder="Idade"
          value={idadePaciente}
          onChangeText={setIdadePaciente}
          keyboardType="numeric"
          style={styles.input}
        />
        <TouchableOpacity style={styles.btn} onPress={cadastrarCompleto}>
          <Text style={styles.btnText}>Finalizar Cadastro</Text>
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
