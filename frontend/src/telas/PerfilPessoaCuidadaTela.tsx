// frontend/src/telas/PerfilPessoaCuidadaTela.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, StyleSheet } from 'react-native';
// <<< MUDANÇA: useFocusEffect importado
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../style/homeStyle'; 
import { cores } from '../constantes/cores';
import { LogIn, Camera } from 'lucide-react-native';
import { Image } from 'expo-image'; 
import * as ImagePicker from 'expo-image-picker';

const API_URL = 'http://54.39.173.152:3000'; 

type PerfilPacienteProps = {
  isGuest: boolean;
  onLogout: () => void;
};

const PerfilPessoaCuidadaTela: React.FC<PerfilPacienteProps> = ({ isGuest, onLogout }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pacienteId, setPacienteId] = useState<number | null>(null);
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [infoMedicas, setInfoMedicas] = useState('');
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [novaFotoUri, setNovaFotoUri] = useState<string | null>(null); 
  
  // A função de busca (embrulhada em useCallback)
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
      const response = await fetch(`${API_URL}/api/meus-pacientes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        setPacienteId(data.id);
        setNome(data.nome);
        setDataNascimento(data.data_nascimento || ''); 
        setInfoMedicas(data.informacoes_medicas || '');
        setFotoUrl(data.foto_url ? `${API_URL}${data.foto_url}` : null); 
      } else {
        Alert.alert("Nenhum paciente", data.message || "Nenhum paciente cadastrado.");
      }
    } catch (error: any) {
      // O 'JSON Parse error' acontece aqui se for um 404
      if (error instanceof SyntaxError) {
        Alert.alert("Erro de API", "Não foi possível conectar. Verifique se a API na VPS está atualizada.");
      } else {
        Alert.alert("Erro de conexão", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isGuest, onLogout]);

  // <<< MUDANÇA: Esta é a sintaxe correta para o useFocusEffect
  // Isso corrige o erro 'An effect function must not return...'
  useFocusEffect(
    React.useCallback(() => {
      fetchPerfilPaciente();
    }, [fetchPerfilPaciente])
  );
  
  const handlePickImage = async () => {
    // (A lógica de 'handlePickImage' continua a mesma...)
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
      setNovaFotoUri(result.assets[0].uri); 
    }
  };

  const handleSalvar = async () => {
    // (A lógica de 'handleSalvar' continua a mesma...)
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
    
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('data_nascimento', dataNascimento);
    formData.append('informacoes_medicas', infoMedicas);
    
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
        if(data.foto_url) {
          setFotoUrl(`${API_URL}${data.foto_url}`);
          setNovaFotoUri(null); 
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
  
  if (isGuest) {
    // (Renderização do Visitante... continua a mesma)
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
  
  if (isLoading) {
    // (Renderização do Loading... continua a mesma)
    return (
      <View style={[styles.screenContainer, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  return (
    // (Renderização do Formulário... continua a mesma)
    <ScrollView style={styles.screenContainer}>
      <View style={{ padding: 20 }}>
        <Text style={styles.formTitle}>Perfil (Pessoa Cuidada)</Text>
        <Text style={styles.formSubtitle}>
          Visualize e edite os dados da pessoa cuidada.
        </Text>
        <TouchableOpacity style={localStyles.imagePicker} onPress={handlePickImage}>
          <Image 
            source={{ uri: novaFotoUri || fotoUrl || undefined }} 
            style={localStyles.profileImage}
            placeholder={localStyles.imagePlaceholder}
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
          style={[styles.input, { height: 100 }]}
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