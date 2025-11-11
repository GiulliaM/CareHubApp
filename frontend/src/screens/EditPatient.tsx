import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/apiClient';

export default function EditPatient({ route, navigation }: any) {
  const { paciente } = route.params || {};
  const { colors } = useTheme();
  const [nome, setNome] = useState(paciente?.nome || '');
  const [idade, setIdade] = useState(paciente?.idade || '');

  async function handleSave() {
    if (!nome) return Alert.alert('Erro', 'Preencha o nome do paciente.');
    try {
      await api.patch(`/pacientes/${paciente.paciente_id}`, { nome, idade: idade || null });
      Alert.alert('Sucesso', 'Paciente atualizado.');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível atualizar o paciente.');
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Editar Paciente</Text>

        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome do paciente" />
        <TextInput style={styles.input} value={idade} onChangeText={setIdade} placeholder="Idade" keyboardType="numeric" />

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#ddd' },
  button: { padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
