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
import { Ionicons } from "@expo/vector-icons";
import api from "../utils/apiClient";
import { useTheme } from "../context/ThemeContext";

export default function EditMedicamento({ route, navigation }: any) {
  const { medicamento } = route.params;
  const { colors } = useTheme();

  const [nome, setNome] = useState(medicamento?.nome || "");
  const [dosagem, setDosagem] = useState(medicamento?.dosagem || "");
  const [horarios, setHorarios] = useState<string[]>(medicamento?.horarios || []);
  const [novoHorario, setNovoHorario] = useState(new Date());
  const [showHoraPicker, setShowHoraPicker] = useState(false);

  const [inicio, setInicio] = useState(
    medicamento?.inicio ? new Date(medicamento.inicio) : new Date()
  );
  const [showInicioPicker, setShowInicioPicker] = useState(false);

  const [duracaoDays, setDuracaoDays] = useState(
    medicamento?.duracao_days ? String(medicamento.duracao_days) : ""
  );

  const [usoContinuo, setUsoContinuo] = useState(!!medicamento?.uso_continuo);
  const [concluido, setConcluido] = useState(!!medicamento?.concluido);
  const [salvando, setSalvando] = useState(false);

  const adicionarHorario = () => {
    const horaStr = novoHorario.toTimeString().slice(0, 5);
    if (!horarios.includes(horaStr))
      setHorarios([...horarios, horaStr].sort());
  };

  const removerHorario = (hora: string) => {
    setHorarios(horarios.filter((h) => h !== hora));
  };

  const handleSalvar = async () => {
    if (!nome.trim() || !dosagem.trim() || horarios.length === 0) {
      Alert.alert("Atenção", "Preencha nome, dosagem e pelo menos um horário!");
      return;
    }

    setSalvando(true);
    try {
      await api.patch(`/medicamentos/${medicamento.medicamento_id}`, {
        nome,
        dosagem,
        horarios,
        concluido: concluido ? 1 : 0,
        inicio: inicio.toISOString().split("T")[0],
        duracao_days: duracaoDays !== "" ? Number(duracaoDays) : null,
        uso_continuo: usoContinuo ? 1 : 0,
      });

      Alert.alert("Sucesso", "Medicamento atualizado com sucesso!");

      navigation.navigate("Tabs", { screen: "Medicamentos" });
    } catch (err) {
      console.error("Erro ao salvar medicamento:", err);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>
          Editar Medicamento
        </Text>

        {/* Nome */}
        <TextInput
          style={[styles.input, { backgroundColor: colors.card }]}
          placeholder="Nome do medicamento"
          value={nome}
          onChangeText={setNome}
          placeholderTextColor="#666"
        />

        {/* Dosagem */}
        <TextInput
          style={[styles.input, { backgroundColor: colors.card }]}
          placeholder="Dosagem (ex: 500mg)"
          value={dosagem}
          onChangeText={setDosagem}
          placeholderTextColor="#666"
        />

        {/* Horário */}
        <TouchableOpacity
          style={[styles.btnSelect, { backgroundColor: colors.card }]}
          onPress={() => setShowHoraPicker(true)}
        >
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

        {horarios.length > 0 && (
          <View style={styles.horariosContainer}>
            {horarios.map((h, i) => (
              <TouchableOpacity key={i} onPress={() => removerHorario(h)}>
                <Text style={styles.horarioTag}>🕒 {h} ✖</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Data início */}
        <TouchableOpacity
          style={[styles.btnSelect, { backgroundColor: colors.card }]}
          onPress={() => setShowInicioPicker(true)}
        >
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
          keyboardType="numeric"
          value={duracaoDays}
          onChangeText={setDuracaoDays}
          placeholderTextColor="#666"
        />

        {/* Switches */}
        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>
            Uso contínuo:
          </Text>
          <Switch value={usoContinuo} onValueChange={setUsoContinuo} />
        </View>

        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>
            Concluído:
          </Text>
          <Switch value={concluido} onValueChange={setConcluido} />
        </View>

        {/* Botão Salvar */}
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
            <Text style={styles.buttonText}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>

        {/* Botão Cancelar */}
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
  },

  btnSelect: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 14,
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
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 6,
    marginBottom: 6,
    fontWeight: "600",
    color: "#333",
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
