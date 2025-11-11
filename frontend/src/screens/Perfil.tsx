import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import cores from "../config/cores";
import { useTheme } from '../context/ThemeContext';
import { logout, getUserMeta } from "../utils/auth";
import api from "../utils/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

export default function Perfil({ navigation }: any) {
  const [user, setUser] = useState<{ usuario_id?: number; nome?: string; tipo?: string } | null>(null);
  const [paciente, setPaciente] = useState<{ paciente_id?: number; nome?: string; idade?: string } | null>(null);

  const fetchProfile = useCallback(async () => {
    const meta = await getUserMeta();
    if (meta?.usuario_id) {
      try {
        const res = await api.get(`/usuarios/perfil/${meta.usuario_id}`);
        setUser(res.data);
      } catch {
        setUser(meta);
      }
    } else {
      setUser(meta);
    }
    // Buscar paciente vinculado
    try {
      const rawPaciente = await AsyncStorage.getItem("paciente");
      setPaciente(rawPaciente ? JSON.parse(rawPaciente) : null);
    } catch {
      setPaciente(null);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  async function handleLogout() {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
  }

  const { colors, themeName, setThemeName } = useTheme();

  async function handleToggleTheme(value: boolean) {
    try {
      await setThemeName(value ? 'dark' : 'light');
    } catch (e) {
      console.warn('Erro ao trocar tema', e);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Meu Perfil</Text>

        <View style={styles.card}>
          <Text style={[styles.text, { color: colors.text }]}>Usuário: {user?.nome || "-"}</Text>
          <Text style={[styles.text, { color: colors.text }]}>Tipo: {user?.tipo || "-"}</Text>
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate("EditUser", { user })}>
            <Text style={styles.editBtnText}>Editar Usuário</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={[styles.text, { color: colors.text }]}>Paciente: {paciente?.nome || "-"}</Text>
          <Text style={[styles.text, { color: colors.text }]}>Idade: {paciente?.idade || "-"}</Text>
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate("EditPatient", { paciente })}>
            <Text style={styles.editBtnText}>Editar Paciente</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }] }>
          <View>
            <Text style={[styles.text, { color: colors.text, fontWeight: '700' }]}>Tema</Text>
            <Text style={[styles.text, { color: colors.text }]}>{themeName === 'dark' ? 'Escuro' : 'Claro'}</Text>
          </View>
          <Switch
            value={themeName === 'dark'}
            onValueChange={handleToggleTheme}
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor={themeName === 'dark' ? '#fff' : '#fff'}
          />
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.background },
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 24,
    color: cores.primary,
    fontWeight: "700",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
  },
  text: { color: "#333", fontSize: 16, marginBottom: 4 },
  button: {
    backgroundColor: cores.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  editBtn: {
    backgroundColor: cores.primary,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  editBtnText: { color: "#fff", fontWeight: "600" },
});
