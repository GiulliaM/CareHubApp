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
// Lembre-se de instalar: npm i react-native-keyboard-aware-scroll-view
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; 

// Importando estilos e cores (padronizado para minúsculas)
import { styles } from '../style/boasVindasStyle';
import { cores } from '../constantes/cores';

// O endereço da sua API
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
    {/* <<< CORREÇÃO APLICADA AQUI */}
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
    <TouchableOpacity style={styles.primaryButton} onPress={() => onSetStep(2)}>
      <Text style={styles.buttonText}>Começar Cadastro</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.secondaryButton} onPress={onComplete}>
      <Text style={styles.secondaryButtonText}>Pular (Modo Visitante)</Text>
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
  onCadastrar: () => void; // A função que chama a API
};
const RegisterUserStep: React.FC<RegisterUserStepProps> = ({
  nome, setNome, email, setEmail, senha, setSenha, isLoading, onCadastrar
}) => (
  <KeyboardAwareScrollView
    style={{ flex: 1, backgroundColor: cores.branco }}
    contentContainerStyle={{ flexGrow: 1, padding: 20 }} 
    enableOnAndroid={true}
    extraScrollHeight={Platform.OS === 'ios' ? 20 : 0} 
    keyboardShouldPersistTaps="handled"
  >
    {/* Usando os estilos corretos de formulário */}
    <Text style={styles.formTitle}>Seu Cadastro</Text>
    <Text style={styles.formSubtitle}>Primeiro, vamos criar a sua conta.</Text>
    
    <TextInput
      style={styles.input}
      placeholder="Seu nome completo"
      placeholderTextColor="#443535ff"
      value={nome}
      onChangeText={setNome} 
    />
    <TextInput
      style={styles.input}
      placeholder="Seu melhor email"
      keyboardType="email-address"
      autoCapitalize="none"
      placeholderTextColor="#443535ff"
      value={email}
      onChangeText={setEmail} 
    />
    <TextInput
      style={styles.input}
      placeholder="Crie uma senha"
      secureTextEntry
      placeholderTextColor="#443535ff"
      value={senha}
      onChangeText={setSenha} 
    />

    <View style={styles.flexSpacer} /> 
    
    {isLoading ? (
      <ActivityIndicator size="large" color={cores.primaria || '#007bff'} />
    ) : (
      <TouchableOpacity style={styles.primaryButton} onPress={onCadastrar}>
          <Text style={styles.buttonText}>Próximo Passo</Text>
      </TouchableOpacity>
    )}
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
    {/* Usando os estilos corretos de formulário */}
    <Text style={styles.formTitle}>Quem será cuidado?</Text>
    <Text style={styles.formSubtitle}>Agora, cadastre os dados da pessoa que você irá cuidar.</Text>
    
    <TextInput
      style={styles.input}
      placeholder="Nome da pessoa"
      placeholderTextColor="#999"
    />
    <TextInput
      style={styles.input}
      placeholder="Data de nascimento (DD/MM/AAAA)"
      placeholderTextColor="#999"
    />
    <TextInput
      style={styles.input}
      placeholder="Alergias (opcional)"
      placeholderTextColor="#999"
    />
    
    <View style={styles.flexSpacer} /> 

    <TouchableOpacity style={styles.primaryButton} onPress={onComplete}>
      <Text style={styles.buttonText}>Concluir e Entrar no App</Text>
    </TouchableOpacity>
  </KeyboardAwareScrollView>
);


// ---
// COMPONENTE PRINCIPAL (O "Pai")
// ---

type Props = {
  onComplete: () => void;
};

const OnboardingFlow: React.FC<Props> = ({ onComplete }) => {
  // ---
  // Todos os estados e lógicas ficam aqui
  // ---
  const [step, setStep] = useState(1);
  
  // Estados Etapa 2
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  // Função que chama a API para cadastrar o usuário
  const handleCadastroUsuario = async () => {
    if (!nome || !email || !senha) {
        Alert.alert('Campos incompletos', 'Por favor, preencha nome, email e senha.');
        return;
    }
    setIsLoading(true); 
    try {
        const dadosCadastro = { nome, email, senha, tipo_usuario: 'Familiar' };
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

  // Renderiza a etapa correta
  switch (step) {
    case 1:
      return <WelcomeStep onSetStep={setStep} onComplete={onComplete} />;
    case 2:
      return (
        <RegisterUserStep
          nome={nome}
          setNome={setNome}
          email={email}
          setEmail={setEmail}
          senha={senha}
          setSenha={setSenha}
          isLoading={isLoading}
          onCadastrar={handleCadastroUsuario}
        />
      );
    case 3:
      return (
        <RegisterPatientStep 
          onComplete={onComplete} 
        />
      );
    default:
      return <WelcomeStep onSetStep={setStep} onComplete={onComplete} />;
  }
};

export default OnboardingFlow;