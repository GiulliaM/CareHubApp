import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
// <<< MUDANÇA: useFocusEffect e useNavigation importados
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../style/homeStyle'; // Nossos estilos globais
import { cores } from '../constantes/cores';
import { LogIn } from 'lucide-react-native';

const API_URL = 'http://54.39.173.152:3000'; // (Sua API)

type MeuPerfilProps = {
  isGuest: boolean; // Recebe a prop do AppNavigator
  onLogout: () => void; // A função de logout do App.tsx
};

const MeuPerfilTela: React.FC<MeuPerfilProps> = ({ isGuest, onLogout }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Estados para os dados do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  
  // <<< MUDANÇA: A função async agora está "embrulhada" por useCallback
  const fetchMeuPerfil = useCallback(async () => {
    if (isGuest) {
      setIsLoading(false); // Visitante não carrega nada
      return;
    }
    
    setIsLoading(true);
    const token = await AsyncStorage.getItem('@carehub_token');
    if (!token) {
      Alert.alert("Erro", "Token não encontrado. Faça login.");
      setIsLoading(false);
      onLogout(); // Força o logout se o token sumir
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/meu-perfil`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        setNome(data.nome);
        setEmail(data.email);
        setTelefone(data.telefone || '');
      } else {
        Alert.alert("Erro", data.message);
      }
    } catch (error: any) {
      Alert.alert("Erro de conexão", error.message);
    } finally {
      setIsLoading(false);
    }
  }, [isGuest, onLogout]); // 'isGuest' e 'onLogout' são dependências

  // <<< MUDANÇA: useFocusEffect agora chama a função dentro de um callback
  useFocusEffect(
    React.useCallback(() => {
      fetchMeuPerfil();
    }, [fetchMeuPerfil]) // A dependência é a própria função
  );
  
  // Função para salvar as alterações
  const handleSalvar = async () => {
    if (!nome) {
      Alert.alert("Erro", "O nome é obrigatório.");
      return;
    }
    setIsSaving(true);
    const token = await AsyncStorage.getItem('@carehub_token');
    
    try {
      const response = await fetch(`${API_URL}/api/meu-perfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nome, telefone })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        Alert.alert("Sucesso!", "Perfil atualizado.");
      } else {
        Alert.alert("Erro ao salvar", data.message);
      }
    } catch (error: any) {
      Alert.alert("Erro de conexão", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // --- RENDERIZAÇÃO ---
  
  // 1. Se for Visitante, mostre o botão de Login
  if (isGuest) {
    return (
      <View style={[styles.screenContainer, { padding: 20, alignItems: 'center', justifyContent: 'center' }]}>
        <LogIn size={48} color={cores.primaria} />
        <Text style={[styles.formTitle, { marginTop: 20 }]}>Modo Visitante</Text>
        <Text style={[styles.formSubtitle, { textAlign: 'center', marginBottom: 30 }]}>
          Para ver ou editar seu perfil, você precisa estar logado.
        </Text>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={onLogout} // Chama a função de logout para ir ao login
        >
          <Text style={styles.buttonText}>Ir para o Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // 2. Se estiver carregando, mostre o "Loading"
  if (isLoading) {
    return (
      <View style={[styles.screenContainer, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  // 3. Se for um usuário logado, mostre o formulário
  return (
    <ScrollView style={styles.screenContainer}>
      <View style={{ padding: 20 }}>
        
        <Text style={styles.formTitle}>Meu Perfil</Text>
        <Text style={styles.formSubtitle}>
          Aqui você pode ver e editar seus dados.
        </Text>

        {/* <<< MUDANÇA: styles.inputLabel agora é lido do 'styles' global */}
        <Text style={styles.inputLabel}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />
        
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#e0e0e0', color: '#555' }]}
          value={email}
          editable={false}
        />

        <Text style={styles.inputLabel}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
          placeholder="(11) 9..."
          keyboardType="phone-pad"
        />

        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={handleSalvar}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color={cores.preto} />
          ) : (
            <Text style={styles.buttonText}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

// <<< MUDANÇA: stylesLocal e Object.assign foram REMOVIDOS

export default MeuPerfilTela;