import React, { useState, useEffect } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../utils/apiClient";
import { useTheme } from "../context/ThemeContext";

export default function EditTarefa({ route, navigation }: any) {
  const { tarefa } = route.params;
  const { colors } = useTheme();

  const [titulo, setTitulo] = useState(tarefa.titulo);
  const [detalhes, setDetalhes] = useState(tarefa.detalhes);
  const [data, setData] = useState(new Date(tarefa.data));
  const [hora, setHora] = useState(
    new Date(`2024-01-01T${tarefa.hora || "00:00"}`)
  );
  const [showDataPicker, setShowDataPicker] = useState(false);
  const [showHoraPicker, setShowHoraPicker] = useState(false);
  const [diasRepeticao, setDiasRepeticao] = useState<string>(
    tarefa.dias_repeticao || ""
  );
  const [concluida, setConcluida] = useState<boolean>(
    tarefa.concluida === 1
  );
  const [salvando, setSalvando] = useState(false);

  const opcoesRepeticao = [
    { label: "Nenhuma", value: "" },
    { label: "Todos os dias", value: "todos" },
    { label: "Seg / Qua / Sex", value: "seg,qua,sex" },
    { label: "Ter / Qui", value: "ter,qui" },
  ];

  const handleSalvar = async () => {
    if (!titulo.trim()) {
      Alert.alert("Atenção", "O título não pode ficar vazio.");
      return;
    }

    setSalvando(true);

    try {
      await api.patch(`/tarefas/${tarefa.tarefa_id}`, {
        titulo,
        detalhes,
        data: data.toISOString().split("T")[0],
        hora: hora.toTimeString().substring(0, 5),
        dias_repeticao: diasRepeticao,
        concluida: concluida ? 1 : 0,
      });

      Alert.alert("Sucesso", "Tarefa atualizada com sucesso!");
      navigation.goBack();
    } catch (err) {
      console.error("Erro ao editar tarefa:", err);
      Alert.alert("Erro", "Não foi possível atualizar a tarefa.");
    } finally {
      setSalvando(false);
    }
  };

  const toggleDiaCustom = (dia: string) => {
    const lista = diasRepeticao ? diasRepeticao.split(",") : [];

    const novaLista = lista.includes(dia)
      ? lista.filter((d: string) => d !== dia)
      : [...lista, dia];

    setDiasRepeticao(novaLista.join(","));
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Editar Tarefa</Text>

        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={styles.label}>Detalhes</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={detalhes}
          onChangeText={setDetalhes}
          multiline
        />

        <Text style={styles.label}>Data</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowDataPicker(true)}
        >
          <Text style={styles.selectButtonText}>
            {data.toLocaleDateString("pt-BR")}
          </Text>
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

        <Text style={styles.label}>Hora</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowHoraPicker(true)}
        >
          <Text style={styles.selectButtonText}>
            {hora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </TouchableOpacity>

        {showHoraPicker && (
          <DateTimePicker
            value={hora}
            mode="time"
            is24Hour
            onChange={(e, dateSel) => {
              setShowHoraPicker(false);
              if (dateSel) setHora(dateSel);
            }}
          />
        )}

        <Text style={styles.label}>Repetição</Text>

        <View style={styles.repeticaoContainer}>
          {opcoesRepeticao.map((item) => (
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

        <Text style={styles.label}>Concluída</Text>
        <TouchableOpacity
          style={[
            styles.statusBtn,
            { borderColor: colors.primary },
            concluida && { backgroundColor: colors.primary },
          ]}
          onPress={() => setConcluida(!concluida)}
        >
          <Ionicons
            name={concluida ? "checkbox" : "square-outline"}
            size={22}
            color={concluida ? "#fff" : colors.primary}
          />
          <Text
            style={[
              styles.statusBtnText,
              { color: concluida ? "#fff" : colors.primary },
            ]}
          >
            {concluida ? "Marcada como concluída" : "Marcar como concluída"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnSalvar, { backgroundColor: colors.primary }]}
          onPress={handleSalvar}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnCancelar, { borderColor: colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.btnCancelarText, { color: colors.primary }]}>
            Cancelar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// estilos mantidos

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
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectButton: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#eee",
    marginBottom: 12,
  },
  selectButtonText: {
    fontWeight: "600",
  },
  repeticaoContainer: {
    flexDirection: "column",
    gap: 8,
  },
  repeticaoBtn: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
  },
  repeticaoBtnText: {
    textAlign: "center",
    fontWeight: "700",
  },
  statusBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 12,
    gap: 10,
  },
  statusBtnText: {
    fontWeight: "700",
    fontSize: 16,
  },
  btnSalvar: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
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
