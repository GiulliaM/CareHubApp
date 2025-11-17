import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/apiClient";
import { useTheme } from "../context/ThemeContext";

export default function NovaTarefa({ navigation }: any) {
  const { colors } = useTheme();

  const [titulo, setTitulo] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const [data, setData] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [showDataPicker, setShowDataPicker] = useState(false);
  const [showHoraPicker, setShowHoraPicker] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // 🔵 Repetição
  const [diasRepeticao, setDiasRepeticao] = useState("");
  const [customDias, setCustomDias] = useState<string[]>([]);

  const diasSemana = [
    { label: "Dom", value: "dom" },
    { label: "Seg", value: "seg" },
    { label: "Ter", value: "ter" },
    { label: "Qua", value: "qua" },
    { label: "Qui", value: "qui" },
    { label: "Sex", value: "sex" },
    { label: "Sáb", value: "sab" },
  ];

  const toggleCustomDia = (dia: string) => {
    if (customDias.includes(dia)) {
      setCustomDias(customDias.filter((d) => d !== dia));
    } else {
      setCustomDias([...customDias, dia]);
    }
  };

  const handleSalvar = async () => {
    if (!titulo.trim()) {
      Alert.alert("Atenção", "Dê um título para a tarefa.");
      return;
    }

    let repeticaoFinal = diasRepeticao;

    if (diasRepeticao === "custom") {
      repeticaoFinal = customDias.join(",");
    }

    setSalvando(true);

    try {
      const rawPaciente = await AsyncStorage.getItem("paciente");
      const paciente = rawPaciente ? JSON.parse(rawPaciente) : null;

      if (!paciente?.paciente_id) {
        Alert.alert("Erro", "Nenhum paciente vinculado encontrado.");
        return;
      }

      await api.post("/tarefas", {
        titulo,
        detalhes,
        data: data.toISOString().split("T")[0],
        hora: hora.toTimeString().substring(0, 5),
        dias_repeticao: repeticaoFinal,
        concluida: 0,
        paciente_id: paciente.paciente_id,
      });

      Alert.alert("Sucesso", "Tarefa cadastrada com sucesso!");
      navigation.navigate("Tabs", { screen: "Tarefas" });
    } catch (err) {
      console.error("Erro ao salvar tarefa:", err);
      Alert.alert("Erro", "Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Nova Tarefa</Text>

        {/* Título */}
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={[styles.input]}
          placeholder="Ex: Trocar curativo"
          value={titulo}
          onChangeText={setTitulo}
        />

        {/* Detalhes */}
        <Text style={styles.label}>Detalhes</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Detalhes da tarefa..."
          value={detalhes}
          multiline
          onChangeText={setDetalhes}
        />

        {/* Data */}
        <TouchableOpacity style={styles.selectButton} onPress={() => setShowDataPicker(true)}>
          <Text style={styles.selectButtonText}>Data: {data.toLocaleDateString("pt-BR")}</Text>
        </TouchableOpacity>

        {showDataPicker && (
          <DateTimePicker
            value={data}
            mode="date"
            onChange={(e, dateSel) => {
              setShowDataPicker(false);
              if (dateSel) setData(dateSel);
            }}
          />
        )}

        {/* Hora */}
        <TouchableOpacity style={styles.selectButton} onPress={() => setShowHoraPicker(true)}>
          <Text style={styles.selectButtonText}>
            Hora: {hora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </TouchableOpacity>

        {showHoraPicker && (
          <DateTimePicker
            value={hora}
            mode="time"
            is24Hour={true}
            onChange={(e, dateSel) => {
              setShowHoraPicker(false);
              if (dateSel) setHora(dateSel);
            }}
          />
        )}

        {/* Repetição */}
        <Text style={styles.label}>Repetição</Text>

        <View style={styles.repeticaoContainer}>
          {[
            { label: "Nenhuma", value: "" },
            { label: "Todos os dias", value: "todos" },
            { label: "Seg / Qua / Sex", value: "seg,qua,sex" },
            { label: "Ter / Qui", value: "ter,qui" },
            { label: "Personalizar", value: "custom" },
          ].map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.repeticaoBtn,
                diasRepeticao === item.value && { backgroundColor: colors.primary },
              ]}
              onPress={() => setDiasRepeticao(item.value)}
            >
              <Text
                style={[
                  styles.repeticaoBtnText,
                  diasRepeticao === item.value && { color: "#fff" },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Personalizar dias */}
        {diasRepeticao === "custom" && (
          <View style={styles.customContainer}>
            <Text style={styles.label}>Escolha os dias:</Text>
            <View style={styles.customDiasRow}>
              {diasSemana.map((d) => (
                <TouchableOpacity
                  key={d.value}
                  style={[
                    styles.customDia,
                    customDias.includes(d.value) && {
                      backgroundColor: colors.primary,
                    },
                  ]}
                  onPress={() => toggleCustomDia(d.value)}
                >
                  <Text
                    style={[
                      styles.customDiaText,
                      customDias.includes(d.value) && { color: "#fff" },
                    ]}
                  >
                    {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Botões */}
        <TouchableOpacity
          style={[styles.btnSalvar, { backgroundColor: colors.primary }]}
          disabled={salvando}
          onPress={handleSalvar}
        >
          {salvando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Salvar Tarefa</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnCancelar, { borderColor: colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.btnCancelarText, { color: colors.primary }]}>Cancelar</Text>
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
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 10,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
  },
  selectButton: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  selectButtonText: {
    fontWeight: "600",
    color: "#333",
  },

  // Repetição
  repeticaoContainer: {
    flexDirection: "column",
    gap: 8,
    marginBottom: 12,
  },
  repeticaoBtn: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  repeticaoBtnText: {
    fontWeight: "600",
    textAlign: "center",
  },

  // Custom
  customContainer: { marginTop: 10, marginBottom: 12 },
  customDiasRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  customDia: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
    minWidth: 50,
    alignItems: "center",
  },
  customDiaText: {
    fontWeight: "600",
  },

  btnSalvar: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  btnCancelar: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 2,
  },
  btnCancelarText: {
    fontWeight: "700",
    fontSize: 16,
  },
});
