import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/apiClient";
import { Ionicons } from "@expo/vector-icons";

export default function NovaMedicamento({ navigation }: any) {
  const { colors } = useTheme();

  const [nome, setNome] = useState("");
  const [dosagem, setDosagem] = useState("");
  const [horarios, setHorarios] = useState<string[]>([]);
  const [novoHorario, setNovoHorario] = useState(new Date());
  const [showHoraPicker, setShowHoraPicker] = useState(false);
  const [inicio, setInicio] = useState(new Date());
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [duracaoDays, setDuracaoDays] = useState("");
  const [usoContinuo, setUsoContinuo] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const adicionarHorario = () => {
    const horaStr = novoHorario.toTimeString().slice(0, 5);
    if (!horarios.includes(horaStr)) setHorarios([...horarios, horaStr].sort());
  };

  const removerHorario = (hora: string) => {
    setHorarios(horarios.filter((h) => h !== hora));
  };

  const handleSalvar = async () => {
    if (!nome.trim() || !dosagem.trim() || horarios.length === 0) {
      Alert.alert("Aviso", "Preencha todos os campos obrigatórios.");
      return;
    }

    setSalvando(true);
    try {
      const rawPaciente = await AsyncStorage.getItem("paciente");
      const paciente = rawPaciente ? JSON.parse(rawPaciente) : null;

      if (!paciente?.paciente_id) {
        Alert.alert("Erro", "Nenhum paciente vinculado encontrado.");
        return;
      }

      await api.post("/medicamentos", {
        nome,
        dosagem,
        horarios,
        concluido: 0,
        inicio: inicio.toISOString().split("T")[0],
        duracao_days: duracaoDays ? Number(duracaoDays) : null,
        uso_continuo: usoContinuo ? 1 : 0,
        paciente_id: paciente.paciente_id,
      });

      Alert.alert("Sucesso", "Medicamento cadastrado com sucesso!");
      navigation.navigate("Tabs", { screen: "Medicamentos" });
    } catch (err) {
      console.error("Erro ao salvar medicamento:", err);
      Alert.alert("Erro", "Não foi possível salvar o medicamento.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Novo Medicamento</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome do medicamento"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="Dosagem (ex: 500mg)"
          value={dosagem}
          onChangeText={setDosagem}
        />

        <TouchableOpacity
          style={styles.btnSelect}
          onPress={() => setShowHoraPicker(true)}
        >
          <Text style={styles.btnSelectText}>
            Adicionar horário:{" "}
            {novoHorario.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>

        {showHoraPicker && (
          <DateTimePicker
            value={novoHorario}
            mode="time"
            is24Hour={true}
            onChange={(e, date) => {
              setShowHoraPicker(false);
              if (date) {
                setNovoHorario(date);
                adicionarHorario();
              }
            }}
          />
        )}

        {horarios.length > 0 && (
          <View style={styles.horariosContainer}>
            {horarios.map((h, i) => (
              <TouchableOpacity key={i} onPress={() => removerHorario(h)}>
                <Text style={styles.horarioTag}>🕒 {h} ✖</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.btnSelect}
          onPress={() => setShowInicioPicker(true)}
        >
          <Text style={styles.btnSelectText}>
            Início: {inicio.toLocaleDateString("pt-BR")}
          </Text>
        </TouchableOpacity>

        {showInicioPicker && (
          <DateTimePicker
            value={inicio}
            mode="date"
            onChange={(e, date) => {
              setShowInicioPicker(false);
              if (date) setInicio(date);
            }}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Duração (em dias)"
          keyboardType="numeric"
          value={duracaoDays}
          onChangeText={setDuracaoDays}
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Uso contínuo:</Text>
          <Switch value={usoContinuo} onValueChange={setUsoContinuo} />
        </View>

        <TouchableOpacity
          disabled={salvando}
          style={[styles.button, { backgroundColor: salvando ? "#999" : colors.primary }]}
          onPress={handleSalvar}
        >
          {salvando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Salvar Medicamento</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
  },
  btnSelect: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  btnSelectText: { color: "#333", fontWeight: "600" },
  horariosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  horarioTag: {
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 6,
    fontWeight: "600",
    color: "#333",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  switchLabel: { fontWeight: "600", color: "#444" },
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 14,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
