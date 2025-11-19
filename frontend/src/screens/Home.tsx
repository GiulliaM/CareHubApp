// Home.tsx completo com dashboard integrada e mantendo todo seu estilo do homeStyle
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";
import api from "../utils/apiClient";
import styles from "../style/homeStyle";

dayjs.locale("pt-br");

export default function Home({ navigation }: any) {
  const { colors } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [paciente, setPaciente] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Dashboard states
  const [qtdTarefasHoje, setQtdTarefasHoje] = useState(0);
  const [qtdMedHoje, setQtdMedHoje] = useState(0);
  const [qtdDiarioHoje, setQtdDiarioHoje] = useState(0);

  const hoje = dayjs().format("YYYY-MM-DD");

  async function load() {
    setLoading(true);

    const rawUser = await AsyncStorage.getItem("usuario");
    const rawPac = await AsyncStorage.getItem("paciente");

    if (rawUser) setUser(JSON.parse(rawUser));
    if (rawPac) setPaciente(JSON.parse(rawPac));

    setLoading(false);
  }

  async function carregarDashboard() {
    if (!paciente?.paciente_id) return;

    try {
      // Tarefas
      const tarefas = await api.get(`/tarefas?paciente_id=${paciente.paciente_id}`);
      const tarefasHoje = (tarefas || []).filter((t: any) => t.data === hoje);
      setQtdTarefasHoje(tarefasHoje.length);

      // Medicamentos
      const med = await api.get(`/medicamentos?paciente_id=${paciente.paciente_id}`);
      const medHoje = (med || []).filter((m: any) => m.horario && dayjs(m.horario).format("YYYY-MM-DD") === hoje);
      setQtdMedHoje(medHoje.length);

      // Diário
      const diario = await api.get(`/diario?paciente_id=${paciente.paciente_id}`);
      const diarioHoje = (diario || []).filter((d: any) => dayjs(d.data).format("YYYY-MM-DD") === hoje);
      setQtdDiarioHoje(diarioHoje.length);
    } catch (err) {
      console.log("Erro ao carregar dashboard:", err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  // Assim que paciente carregar, carrega a dashboard
  useEffect(() => {
    if (paciente) carregarDashboard();
  }, [paciente]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}> 
      <ScrollView contentContainerStyle={styles.container}>
        {loading && (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        )}

        {!loading && (
          <>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={[styles.welcome, { color: colors.primary }]}>
                  Olá, {user?.nome?.split(" ")[0] || "usuário"}
                </Text>
                <Text style={[styles.welcomeSubtitle, { color: colors.text }]}>
                  Aqui está o resumo do seu cuidado de hoje
                </Text>
              </View>

              <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
                <Image
                  source={require("../../../assets/bandaid-heart.webp")}
                  style={styles.avatar}
                />
              </TouchableOpacity>
            </View>

            {/* Card do Paciente */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.cardHeaderRow}>
                <Feather name="user" size={20} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.text }]}> Informações do Paciente </Text>
              </View>

              {paciente ? (
                <>
                  <Text style={[styles.cardInfo, { color: colors.text }]}>
                    <Text style={styles.cardLabel}>Nome:</Text> {paciente.nome}
                  </Text>
                  <Text style={[styles.cardInfo, { color: colors.text }]}>
                    <Text style={styles.cardLabel}>Idade:</Text> {paciente.idade || "—"}
                  </Text>
                  <Text style={[styles.cardInfo, { color: colors.text }]}>
                    <Text style={styles.cardLabel}>Gênero:</Text> {paciente.genero || "—"}
                  </Text>
                  <Text style={[styles.cardInfo, { color: colors.text }]}>
                    <Text style={styles.cardLabel}>Observações:</Text> {paciente.observacoes || "—"}
                  </Text>

                  <TouchableOpacity style={[styles.editBtn, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate("EditPatient", { paciente })}>
                    <Feather name="edit" size={16} color="#fff" />
                    <Text style={styles.editText}>Editar</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={[styles.emptyText, { color: colors.muted }]}>Nenhum paciente vinculado.</Text>
              )}
            </View>

            {/* DASHBOARD DO DIA */}
            <View style={[styles.card, { backgroundColor: colors.card }]}> 
              <View style={styles.cardHeaderRow}> 
                <Ionicons name="bar-chart-outline" size={22} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>Resumo de Hoje</Text>
              </View>

              <Text style={[styles.cardInfo, { color: colors.text }]}> 📌 Tarefas de hoje: <Text style={styles.cardLabel}>{qtdTarefasHoje}</Text> </Text>
              <Text style={[styles.cardInfo, { color: colors.text }]}> 💊 Medicamentos hoje: <Text style={styles.cardLabel}>{qtdMedHoje}</Text> </Text>
              <Text style={[styles.cardInfo, { color: colors.text }]}> 📖 Diário hoje: <Text style={styles.cardLabel}>{qtdDiarioHoje}</Text> </Text>
            </View>

            {/* Acesso rápido */}
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Acesso rápido</Text>

            <View style={styles.quickGrid}>
              <TouchableOpacity style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => navigation.navigate("Tarefas")}>
                <Ionicons name="calendar-outline" size={28} color={colors.primary} />
                <Text style={[styles.quickText, { color: colors.text }]}>Tarefas</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => navigation.navigate("Medicamentos")}>
                <Ionicons name="medical-outline" size={28} color={colors.primary} />
                <Text style={[styles.quickText, { color: colors.text }]}>Medicamentos</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => navigation.navigate("Diario")}>
                <Ionicons name="book-outline" size={28} color={colors.primary} />
                <Text style={[styles.quickText, { color: colors.text }]}>Diário</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.notice, { backgroundColor: colors.card }]}> 
              <Ionicons name="information-circle-outline" size={22} color={colors.accent} />
              <Text style={[styles.noticeText, { color: colors.text }]}>Mantenha os registros do paciente atualizados 💙</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}