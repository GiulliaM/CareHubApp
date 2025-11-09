import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Alert, 
    ActivityIndicator,
    Platform,
    StyleSheet // Importe o StyleSheet
} from 'react-native';
import {Image } from 'expo-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; 
import { Eye, EyeOff, Camera } from 'lucide-react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context'; 
// <<< MUDANÇA: Importando o seletor de imagem
import * as ImagePicker from 'expo-image-picker'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

// <<< MUDANÇA: Importando o novo estilo mestre
import { styles } from '../style/estilosGlobais';
import { cores } from '../constantes/cores';
    
const API_URL = 'http://54.39.173.152:3000';

// --- ETAPA 1: BOAS-VINDAS ---
type WelcomeStepProps = {
  onSetStep: (step: number) => void;
  onComplete: () => void;
  onSkip: () => void;
};
const WelcomeStep: React.FC<WelcomeStepProps> = ({ onSetStep, onComplete, onSkip }) => (
  // <<< MUDANÇA: Usando screenContainer para o SafeArea
  <SafeAreaView style={styles.screenContainer}>
    <View style={styles.pageContainer}>
      <Image
        style={styles.headerImage} // (Usando headerImage do global)
        source="../images/bandaid-heart.webp"
      />
      <Text style={styles.title}>Boas-vindas.</Text>
      <Text style={styles.subtitle}>
        Cuidar é um gesto de amor. Conecte quem cuida para oferecer mais
        atenção, segurança e afeto no dia a dia.
      </Text>
      <View style={styles.flexSpacer} />
      <TouchableOpacity style={styles.primaryButton} onPress={() => onSetStep(4)}>
        <Text style={styles.buttonText}>Entrar (Login)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.secondaryButton, { padding: 12, marginBottom: 8 }]} onPress={() => onSetStep(2)}>
        <Text style={styles.secondaryButtonText}>Criar Nova Conta</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.secondaryButton, { padding: 12 }]} onPress={onSkip}>
        <Text style={[styles.secondaryButtonText, { fontSize: 14 }]}>Pular (Modo Visitante)</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

// --- ETAPA 2: CADASTRO DO USUÁRIO ---
type RegisterUserStepProps = {
  nome: string;
  setNome: (nome: string) => void;
  email: string;
  setEmail: (email: string) => void;
  senha: string;
  setSenha: (senha: string) => void;
  isLoading: boolean;
  onCadastrar: () => void;
  onGoToLogin: () => void;
  isSenhaVisivel: boolean;
  setIsSenhaVisivel: (val: boolean) => void;
};
const RegisterUserStep: React.FC<RegisterUserStepProps> = ({
  nome, setNome, email, setEmail, senha, setSenha, isLoading, onCadastrar, onGoToLogin,
  isSenhaVisivel, setIsSenhaVisivel
}) => (
  <SafeAreaView style={styles.screenContainer}>
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: cores.branco }}
      contentContainerStyle={{ flexGrow: 1, padding: 20 }} 
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === 'ios' ? 20 : 0} 
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.formTitle}>Criar Conta</Text>
      <Text style={styles.formSubtitle}>Vamos criar a sua conta.</Text>
      
      <TextInput style={styles.input} placeholder="Seu nome completo" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Seu melhor email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      
      <View style={styles.passwordContainer}>
        <TextInput 
          style={styles.passwordInput} 
          placeholder="Crie uma senha" 
          secureTextEntry={!isSenhaVisivel}
          value={senha} 
          onChangeText={setSenha} 
        />
        <TouchableOpacity 
          style={styles.passwordEyeIcon} 
          onPress={() => setIsSenhaVisivel(!isSenhaVisivel)}
        >
          {isSenhaVisivel ? (
            <EyeOff color={cores.preto} size={20} /> 
          ) : (
            <Eye color={cores.preto} size={20} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.flexSpacer} /> 
      
      {isLoading ? (
        <ActivityIndicator size="large" color={cores.primaria || '#007bff'} />
      ) : (
        <TouchableOpacity style={styles.primaryButton} onPress={onCadastrar}>
            <Text style={styles.buttonText}>Próximo Passo</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.secondaryButton} onPress={onGoToLogin}>
          <Text style={styles.secondaryButtonText}>Já tenho conta</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  </SafeAreaView>
);

// --- ETAPA 3: CADASTRO DO PACIENTE ---
type RegisterPatientStepProps = {
  nomePaciente: string;
  setNomePaciente: (nome: string) => void;
  dataNascimento: string;
  setDataNascimento: (data: string) => void;
  alergias: string;
  setAlergias: (alergias: string) => void;
  imagemPaciente: string | null;
  onPickImage: () => void;
  isLoading: boolean;
  onConcluir: () => void;
};
const RegisterPatientStep: React.FC<RegisterPatientStepProps> = ({ 
  nomePaciente, setNomePaciente, dataNascimento, setDataNascimento,
  alergias, setAlergias, imagemPaciente, onPickImage,
  isLoading, onConcluir
}) => (
  <SafeAreaView style={styles.screenContainer}>
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: cores.branco }}
      contentContainerStyle={{ flexGrow: 1, padding: 20 }} 
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.formTitle}>Quem será cuidado?</Text>
      <Text style={styles.formSubtitle}>Agora, cadastre os dados da pessoa que você irá cuidar.</Text>
      
      <TouchableOpacity style={localStyles.imagePicker} onPress={onPickImage}>
        {imagemPaciente ? (
          <Image source={{ uri: imagemPaciente }} style={localStyles.profileImage} />
        ) : (
          <View style={localStyles.imagePlaceholder}>
            <Camera size={40} color={cores.secundaria} />
            <Text style={localStyles.imagePickerText}>Selecionar Foto</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <TextInput 
        style={styles.input} 
        placeholder="Nome da pessoa (obrigatório)" 
        value={nomePaciente}
        onChangeText={setNomePaciente}
        placeholderTextColor="#999" 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Data de nascimento (DD/MM/AAAA)" 
        value={dataNascimento}
        onChangeText={setDataNascimento}
        placeholderTextColor="#999" 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Informações Médicas (opcional)" 
        value={alergias}
        onChangeText={setAlergias}
        placeholderTextColor="#999" 
      />
      
      <View style={styles.flexSpacer} /> 

      {isLoading ? (
        <ActivityIndicator size="large" color={cores.primaria} />
      ) : (
        <TouchableOpacity style={styles.primaryButton} onPress={onConcluir}>
          <Text style={styles.buttonText}>Concluir e Entrar no App</Text>
        </TouchableOpacity>
      )}
    </KeyboardAwareScrollView>
  </SafeAreaView>
);

// --- ETAPA 4: LOGIN ---
type LoginStepProps = {
  email: string;
  setEmail: (email: string) => void;
  senha: string;
  setSenha: (senha: string) => void;
  isLoading: boolean;
  onLogin: () => void;
  onGoToCadastro: () => void;
  isSenhaVisivel: boolean;
  setIsSenhaVisivel: (val: boolean) => void;
};
const LoginStep: React.FC<LoginStepProps> = ({
  email, setEmail, senha, setSenha, isLoading, onLogin, onGoToCadastro,
  isSenhaVisivel, setIsSenhaVisivel
}) => (
  <SafeAreaView style={styles.screenContainer}>
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: cores.branco }}
      contentContainerStyle={{ flexGrow: 1, padding: 20 }} 
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === 'ios' ? 20 : 0} 
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.formTitle}>Login</Text>
      <Text style={styles.formSubtitle}>Que bom te ver de volta!</Text>
      
      <TextInput style={styles.input} placeholder="Seu email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      
      <View style={styles.passwordContainer}>
        <TextInput 
          style={styles.passwordInput} 
          placeholder="Sua senha" 
          secureTextEntry={!isSenhaVisivel}
          value={senha} 
          onChangeText={setSenha} 
        />
        <TouchableOpacity 
          style={styles.passwordEyeIcon} 
          onPress={() => setIsSenhaVisivel(!isSenhaVisivel)}
        >
          {isSenhaVisivel ? (
            <EyeOff color={cores.preto} size={20} /> 
          ) : (
            <Eye color={cores.preto} size={20} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.flexSpacer} /> 
      
      {isLoading ? (
        <ActivityIndicator size="large" color={cores.primaria || '#007bff'} />
      ) : (
        <TouchableOpacity style={styles.primaryButton} onPress={onLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.secondaryButton} onPress={onGoToCadastro}>
          <Text style={styles.secondaryButtonText}>Não tenho conta (Cadastrar)</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  </SafeAreaView>
);

// --- COMPONENTE PRINCIPAL (O "Pai") ---
type Props = {
  onComplete: () => void;
  onSkip: () => void; 
};
const OnboardingFlow: React.FC<Props> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(1);
  
  const [nomeCadastro, setNomeCadastro] = useState('');
  const [emailCadastro, setEmailCadastro] = useState('');
  const [senhaCadastro, setSenhaCadastro] = useState('');
  const [emailLogin, setEmailLogin] = useState('');
  const [senhaLogin, setSenhaLogin] = useState('');
  const [nomePaciente, setNomePaciente] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [alergias, setAlergias] = useState('');
  const [imagemPaciente, setImagemPaciente] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [isSenhaVisivel, setIsSenhaVisivel] = useState(false);

  // --- Funções de Lógica ---
  const handleCadastroUsuario = async () => {
    if (!nomeCadastro || !emailCadastro || !senhaCadastro) {
        Alert.alert('Campos incompletos', 'Por favor, preencha nome, email e senha.');
        return;
    }
    setIsLoading(true); 
    try {
        const dadosCadastro = { nome: nomeCadastro, email: emailCadastro, senha: senhaCadastro, tipo_usuario: 'Familiar' };
        const response = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dadosCadastro),
        });
        const data = await response.json();
        setIsLoading(false); 
        if (response.ok) {
            Alert.alert('Sucesso!', 'Sua conta foi criada. Agora, cadastre o paciente.');
            try {
              const loginResponse = await fetch(`${API_URL}/login`, {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({ email: emailCadastro, senha: senhaCadastro }),
              });
              const loginData = await loginResponse.json();
              if (loginResponse.ok) {
                await AsyncStorage.setItem('@carehub_token', loginData.token);
                setStep(3);
              } else {
                setStep(4);
              }
            } catch (e) {
               setStep(4);
            }
        } else {
            Alert.alert('Erro no Cadastro', data.message || 'Não foi possível criar a conta.');
        }
    } catch (error) {
        setIsLoading(false);
        console.error('Erro de conexão:', error);
        Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
    }
  };
  
  const handleLogin = async () => {
    if (!emailLogin || !senhaLogin) {
        Alert.alert('Campos incompletos', 'Por favor, preencha email e senha.');
        return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ email: emailLogin, senha: senhaLogin }),
      });
      const data = await response.json();
      setIsLoading(false);
      if (response.ok) {
        await AsyncStorage.setItem('@carehub_token', data.token);
        Alert.alert('Sucesso!', 'Login realizado.');
        onComplete(); 
      } else {
        Alert.alert('Erro no Login', data.message || 'Credenciais inválidas.');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Erro de conexão:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
    }
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "Precisamos de acesso à sua galeria para escolher uma foto.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      // <<< MUDANÇA: Voltando para 'MediaTypeOptions' que funciona
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setImagemPaciente(result.assets[0].uri);
    }
  };

  const handleCadastroPaciente = async () => {
    if (!nomePaciente) {
      Alert.alert('Campo obrigatório', 'Por favor, preencha o nome do paciente.');
      return;
    }
    setIsLoading(true);
    const token = await AsyncStorage.getItem('@carehub_token');
    if (!token) {
      Alert.alert('Erro de autenticação', 'Não foi possível encontrar seu login. Por favor, faça login novamente.');
      setIsLoading(false);
      setStep(4);
      return;
    }
    const formData = new FormData();
    formData.append('nome', nomePaciente);
    if (dataNascimento) {
      formData.append('data_nascimento', dataNascimento);
    }
    if (alergias) {
      formData.append('informacoes_medicas', alergias);
    }
    if (imagemPaciente) {
      const extensao = imagemPaciente.split('.').pop();
      const tipoMime = `image/${extensao === 'jpg' ? 'jpeg' : extensao}`;
      // @ts-ignore
      formData.append('foto', {
        uri: imagemPaciente,
        name: `perfil.${extensao}`,
        type: tipoMime,
      });
    }
    try {
      const response = await fetch(`${API_URL}/api/pacientes`, { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      setIsLoading(false);
      if (response.ok) {
        Alert.alert('Sucesso!', `${nomePaciente} foi cadastrado.`);
        onComplete(); 
      } else {
        Alert.alert('Erro ao salvar', data.message || 'Não foi possível cadastrar o paciente.');
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error('Erro de conexão (Paciente):', error);
      Alert.alert('Erro de Conexão', error.message);
    }
  };

  // --- Renderização ---
  switch (step) {
    case 1:
      return <WelcomeStep onSetStep={setStep} onComplete={onComplete} onSkip={onSkip} />;
    case 2:
      return (
        <RegisterUserStep
          nome={nomeCadastro}
          setNome={setNomeCadastro}
          email={emailCadastro}
          setEmail={setEmailCadastro}
          senha={senhaCadastro}
          setSenha={setSenhaCadastro}
          isLoading={isLoading}
          onCadastrar={handleCadastroUsuario}
          onGoToLogin={() => setStep(4)}
          isSenhaVisivel={isSenhaVisivel}
          setIsSenhaVisivel={setIsSenhaVisivel}
        />
      );
    case 3:
      return (
        <RegisterPatientStep 
          nomePaciente={nomePaciente}
          setNomePaciente={setNomePaciente}
          dataNascimento={dataNascimento}
          setDataNascimento={setDataNascimento}
          alergias={alergias}
          setAlergias={setAlergias}
          imagemPaciente={imagemPaciente}
          onPickImage={handlePickImage}
          isLoading={isLoading}
          onConcluir={handleCadastroPaciente}
        />
      );
    case 4:
      return (
        <LoginStep
          email={emailLogin}
          setEmail={setEmailLogin}
          senha={senhaLogin}
          setSenha={setSenhaLogin}
          isLoading={isLoading}
          onLogin={handleLogin}
          onGoToCadastro={() => setStep(2)}
          isSenhaVisivel={isSenhaVisivel}
          setIsSenhaVisivel={setIsSenhaVisivel}
        />
      );
    default:
      return <WelcomeStep onSetStep={setStep} onComplete={onComplete} onSkip={onSkip} />;
  }
};

// Estilos locais (necessários para o seletor de imagem)
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
  imagePickerText: {
    marginTop: 8,
    color: cores.secundaria,
  }
});

export default OnboardingFlow;