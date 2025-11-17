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
import api from "../utils/apiClient";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";

export default function EditTarefa({ route, navigation }: any) {
  const { colors } = useTheme();
  const { tarefa } = route.params;

  const [titulo, setTitulo] = useState(tarefa.titulo);
  const [detalhes, setDetalhes] = useState(tarefa.detalhes || "");
  const [data, setData] = useState(new Date(tarefa.data));
  const [hora, setHora] = useState(
    tarefa.hora
      ? dayjs(tarefa.hora, "HH:mm").toDate()
      : new Date()
  );

  const [diasRepeticao, setDiasRepeticao] = useState(tarefa.dias_repeticao || "");
  const [concluida, setConcluida] = useState(tarefa.concluida === 1);
  const [loading, setLoading] = useState(false);

  const [showDataPicker, setShowDataPicker] = useState(false);
  const [showHoraPicker, setShowHoraPicker] = useState(false);

  // 💾 Salvar alterações
  const handleSalvar = () => {
    Alert.alert(
      "Salvar alterações",
      "Deseja realmente atualizar esta tarefa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salvar",
          style: "destructive",
          onPress: salvarTarefa,
        },
      ]
    );
  };

  const salvarTarefa = async () => {
    setLoading(true);
    try {
      await api.patch(`/tarefas/${tarefa.tarefa_id}`, {
        titulo,
        detalhes,
        data: dayjs(data).format("YYYY-MM-DD"),
        hora: dayjs(hora).format("HH:mm"),
        dias_repeticao: diasRepeticao,
        concluida: concluida ? 1 : 0,
      });

      Alert.alert("Sucesso", "Tarefa atualizada!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar a tarefa.");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Excluir tarefa
  const handleExcluir = () => {
    Alert.alert(
      "Excluir tarefa",
      "Deseja realmente excluir esta tarefa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: excluirTarefa,
        },
      ]
    );
  };

  const excluirTarefa = async () => {
    setLoading(true);
    try {
      await api.delete(`/tarefas/${tarefa.tarefa_id}`);
      Alert.alert("Sucesso", "Tarefa excluída!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível excluir.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Editar Tarefa</Text>

        {/* Título */}
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
        />

        {/* Detalhes */}
        <Text style={styles.label}>Detalhes</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={detalhes}
          multiline
          onChangeText={setDetalhes}
        />

        {/* Data */}
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowDataPicker(true)}
        >
          <Text style={styles.selectButtonText}>
            Data: {dayjs(data).format("DD/MM/YYYY")}
          </Text>
        </TouchableOpacity>

        {showDataPicker && (
          <DateTimePicker
            value={data}
            mode="date"
            onChange={(e, d) => {
              setShowDataPicker(false);
              if (d) setData(d);
            }}
          />
        )}

        {/* Hora */}
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowHoraPicker(true)}
        >
          <Text style={styles.selectButtonText}>
            Hora: {dayjs(hora).format("HH:mm")}
          </Text>
        </TouchableOpacity>

        {showHoraPicker && (
          <DateTimePicker
            value={hora}
            mode="time"
            is24Hour
            onChange={(e, h) => {
              setShowHoraPicker(false);
              if (h) setHora(h);
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

        {/* Concluída */}
        <TouchableOpacity
          style={[
            styles.checkbox,
            concluida && { backgroundColor: colors.primary },
          ]}
          onPress={() => setConcluida(!concluida)}
        >
          <Ionicons
            name={concluida ? "checkmark-circle" : "ellipse-outline"}
            size={22}
            color={concluida ? "#fff" : colors.text}
          />
          <Text
            style={[
              styles.checkboxText,
              { color: concluida ? "#fff" : colors.text },
            ]}
          >
            Marcar como concluída
          </Text>
        </TouchableOpacity>

        {/* Botões */}
        <TouchableOpacity
          style={[styles.btnSalvar, { backgroundColor: colors.primary }]}
          onPress={handleSalvar}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Salvar alterações</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnExcluir]}
          onPress={handleExcluir}
        >
          <Text style={styles.btnExcluirText}>Excluir Tarefa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnCancelar]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.btnCancelarText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16, textAlign: "center" },

  label: { fontSize: 15, fontWeight: "600", marginBottom: 6, marginTop: 10, color: "#333" },
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
  selectButtonText: { fontWeight: "600", color: "#333" },

  repeticaoContainer: { flexDirection: "column", gap: 10 },
  repeticaoBtn: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  repeticaoBtnText: { fontWeight: "600" },

  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 10,
    gap: 10,
  },
  checkboxText: { fontSize: 16, fontWeight: "600" },

  btnSalvar: { padding: 16, borderRadius: 12, marginTop: 12, alignItems: "center" },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  btnExcluir: {
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
    backgroundColor: "#E53935",
  },
  btnExcluirText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  btnCancelar: { padding: 14, borderRadius: 12, alignItems: "center", marginTop: 12, borderWidth: 2 },
  btnCancelarText: { fontWeight: "700", fontSize: 16 },
});
