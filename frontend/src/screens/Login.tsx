import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import styles from "../style/loginStyle";
import { saveToken } from "../utils/auth";
import { API_URL } from "../config/api";

export default function Login({ navigation }: any) {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert("Campos obrigatórios", "Preencha o e-mail e a senha.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/usuarios/login`, {
        email,
        senha,
      });

      // Agora o backend SEMPRE retorna: { usuario: {...}, token }
      if (res.status === 200 && res.data.usuario && res.data.token) {
        const token = res.data.token;
        const userData = res.data.usuario;

        try {
          // LIMPEZA COMPLETA: Remove todos os dados antigos
          await AsyncStorage.multiRemove(["usuario", "paciente", "token"]);
        } catch (e) {
          console.log("⚠️ Erro ao limpar AsyncStorage:", e);
        }

        // Salva novos dados
        await saveToken(token);
        await AsyncStorage.setItem("usuario", JSON.stringify(userData));

        console.log("✅ Login bem-sucedido:", userData.nome);
        console.log("📝 Dados salvos no AsyncStorage:", {
          usuario_id: userData.usuario_id,
          nome: userData.nome,
          email: userData.email,
          tipo: userData.tipo,
        });

        Alert.alert("Bem-vindo!", "Login realizado com sucesso.");

        // Resetar navegação para Tabs
        navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
      } else {
        Alert.alert("Erro", "Credenciais inválidas.");
      }
    } catch (error: any) {
      console.log("❌ Erro no login:", error);
      if (error.response) {
        console.log("📡 Resposta do servidor:", error.response.data);
        Alert.alert("Erro", error.response.data.message || "Credenciais inválidas.");
      } else if (error.request) {
        console.log("📡 Sem resposta do servidor");
        Alert.alert("Erro", "Não foi possível conectar ao servidor. Verifique sua conexão.");
      } else {
        console.log("❌ Erro:", error.message);
        Alert.alert("Erro", "Ocorreu um erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={[styles.title, { color: colors.primary }]}>Entrar</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        {/* Senha */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Senha"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={senha}
            onChangeText={setSenha}
          />

          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Botão */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
          <Text style={[styles.link, { color: colors.primary }]}>
            Não tem uma conta? Cadastre-se
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
