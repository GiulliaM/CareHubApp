import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Alert, 
    ActivityIndicator,
    Platform
} from 'react-native';
import {Image } from 'expo-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; 
import { Eye, EyeOff } from 'lucide-react-native'; 

import { styles } from '../style/boasVindasStyle';
import { cores } from '../constantes/cores';
// PENSANDO NO BACK-END:
// Precisaremos disso para salvar o token de login
// import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://54.39.173.152:3000';

// ---
// COMPONENTES DAS ETAPAS (MOVIDOS PARA FORA)
// ---

// --- ETAPA 1: BOAS-VINDAS ---
type WelcomeStepProps = {
  onSetStep: (step: number) => void;
  onComplete: () => void;
};
const WelcomeStep: React.FC<WelcomeStepProps> = ({ onSetStep, onComplete }) => (
  <View style={styles.pageContainer}>
    <Image
      style={styles.headerImage} 
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
    <TouchableOpacity style={[styles.secondaryButton, { padding: 12 }]} onPress={onComplete}>
      <Text style={[styles.secondaryButtonText, { fontSize: 14 }]}>Pular (Modo Visitante)</Text>
    </TouchableOpacity>
  </View>
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
);


// --- ETAPA 3: CADASTRO DO PACIENTE ---
type RegisterPatientStepProps = {
  onComplete: () => void;
};
const RegisterPatientStep: React.FC<RegisterPatientStepProps> = ({ onComplete }) => (
  <KeyboardAwareScrollView
    style={{ flex: 1, backgroundColor: cores.branco }}
    contentContainerStyle={{ flexGrow: 1, padding: 20 }} 
    enableOnAndroid={true}
    extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
    keyboardShouldPersistTaps="handled"
  >
    <Text style={styles.formTitle}>Quem será cuidado?</Text>
    <Text style={styles.formSubtitle}>Agora, cadastre os dados da pessoa que você irá cuidar.</Text>
    
    <TextInput style={styles.input} placeholder="Nome da pessoa" placeholderTextColor="#999" />
    <TextInput style={styles.input} placeholder="Data de nascimento (DD/MM/AAAA)" placeholderTextColor="#999" />
    <TextInput style={styles.input} placeholder="Alergias (opcional)" placeholderTextColor="#999" />
    
    <View style={styles.flexSpacer} /> 

    <TouchableOpacity style={styles.primaryButton} onPress={onComplete}>
      <Text style={styles.buttonText}>Concluir e Entrar no App</Text>
    </TouchableOpacity>
  </KeyboardAwareScrollView>
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
);


// --- COMPONENTE PRINCIPAL (O "Pai") ---
type Props = {
  onComplete: () => void;
};
const OnboardingFlow: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  
  const [nomeCadastro, setNomeCadastro] = useState('');
  const [emailCadastro, setEmailCadastro] = useState('');
  const [senhaCadastro, setSenhaCadastro] = useState('');
  
  const [emailLogin, setEmailLogin] = useState('');
  const [senhaLogin, setSenhaLogin] = useState('');
  
  const [isLoading, setIsLoading] = useState(false); 
  const [isSenhaVisivel, setIsSenhaVisivel] = useState(false);

  // Função de Cadastro (sem mudanças)
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
            Alert.alert('Sucesso!', 'Sua conta foi criada. Vamos para o próximo passo.');
            setStep(3); 
        } else {
            Alert.alert('Erro no Cadastro', data.message || 'Não foi possível criar a conta.');
        }
    } catch (error) {
        setIsLoading(false);
        console.error('Erro de conexão:', error);
        Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
    }
  };
  
  // <<< MUDANÇA: Função de Login CORRIGIDA
  const handleLogin = async () => {
    if (!emailLogin || !senhaLogin) {
        Alert.alert('Campos incompletos', 'Por favor, preencha email e senha.');
        return;
    }
    setIsLoading(true);
    
    // PENSANDO NO BACK-END:
    // A lógica real da API agora está ATIVA:
    try {
      const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ email: emailLogin, senha: senhaLogin }),
      });
      
      const data = await response.json();
      setIsLoading(false);
      
      if (response.ok) {
        // PENSANDO NO BACK-END:
        // O ideal é salvar o token aqui (data.token)
        // await AsyncStorage.setItem('@carehub_token', data.token);
        
        Alert.alert('Sucesso!', 'Login realizado.');
        // Avisa o App.tsx que o login foi feito
        onComplete(); 
      } else {
        Alert.alert('Erro no Login', data.message || 'Credenciais inválidas.');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Erro de conexão:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
    }
    
    // O Mock rápido foi REMOVIDO daqui.
  };

  // Renderiza a etapa correta
  switch (step) {
    case 1:
      return <WelcomeStep onSetStep={setStep} onComplete={onComplete} />;
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
          onComplete={onComplete} 
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
      return <WelcomeStep onSetStep={setStep} onComplete={onComplete} />;
  }
};

export default OnboardingFlow;