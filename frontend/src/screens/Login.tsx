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
import { saveToken, saveUserMeta } from "../utils/auth";
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

      if (res.status === 200 && res.data.token) {
        const token = res.data.token;
        const id = res.data.usuario_id;

        // Salva o token no AsyncStorage
        await saveToken(token);

        // 🔹 Buscar o perfil completo do usuário
        try {
          const profileRes = await fetch(`${API_URL}/usuarios/perfil/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (profileRes.ok) {
            const profileJson = await profileRes.json();
            const userData = {
              usuario_id: profileJson.usuario_id,
              nome: profileJson.nome,
              email: profileJson.email,
              tipo: profileJson.tipo,
            };

            // ✅ Salva usuário no AsyncStorage
            await AsyncStorage.setItem("usuario", JSON.stringify(userData));
            await saveUserMeta(userData);
          } else {
            // Caso a rota /perfil falhe, salva o mínimo necessário
            await AsyncStorage.setItem(
              "usuario",
              JSON.stringify({ usuario_id: id })
            );
          }
        } catch (e) {
          console.warn("Não foi possível obter perfil após login", e);
        }

        Alert.alert("Bem-vindo!", "Login realizado com sucesso.");
        navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
      } else {
        Alert.alert("Erro", "Credenciais inválidas. Verifique e tente novamente.");
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível realizar o login. Verifique sua conexão.");
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

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={[styles.link, { color: colors.primary }]}>
            Não tem uma conta? Cadastre-se
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
