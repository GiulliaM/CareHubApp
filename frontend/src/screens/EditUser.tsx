import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/apiClient';

export default function EditUser({ route, navigation }: any) {
  const { user } = route.params || {};
  const { colors } = useTheme();
  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');

  async function handleSave() {
    if (!nome || !email) return Alert.alert('Erro', 'Preencha nome e e-mail.');
    try {
      await api.patch(`/usuarios/${user.usuario_id}`, { nome, email });
      Alert.alert('Sucesso', 'Dados atualizados.');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível atualizar o usuário.');
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Editar Usuário</Text>

        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome" />
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="E-mail" autoCapitalize="none" />

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
