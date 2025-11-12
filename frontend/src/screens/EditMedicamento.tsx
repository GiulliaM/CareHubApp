import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
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

  const [nome, setNome] = useState(medicamento.nome);
  const [dosagem, setDosagem] = useState(medicamento.dosagem);
  const [horarios, setHorarios] = useState(medicamento.horarios || "");
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
        horarios,
        inicio: inicio.toISOString().split("T")[0],
        duracao_days: duracaoDays ? Number(duracaoDays) : null,
        uso_continuo: usoContinuo ? 1 : 0,
        concluido: concluido ? 1 : 0,
      };

      Object.keys(changes).forEach(
        (k) => changes[k] === undefined && delete changes[k]
      );

      await api.patch(`/medicamentos/${medicamento.medicamento_id}`, changes);

      showToast("Medicamento atualizado com sucesso!", true);
      setTimeout(() => navigation.goBack(), 1000);
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
        <TextInput
          style={styles.input}
          placeholder="Horários (ex: 08:00, 14:00)"
          value={horarios}
          onChangeText={setHorarios}
        />
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDate(true)}
        >
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
          style={[
            styles.button,
            { backgroundColor: salvando ? "#999" : colors.primary },
          ]}
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
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  switchLabel: { fontWeight: "600", color: "#444" },
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
