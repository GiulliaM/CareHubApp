import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-root-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/apiClient";
import { useTheme } from "../context/ThemeContext";

export default function NovaTarefa({ navigation }: any) {
  const { colors } = useTheme();

  const [titulo, setTitulo] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const [data, setData] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [showData, setShowData] = useState(false);
  const [showHora, setShowHora] = useState(false);
  const [diasRepeticao, setDiasRepeticao] = useState<string[]>([]);
  const [novoDia, setNovoDia] = useState("Segunda");
  const [salvando, setSalvando] = useState(false);

  const showToast = (msg: string, success = false) => {
    Toast.show(msg, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      backgroundColor: success ? "#1a73e8" : "#c62828",
      textColor: "#fff",
      shadow: true,
      animation: true,
      hideOnPress: true,
    });
  };

  const diasSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  const toggleDia = (dia: string) => {
    setDiasRepeticao((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  const handleSalvar = async () => {
    if (!titulo.trim()) {
      showToast("Informe o título da tarefa!");
      return;
    }

    setSalvando(true);
    try {
      const rawPaciente = await AsyncStorage.getItem("paciente");
      const paciente = rawPaciente ? JSON.parse(rawPaciente) : null;

      if (!paciente?.paciente_id) {
        showToast("Nenhum paciente encontrado!");
        setSalvando(false);
        return;
      }

      await api.post("/tarefas", {
        titulo,
        detalhes,
        data: data.toISOString().split("T")[0],
        hora: hora.toTimeString().slice(0, 5),
        dias_repeticao: diasRepeticao.join(", "),
        paciente_id: paciente.paciente_id,
      });

      showToast("Tarefa cadastrada com sucesso!", true);
      setTimeout(() => navigation.navigate("Tabs", { screen: "Tarefas" }), 1000);
    } catch (err) {
      console.error("Erro ao cadastrar tarefa:", err);
      showToast("Não foi possível cadastrar a tarefa.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Nova Tarefa</Text>

        <TextInput
          style={styles.input}
          placeholder="Título da tarefa"
          value={titulo}
          onChangeText={setTitulo}
        />
        <TextInput
          style={[styles.input, { height: 90 }]}
          placeholder="Detalhes"
          value={detalhes}
          multiline
          onChangeText={setDetalhes}
        />

        <TouchableOpacity style={styles.input} onPress={() => setShowData(true)}>
          <Text>📅 {data.toLocaleDateString("pt-BR")}</Text>
        </TouchableOpacity>
        {showData && (
          <DateTimePicker
            value={data}
            mode="date"
            onChange={(e, date) => {
              setShowData(false);
              if (date) setData(date);
            }}
          />
        )}

        <TouchableOpacity style={styles.input} onPress={() => setShowHora(true)}>
          <Text>🕒 {hora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</Text>
        </TouchableOpacity>
        {showHora && (
          <DateTimePicker
            value={hora}
            mode="time"
            is24Hour={true}
            onChange={(e, time) => {
              setShowHora(false);
              if (time) setHora(time);
            }}
          />
        )}

        <Text style={styles.subtitle}>Dias de repetição:</Text>
        <View style={styles.daysContainer}>
          {diasSemana.map((dia) => (
            <TouchableOpacity
              key={dia}
              style={[
                styles.dayButton,
                diasRepeticao.includes(dia) && { backgroundColor: colors.primary },
              ]}
              onPress={() => toggleDia(dia)}
            >
              <Text
                style={{
                  color: diasRepeticao.includes(dia) ? "#fff" : "#333",
                  fontWeight: "600",
                }}
              >
                {dia.slice(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          disabled={salvando}
          style={[
            styles.button,
            { backgroundColor: salvando ? "#999" : colors.primary },
          ]}
          onPress={handleSalvar}
        >
          {salvando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Salvar Tarefa</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  subtitle: { fontWeight: "700", marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dayButton: {
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 8,
    margin: 4,
    minWidth: 45,
    alignItems: "center",
  },
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
