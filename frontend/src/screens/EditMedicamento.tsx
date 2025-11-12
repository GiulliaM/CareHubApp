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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-root-toast";
import { useTheme } from "../context/ThemeContext";
import api from "../utils/apiClient";

export default function EditMedicamento({ route, navigation }: any) {
  const { colors } = useTheme();
  const { medicamento } = route.params;

  // 🧩 Normaliza horários (podem vir como string ou array)
  const initialHorarios = Array.isArray(medicamento.horarios)
    ? medicamento.horarios
    : typeof medicamento.horarios === "string" && medicamento.horarios.length
    ? medicamento.horarios.split(",").map((h: string) => h.trim())
    : [];

  const [nome, setNome] = useState(medicamento.nome);
  const [dosagem, setDosagem] = useState(medicamento.dosagem);
  const [horarios, setHorarios] = useState<string[]>(initialHorarios);
  const [novoHorario, setNovoHorario] = useState(new Date());
  const [showHoraPicker, setShowHoraPicker] = useState(false);
  const [inicio, setInicio] = useState(
    medicamento.inicio ? new Date(medicamento.inicio) : new Date()
  );
  const [duracaoDays, setDuracaoDays] = useState(
    medicamento.duracao_days?.toString() || ""
  );
  const [usoContinuo, setUsoContinuo] = useState(!!medicamento.uso_continuo);
  const [concluido, setConcluido] = useState(!!medicamento.concluido);
  const [showDate, setShowDate] = useState(false);
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

  const adicionarHorario = () => {
    const horaStr = novoHorario.toTimeString().slice(0, 5);
    if (!horarios.includes(horaStr)) {
      setHorarios([...horarios, horaStr].sort());
    }
  };

  const removerHorario = (h: string) => {
    setHorarios(horarios.filter((x) => x !== h));
  };

  // 💾 Atualizar medicamento
  const handleSalvar = async () => {
    if (!nome.trim()) {
      showToast("Informe o nome do medicamento!");
      return;
    }

    setSalvando(true);
    try {
      const changes: any = {
        nome,
        dosagem,
        horarios, // envia array direto (o backend já trata JSON)
        inicio: inicio.toISOString().split("T")[0],
        duracao_days: duracaoDays ? Number(duracaoDays) : null,
        uso_continuo: usoContinuo ? 1 : 0,
        concluido: concluido ? 1 : 0,
      };

      await api.patch(`/medicamentos/${medicamento.medicamento_id}`, changes);

      showToast("Medicamento atualizado com sucesso!", true);
      setTimeout(() => navigation.goBack(), 800);
    } catch (err) {
      console.error("Erro ao atualizar medicamento:", err);
      showToast("Erro ao atualizar medicamento. Verifique o servidor.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Editar Medicamento</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Dosagem"
          value={dosagem}
          onChangeText={setDosagem}
        />

        <TouchableOpacity style={styles.btnSelect} onPress={() => setShowHoraPicker(true)}>
          <Text style={styles.btnSelectText}>
            Adicionar horário:{" "}
            {novoHorario.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
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

        <TouchableOpacity style={styles.input} onPress={() => setShowDate(true)}>
          <Text>📅 Início: {inicio.toLocaleDateString("pt-BR")}</Text>
        </TouchableOpacity>

        {showDate && (
          <DateTimePicker
            value={inicio}
            mode="date"
            onChange={(e, date) => {
              setShowDate(false);
              if (date) setInicio(date);
            }}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Duração (dias)"
          keyboardType="numeric"
          value={duracaoDays}
          onChangeText={setDuracaoDays}
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Uso contínuo:</Text>
          <Switch value={usoContinuo} onValueChange={setUsoContinuo} />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Concluído:</Text>
          <Switch value={concluido} onValueChange={setConcluido} />
        </View>

        <TouchableOpacity
          disabled={salvando}
          style={[styles.button, { backgroundColor: salvando ? "#999" : colors.primary }]}
          onPress={handleSalvar}
        >
          {salvando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Salvar alterações</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
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
  horariosContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
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
    marginBottom: 12,
  },
  switchLabel: { fontWeight: "600", color: "#444" },
  button: { padding: 14, borderRadius: 10, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
