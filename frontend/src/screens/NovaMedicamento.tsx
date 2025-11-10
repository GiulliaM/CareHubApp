import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import cores from "../config/cores";
import { API_URL } from "../config/api";
import { getToken } from "../utils/auth";

export default function NovaMedicamento({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [dosagem, setDosagem] = useState("");
  const [horario, setHorario] = useState(new Date());
  const [mostraHora, setMostraHora] = useState(false);
  const [intervalo, setIntervalo] = useState("");
  const [usoContinuo, setUsoContinuo] = useState(false);

  async function handleSalvar() {
    if (!nome || !dosagem) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos necessários.");
      return;
    }

    try {
      const token = await getToken();
      await fetch(`${API_URL}/medicamentos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          dosagem,
          horario: horario.toISOString().split("T")[1].substring(0, 5),
          intervalo,
          usoContinuo,
        }),
      });
      Alert.alert("Sucesso", "Medicamento cadastrado com sucesso!");
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível cadastrar o medicamento.");
    }
  }

  const onHoraChange = (e: DateTimePickerEvent, date?: Date) => {
    setMostraHora(false);
    if (date) setHorario(date);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Novo Medicamento</Text>

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

        <TouchableOpacity style={styles.input} onPress={() => setMostraHora(true)}>
          <Text>Horário: {horario.toLocaleTimeString().slice(0, 5)}</Text>
        </TouchableOpacity>

        {mostraHora && (
          <DateTimePicker
            value={horario}
            mode="time"
            is24Hour={true}
            onChange={onHoraChange}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Intervalo (ex: a cada 8h)"
          value={intervalo}
          onChangeText={setIntervalo}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: cores.primary }]}
          onPress={handleSalvar}
        >
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
    fontWeight: "700",
    color: cores.primary,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
