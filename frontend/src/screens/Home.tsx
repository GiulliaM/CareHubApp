import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { API_URL } from "../config/api";
import { getToken } from "../utils/auth";
import styles from "../style/homeStyle";
import { jwtDecode } from "jwt-decode";

export default function Home({ navigation }: any) {
  const { colors } = useTheme();
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [medicamentos, setMedicamentos] = useState<any[]>([]);
  const [paciente, setPaciente] = useState<any>(null);
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dataHoraAtual, setDataHoraAtual] = useState(new Date());

  // Atualiza o relógio a cada minuto
  useEffect(() => {
    const timer = setInterval(() => setDataHoraAtual(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Formata data e hora atual
  const formatarDataHora = (data: Date) => {
    const dias = [
      "domingo",
      "segunda-feira",
      "terça-feira",
      "quarta-feira",
      "quinta-feira",
      "sexta-feira",
      "sábado",
    ];
    const meses = [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ];

    const diaSemana = dias[data.getDay()];
    const dia = data.getDate();
    const mes = meses[data.getMonth()];
    const ano = data.getFullYear();

    const hora = data.getHours().toString().padStart(2, "0");
    const minutos = data.getMinutes().toString().padStart(2, "0");

    return `Hoje é ${diaSemana}, ${dia} de ${mes} de ${ano} — ${hora}:${minutos}`;
  };

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("Token não encontrado");

        const decoded: any = jwtDecode(token);
        const userId = decoded?.usuario_id;

        // Primeiro busca os pacientes e o usuário
        const [resUsuario, resPacientes] = await Promise.all([
          fetch(`${API_URL}/usuarios/perfil/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/pacientes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const dataUsuario = await resUsuario.json();
        const dataPacientes = await resPacientes.json();

        setUsuario(dataUsuario);

        // Se há pacientes, busca detalhes, tarefas e medicamentos
        if (Array.isArray(dataPacientes) && dataPacientes.length > 0) {
          const primeiroPaciente = dataPacientes[0];
          const pacienteId = primeiroPaciente.paciente_id;

          const [resTarefas, resMedicamentos, resPacienteDetalhes] =
            await Promise.all([
              fetch(`${API_URL}/tarefas?paciente_id=${pacienteId}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
              fetch(`${API_URL}/medicamentos?paciente_id=${pacienteId}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
              fetch(`${API_URL}/pacientes/${pacienteId}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
            ]);

          const dataTarefas = await resTarefas.json();
          const dataMedicamentos = await resMedicamentos.json();
          const pacienteDetalhes = await resPacienteDetalhes.json();

          // 🔹 Filtra tarefas do dia atual (corrigido)
          const hoje = new Date().toLocaleDateString("en-CA"); // Ex: "2025-11-13"
          const tarefasHoje = Array.isArray(dataTarefas)
            ? dataTarefas.filter((t: any) => {
                const dataTarefa = t.data?.split("T")[0];
                return dataTarefa === hoje;
              })
            : [];

          setTarefas(tarefasHoje);
          setMedicamentos(Array.isArray(dataMedicamentos) ? dataMedicamentos : []);
          setPaciente(pacienteDetalhes);
        } else {
          // Sem pacientes cadastrados
          setTarefas([]);
          setMedicamentos([]);
          setPaciente(null);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resumoDia = () => {
    const qtdTarefas = tarefas.length;
    const qtdMedicamentos = medicamentos.length;

    if (qtdTarefas === 0 && qtdMedicamentos === 0)
      return "Você não tem compromissos hoje 🎉";
    if (qtdTarefas > 0 && qtdMedicamentos === 0)
      return `Você tem ${qtdTarefas} tarefa${qtdTarefas > 1 ? "s" : ""} hoje.`;
    if (qtdTarefas === 0 && qtdMedicamentos > 0)
      return `Você tem ${qtdMedicamentos} medicamento${qtdMedicamentos > 1 ? "s" : ""} para hoje.`;
    return `Você tem ${qtdTarefas} tarefa${qtdTarefas > 1 ? "s" : ""} e ${qtdMedicamentos} medicamento${qtdMedicamentos > 1 ? "s" : ""} hoje.`;
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.container}>
        {/* 👋 Boas-vindas */}
        <View style={styles.headerArea}>
          <View>
            <Text style={[styles.welcome, { color: colors.primary }]}>
              Olá{usuario ? `, ${usuario.nome}` : ""}! 👋
            </Text>
            <Text style={[styles.subtitle, { color: colors.text }]}>
              {formatarDataHora(dataHoraAtual)}
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: colors.primary, marginTop: 4, fontWeight: "600" },
              ]}
            >
              {resumoDia()}
            </Text>
          </View>
          <Image
            source={require("../../../assets/bandaid-heart.webp")}
            style={styles.profileIcon}
          />
        </View>

        {/* 🧑‍⚕️ Card do Paciente */}
        {paciente ? (
          <View style={styles.profileCard}>
            <Text style={styles.profileTitle}>Informações do Paciente</Text>
            <Text style={styles.profileText}>Nome: {paciente.nome}</Text>
            <Text style={styles.profileText}>
              Idade: {paciente.idade || "—"}
            </Text>
            <Text style={styles.profileText}>
              Gênero: {paciente.genero || "—"}
            </Text>
            <Text style={styles.profileText}>
              Observações: {paciente.observacoes || "—"}
            </Text>
            <Text style={styles.profileText}>
              Cadastrado em:{" "}
              {paciente.created_at
                ? new Date(paciente.created_at).toLocaleDateString("pt-BR")
                : "—"}
            </Text>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate("EditPatient", { paciente: paciente })
              }
            >
              <Text style={styles.editButtonText}>Editar informações</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.profileCard}>
            <Text style={styles.profileTitle}>
              Nenhum paciente cadastrado.
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("CadastroPaciente")}
            >
              <Text style={styles.editButtonText}>Cadastrar paciente</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 🔄 Conteúdo principal */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            {/* 🗂️ Tarefas do Dia */}
            <View style={styles.section}>
              <View style={styles.header}>
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                  Tarefas de hoje
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Tarefas")}
                >
                  <Text style={[styles.link, { color: colors.primary }]}>
                    Ver todas
                  </Text>
                </TouchableOpacity>
              </View>

              {tarefas.length === 0 ? (
                <Text style={styles.emptyText}>Nenhuma tarefa para hoje.</Text>
              ) : (
                <FlatList
                  data={tarefas.slice(0, 3)}
                  keyExtractor={(item) =>
                    item.tarefa_id?.toString() || Math.random().toString()
                  }
                  renderItem={({ item }) => (
                    <View style={styles.card}>
                      <Text
                        style={[styles.cardTitle, { color: colors.primary }]}
                      >
                        {item.titulo}
                      </Text>
                      <Text style={[styles.cardText, { color: colors.text }]}>
                        {item.detalhes}
                      </Text>
                    </View>
                  )}
                />
              )}
            </View>

            {/* 💊 Medicamentos */}
            <View style={styles.section}>
              <View style={styles.header}>
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                  Medicamentos
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Medicamentos")}
                >
                  <Text style={[styles.link, { color: colors.primary }]}>
                    Ver todos
                  </Text>
                </TouchableOpacity>
              </View>

              {medicamentos.length === 0 ? (
                <Text style={styles.emptyText}>
                  Nenhum medicamento agendado.
                </Text>
              ) : (
                <FlatList
                  data={medicamentos.slice(0, 3)}
                  keyExtractor={(item) =>
                    item.medicamento_id?.toString() || Math.random().toString()
                  }
                  renderItem={({ item }) => (
                    <View style={styles.card}>
                      <Text
                        style={[styles.cardTitle, { color: colors.primary }]}
                      >
                        {item.nome}
                      </Text>
                      <Text style={[styles.cardText, { color: colors.text }]}>
                        {item.dosagem}
                      </Text>
                    </View>
                  )}
                />
              )}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
