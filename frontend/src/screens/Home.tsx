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
import styles from "../style/homeStyle";

export default function Home({ navigation }: any) {
  const { colors } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [paciente, setPaciente] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    const rawUser = await AsyncStorage.getItem("usuario");
    const rawPac = await AsyncStorage.getItem("paciente");

    if (rawUser) setUser(JSON.parse(rawUser));
    if (rawPac) setPaciente(JSON.parse(rawPac));

    setLoading(false);
  }

  // Carrega apenas na primeira vez
  useEffect(() => {
    load();
  }, []);

  // 🔄 Recarrega sempre que voltar para a Home
  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Loader */}
        {loading && (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 40 }}
          />
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
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  Informações do Paciente
                </Text>
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
                    <Text style={styles.cardLabel}>Observações:</Text>{" "}
                    {paciente.observacoes || "—"}
                  </Text>

                  <TouchableOpacity
                    style={[styles.editBtn, { backgroundColor: colors.primary }]}
                    onPress={() => navigation.navigate("EditPatient", { paciente })}
                  >
                    <Feather name="edit" size={16} color="#fff" />
                    <Text style={styles.editText}>Editar</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={[styles.emptyText, { color: colors.muted }]}>
                  Nenhum paciente vinculado.
                </Text>
              )}
            </View>

            {/* Acesso rápido */}
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>
              Acesso rápido
            </Text>

            <View style={styles.quickGrid}>
              {/* Tarefas */}
              <TouchableOpacity
                style={[styles.quickCard, { backgroundColor: colors.card }]}
                onPress={() => navigation.navigate("Tarefas")}
              >
                <Ionicons name="calendar-outline" size={28} color={colors.primary} />
                <Text style={[styles.quickText, { color: colors.text }]}>
                  Tarefas
                </Text>
              </TouchableOpacity>

              {/* Medicamentos */}
              <TouchableOpacity
                style={[styles.quickCard, { backgroundColor: colors.card }]}
                onPress={() => navigation.navigate("Medicamentos")}
              >
                <Ionicons name="medical-outline" size={28} color={colors.primary} />
                <Text style={[styles.quickText, { color: colors.text }]}>
                  Medicamentos
                </Text>
              </TouchableOpacity>

              {/* Diário */}
              <TouchableOpacity
                style={[styles.quickCard, { backgroundColor: colors.card }]}
                onPress={() => navigation.navigate("Diario")}
              >
                <Ionicons name="book-outline" size={28} color={colors.primary} />
                <Text style={[styles.quickText, { color: colors.text }]}>
                  Diário
                </Text>
              </TouchableOpacity>
            </View>

            {/* Aviso */}
            <View style={[styles.notice, { backgroundColor: colors.card }]}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={colors.accent}
              />
              <Text style={[styles.noticeText, { color: colors.text }]}>
                Mantenha os registros do paciente atualizados para um melhor cuidado 💙
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
