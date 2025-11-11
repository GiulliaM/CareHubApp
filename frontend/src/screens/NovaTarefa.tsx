import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import cores from "../config/cores";
import { useTheme } from '../context/ThemeContext';
import api from "../utils/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NovaTarefa({ navigation }: any) {
  const { colors } = useTheme();
  const [titulo, setTitulo] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const [hora, setHora] = useState(new Date());
  const [mostraHora, setMostraHora] = useState(false);
  const [data, setData] = useState(new Date());
  const [mostraData, setMostraData] = useState(false);
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);

  const diasSemana = ["D", "S", "T", "Q", "Q", "S", "S"];

  function toggleDia(index: number) {
    const existe = diasSelecionados.includes(index.toString());
    if (existe) {
      setDiasSelecionados(diasSelecionados.filter((d) => d !== index.toString()));
    } else {
      setDiasSelecionados([...diasSelecionados, index.toString()]);
    }
  }

  const onHoraChange = (e: DateTimePickerEvent, date?: Date) => {
    setMostraHora(false);
    if (date) setHora(date);
  };

  async function handleSalvar() {
    if (!titulo) {
      Alert.alert("Erro", "Preencha o título da tarefa.");
      return;
    }
    try {
      const rawPaciente = await AsyncStorage.getItem("paciente");
      const paciente = rawPaciente ? JSON.parse(rawPaciente) : null;
      if (!paciente?.paciente_id) {
        Alert.alert("Erro", "Paciente não encontrado. Cadastre um paciente primeiro.");
        return;
      }
      await api.post("/tarefas", {
        titulo,
        detalhes,
        data: data.toISOString().split("T")[0],
        hora: hora.toISOString().split("T")[1].substring(0, 5),
        dias_repeticao: diasSelecionados.join(","),
        paciente_id: paciente.paciente_id,
      });
      Alert.alert("Sucesso", "Tarefa cadastrada com sucesso!");
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível cadastrar a tarefa.");
    }
  }

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
          style={[styles.input, { height: 80 }]}
          placeholder="Detalhes (opcional)"
          value={detalhes}
          onChangeText={setDetalhes}
          multiline
        />

        <TouchableOpacity style={styles.input} onPress={() => setMostraData(true)}>
          <Text>Data: {data.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {mostraData && (
          <DateTimePicker
            value={data}
            mode="date"
            display="default"
            onChange={(e, d) => {
              setMostraData(false);
              if (d) setData(d);
            }}
          />
        )}

        <TouchableOpacity style={styles.input} onPress={() => setMostraHora(true)}>
          <Text>Hora: {hora.toLocaleTimeString().slice(0, 5)}</Text>
        </TouchableOpacity>
        {mostraHora && (
          <DateTimePicker
            value={hora}
            mode="time"
            is24Hour={true}
            onChange={onHoraChange}
          />
        )}

        <Text style={styles.label}>Repetir tarefa:</Text>
        <View style={styles.diasContainer}>
          {diasSemana.map((dia, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.dia,
                diasSelecionados.includes(i.toString()) && styles.diaSelecionado,
              ]}
              onPress={() => toggleDia(i)}
            >
              <Text
                style={[
                  styles.diaTexto,
                  diasSelecionados.includes(i.toString()) &&
                    styles.diaTextoSelecionado,
                ]}
              >
                {dia}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSalvar}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.background },
  container: { padding: 16 },
  title: {
    fontSize: 24,
    color: cores.primary,
    fontWeight: "700",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 14,
  },
  label: { color: "#333", fontWeight: "600", marginBottom: 6 },
  diasContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dia: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: cores.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  diaSelecionado: { backgroundColor: cores.primary },
  diaTexto: { color: cores.primary, fontWeight: "600" },
  diaTextoSelecionado: { color: "#fff" },
  button: {
    backgroundColor: cores.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
