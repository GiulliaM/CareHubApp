import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import cores from "../config/cores";
import { useTheme } from "../context/ThemeContext";
import { logout, getUserMeta } from "../utils/auth";
import api from "../utils/apiClient";

export default function Perfil({ navigation }: any) {
  const [user, setUser] = useState<{ usuario_id?: number; nome?: string; email?: string; tipo?: string } | null>(null);
  const [paciente, setPaciente] = useState<{ paciente_id?: number; nome?: string; idade?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const { colors, themeName, setThemeName } = useTheme();

  // 🔹 Buscar dados do usuário e paciente
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      
      // Busca usuário logado do AsyncStorage
      const meta = await getUserMeta();
      
      console.log("🔍 Debug AsyncStorage:", {
        metaCompleto: meta,
        temUsuarioId: !!meta?.usuario_id,
        temNome: !!meta?.nome,
      });

      if (!meta) {
        console.log("❌ Meta é null - fazendo logout");
        Alert.alert("Sessão Expirada", "Por favor, faça login novamente.");
        await logout();
        return navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
      }

      if (!meta.usuario_id) {
        console.log("❌ usuario_id não existe no meta:", meta);
        Alert.alert("Erro de Sessão", "Dados de usuário incompletos. Faça login novamente.");
        await logout();
        return navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
      }

      console.log("👤 Carregando perfil de:", meta.nome, "ID:", meta.usuario_id);

      // Buscar usuário atualizado do backend
      const res = await api.get(`/usuarios/perfil/${meta.usuario_id}`);
      if (res && res.nome) {
        const userData = {
          usuario_id: res.usuario_id,
          nome: res.nome,
          email: res.email,
          tipo: res.tipo,
        };
        setUser(userData);
        // Atualiza também o AsyncStorage
        await AsyncStorage.setItem("usuario", JSON.stringify(userData));
        console.log("✅ Perfil atualizado:", userData.nome);
      } else {
        setUser(meta);
      }

      // Buscar paciente vinculado
      const pacienteRes = await api.get("/pacientes");
      if (Array.isArray(pacienteRes) && pacienteRes.length > 0) {
        setPaciente(pacienteRes[0]);
        await AsyncStorage.setItem("paciente", JSON.stringify(pacienteRes[0]));
        console.log("🏥 Paciente carregado:", pacienteRes[0].nome);
      } else if (pacienteRes && typeof pacienteRes === "object") {
        setPaciente(pacienteRes);
        await AsyncStorage.setItem("paciente", JSON.stringify(pacienteRes));
        console.log("🏥 Paciente carregado:", pacienteRes.nome);
      } else {
        setPaciente(null);
        await AsyncStorage.removeItem("paciente");
        console.log("⚠️ Nenhum paciente vinculado");
      }
    } catch (err) {
      console.error("❌ Erro ao carregar perfil:", err);
      Alert.alert("Erro", "Não foi possível carregar as informações do perfil.");
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  //  Logout
  async function handleLogout() {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
  }

  //  Alternar tema
  async function handleToggleTheme(value: boolean) {
    try {
      await setThemeName(value ? "dark" : "light");
    } catch (e) {
      console.warn("Erro ao trocar tema", e);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 10, color: colors.text }}>Carregando perfil...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={[styles.title, { color: colors.primary }]}>Meu Perfil</Text>

        {/* Cartão do Usuário */}
        <View style={[styles.card, { backgroundColor: colors.card || "#fff" }]}>
          <View style={styles.headerCard}>
            <Ionicons name="person-circle-outline" size={36} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Informações do Usuário</Text>
          </View>

          <Text style={styles.text}>
            <Text style={styles.label}>Nome: </Text>{user?.nome || "—"}
          </Text>

          <Text style={styles.text}>
            <Text style={styles.label}>E-mail: </Text>{user?.email || "—"}
          </Text>

          <Text style={styles.text}>
            <Text style={styles.label}>Tipo: </Text>{user?.tipo || "—"}
          </Text>

          <TouchableOpacity
            style={[styles.btnEdit, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate("EditUser", { user })}
          >
            <Ionicons name="create-outline" size={18} color="#fff" />
            <Text style={styles.btnEditText}>Editar Usuário</Text>
          </TouchableOpacity>
        </View>

        {/* Cartão do Paciente */}
        <View style={[styles.card, { backgroundColor: colors.card || "#fff" }]}>
          <View style={styles.headerCard}>
            <Ionicons name="medkit-outline" size={32} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Paciente Vinculado</Text>
          </View>

          <Text style={styles.text}>
            <Text style={styles.label}>Nome: </Text>{paciente?.nome || "—"}
          </Text>

          <Text style={styles.text}>
            <Text style={styles.label}>Idade: </Text>{paciente?.idade || "—"}
          </Text>

          <TouchableOpacity
            style={[styles.btnEdit, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate("EditPatient", { paciente })}
          >
            <Ionicons name="create-outline" size={18} color="#fff" />
            <Text style={styles.btnEditText}>Editar Paciente</Text>
          </TouchableOpacity>
        </View>

        {/* Tema */}
        <View style={[styles.themeCard, { backgroundColor: colors.card || "#fff" }]}>
          <View style={styles.themeLeft}>
            <Ionicons
              name={themeName === "dark" ? "moon" : "sunny"}
              size={28}
              color={themeName === "dark" ? "#FFD36E" : "#F4B400"}
            />
            <View>
              <Text style={[styles.themeTitle, { color: colors.text }]}>
                {themeName === "dark" ? "Modo Escuro" : "Modo Claro"}
              </Text>
              <Text style={[styles.themeDesc, { color: colors.muted }]}>
                {themeName === "dark"
                  ? "Interface confortável para ambientes escuros"
                  : "Visual mais nítido em ambientes iluminados"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => handleToggleTheme(themeName !== "dark")}
            style={[
              styles.themeToggle,
              {
                backgroundColor: themeName === "dark" ? "#0B3B5A" : "#D4AF37",
                shadowColor: themeName === "dark" ? "#000" : "#FFD36E",
              },
            ]}
          >
            <Ionicons
              name={themeName === "dark" ? "sunny-outline" : "moon-outline"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: "#c62828" }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
      )}
    </SafeAreaView>
  );
}

//  Estilos 
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { padding: 16 },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },

  label: {
    fontWeight: "700",
    color: "#0B3B5A",
  },

  btnEdit: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
    gap: 6,
  },

  btnEditText: {
    color: "#fff",
    fontWeight: "700",
  },

  themeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  themeLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },

  themeTitle: {
    fontSize: 17,
    fontWeight: "700",
  },

  themeDesc: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },

  themeToggle: {
    width: 46,
    height: 46,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
