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
      Alert.alert("Aviso", "Preencha nome, dosagem e pelo menos um horário!");
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

        {/* Nome */}
        <TextInput
          style={[styles.input, { backgroundColor: colors.card }]}
          placeholder="Nome do medicamento"
          placeholderTextColor="#666"
          value={nome}
          onChangeText={setNome}
        />

        {/* Dosagem */}
        <TextInput
          style={[styles.input, { backgroundColor: colors.card }]}
          placeholder="Dosagem (ex: 500mg)"
          placeholderTextColor="#666"
          value={dosagem}
          onChangeText={setDosagem}
        />

        {/* Adicionar horário */}
        <TouchableOpacity
          style={[styles.btnSelect, { backgroundColor: colors.card }]}
          onPress={() => setShowHoraPicker(true)}
        >
          <Ionicons name="time-outline" size={20} color={colors.text} />
          <Text style={[styles.btnSelectText, { color: colors.text }]}>
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

        {/* Lista de horários */}
        {horarios.length > 0 && (
          <View style={styles.horariosContainer}>
            {horarios.map((h, i) => (
              <TouchableOpacity key={i} onPress={() => removerHorario(h)}>
                <Text style={styles.horarioTag}>⏰ {h} ✖</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Data de início */}
        <TouchableOpacity
          style={[styles.btnSelect, { backgroundColor: colors.card }]}
          onPress={() => setShowInicioPicker(true)}
        >
          <Ionicons name="calendar-outline" size={20} color={colors.text} />
          <Text style={[styles.btnSelectText, { color: colors.text }]}>
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

        {/* Duração */}
        <TextInput
          style={[styles.input, { backgroundColor: colors.card }]}
          placeholder="Duração (em dias)"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={duracaoDays}
          onChangeText={setDuracaoDays}
        />

        {/* Uso contínuo */}
        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>Uso contínuo:</Text>
          <Switch value={usoContinuo} onValueChange={setUsoContinuo} />
        </View>

        {/* Botão salvar */}
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
            <Text style={styles.buttonText}>Salvar Medicamento</Text>
          )}
        </TouchableOpacity>

        {/* Botão cancelar */}
        <TouchableOpacity
          style={[styles.cancelButton, { backgroundColor: "#b0b0b0" }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* 🎨 ESTILOS */
const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  container: { padding: 16 },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 22,
  },

  input: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 14,
    fontSize: 16,
    elevation: 2,
  },

  btnSelect: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    elevation: 2,
  },

  btnSelectText: {
    fontSize: 16,
    fontWeight: "600",
  },

  horariosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },

  horarioTag: {
    backgroundColor: "#dbeafe",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 6,
    marginBottom: 6,
    fontWeight: "600",
    color: "#1e3a8a",
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },

  switchLabel: {
    fontSize: 16,
    fontWeight: "600",
  },

  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  cancelButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  cancelButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
