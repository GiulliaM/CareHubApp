// frontend/src/telas/PerfilPessoaCuidadaTela.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../style/homeStyle'; // Nossos estilos globais
import { cores } from '../constantes/cores';
import { LogIn, Camera } from 'lucide-react-native';
import { Image } from 'expo-image'; // Usar o Image do Expo
import * as ImagePicker from 'expo-image-picker';

const API_URL = 'http://54.39.173.152:3000'; // Sua API

type PerfilPacienteProps = {
  isGuest: boolean;
  onLogout: () => void;
};

const PerfilPessoaCuidadaTela: React.FC<PerfilPacienteProps> = ({ isGuest, onLogout }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Estados para os dados do formulário
  const [pacienteId, setPacienteId] = useState<number | null>(null);
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [infoMedicas, setInfoMedicas] = useState('');
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [novaFotoUri, setNovaFotoUri] = useState<string | null>(null); // Para a nova foto selecionada
  
  // Função para buscar os dados na API
  const fetchPerfilPaciente = useCallback(async () => {
    if (isGuest) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    const token = await AsyncStorage.getItem('@carehub_token');
    if (!token) {
      Alert.alert("Erro", "Token não encontrado. Faça login.");
      setIsLoading(false);
      onLogout();
      return;
    }

    try {
      // (Esta é a nova rota que acabamos de criar no back-end)
      const response = await fetch(`${API_URL}/api/meus-pacientes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        // (Por enquanto, pegamos o primeiro paciente da lista)
        setPacienteId(data.id);
        setNome(data.nome);
        setDataNascimento(data.data_nascimento || ''); // (Vem formatado como DD/MM/AAAA)
        setInfoMedicas(data.informacoes_medicas || '');
        setFotoUrl(data.foto_url ? `${API_URL}${data.foto_url}` : null); // (Monta a URL completa)
      } else {
        Alert.alert("Nenhum paciente", data.message || "Nenhum paciente cadastrado.");
      }
    } catch (error: any) {
      Alert.alert("Erro de conexão", error.message);
    } finally {
      setIsLoading(false);
    }
  }, [isGuest, onLogout]);

  // Roda a busca toda vez que a tela entra em foco
  useFocusEffect(fetchPerfilPaciente);
  
  // Função para escolher uma nova imagem
  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "Precisamos de acesso à sua galeria.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setNovaFotoUri(result.assets[0].uri); // Salva a URI da nova foto
    }
  };

  // Função para salvar as alterações
  const handleSalvar = async () => {
    if (!nome) {
      Alert.alert("Erro", "O nome é obrigatório.");
      return;
    }
    if (!pacienteId) {
      Alert.alert("Erro", "ID do paciente não encontrado.");
      return;
    }
    
    setIsSaving(true);
    const token = await AsyncStorage.getItem('@carehub_token');
    
    // 1. Criar o FormData
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('data_nascimento', dataNascimento);
    formData.append('informacoes_medicas', infoMedicas);
    
    // 2. Anexar a foto (se o usuário escolheu uma nova)
    if (novaFotoUri) {
      const extensao = novaFotoUri.split('.').pop();
      const tipoMime = `image/${extensao === 'jpg' ? 'jpeg' : extensao}`;
      // @ts-ignore
      formData.append('foto', {
        uri: novaFotoUri,
        name: `perfil.${extensao}`,
        type: tipoMime,
      });
    }

    try {
      // 3. Enviar para a rota de ATUALIZAÇÃO (PUT)
      const response = await fetch(`${API_URL}/api/pacientes/${pacienteId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        Alert.alert("Sucesso!", "Perfil do paciente atualizado.");
        // Atualiza a foto na tela se uma nova foi enviada
        if(data.foto_url) {
          setFotoUrl(`${API_URL}${data.foto_url}`);
          setNovaFotoUri(null); // Limpa a "nova foto"
        }
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
  
  // 1. Se for Visitante
  if (isGuest) {
    return (
      <View style={[styles.screenContainer, { padding: 20, alignItems: 'center', justifyContent: 'center' }]}>
        <LogIn size={48} color={cores.primaria} />
        <Text style={[styles.formTitle, { marginTop: 20 }]}>Modo Visitante</Text>
        <Text style={[styles.formSubtitle, { textAlign: 'center', marginBottom: 30 }]}>
          Você precisa estar logado para ver o perfil da pessoa cuidada.
        </Text>
        <TouchableOpacity style={styles.primaryButton} onPress={onLogout}>
          <Text style={styles.buttonText}>Ir para o Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // 2. Se estiver carregando
  if (isLoading) {
    return (
      <View style={[styles.screenContainer, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  // 3. Se for um usuário logado
  return (
    <ScrollView style={styles.screenContainer}>
      <View style={{ padding: 20 }}>
        
        <Text style={styles.formTitle}>Perfil (Pessoa Cuidada)</Text>
        <Text style={styles.formSubtitle}>
          Visualize e edite os dados da pessoa cuidada.
        </Text>

        {/* Seletor de Imagem */}
        <TouchableOpacity style={localStyles.imagePicker} onPress={handlePickImage}>
          {/* Mostra a nova foto (se selecionada) ou a foto antiga (do banco) */}
          <Image 
            source={{ uri: novaFotoUri || fotoUrl || undefined }} 
            style={localStyles.profileImage}
            placeholder={localStyles.imagePlaceholder} // Mostra o ícone enquanto carrega
            contentFit="cover"
          />
        </TouchableOpacity>

        <Text style={styles.inputLabel}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />
        
        <Text style={styles.inputLabel}>Data de Nascimento (DD/MM/AAAA)</Text>
        <TextInput
          style={styles.input}
          value={dataNascimento}
          onChangeText={setDataNascimento}
          placeholder="DD/MM/AAAA"
        />

        <Text style={styles.inputLabel}>Informações Médicas</Text>
        <TextInput
          style={[styles.input, { height: 100 }]} // Input maior
          value={infoMedicas}
          onChangeText={setInfoMedicas}
          placeholder="Alergias, remédios contínuos, etc."
          multiline={true}
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

// Estilos locais para o upload de imagem
const localStyles = StyleSheet.create({
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
});

export default PerfilPessoaCuidadaTela;