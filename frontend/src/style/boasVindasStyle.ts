import { Dimensions, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { cores } from '../constantes/cores';
import { comumEstilosObjeto } from './comumEstilos';

const { width, height } = Dimensions.get('window');

const boasVindasEstilosUnicos = {
  // === Layout de Tela Inicial (WelcomeStep) ===
  pageContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',                                                                                               
    backgroundColor: cores.branco,
    paddingHorizontal: 20, 
  } as ViewStyle,
  
  logoSmall: { // Logo no topo do WelcomeStep
    width: width * 1.0,
    height: height * 0.60,
    contentFit: 'cover', // <-- Funciona com 'expo-image'
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0, 
  } as ImageStyle,
  
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: cores.preto,
    marginTop: 0, 
    marginBottom: 8,
    textAlign: 'center', 
  } as TextStyle,
  
  subtitle: {
    fontSize: 18,
    color: cores.preto,
    textAlign: 'center', 
  } as TextStyle,

  // === Layout de Formulários (Cabeçalho Simples Azul) ===
  headerContainer: {
    width: '100%',
    height: height * 0.25, // Altura do cabeçalho
    backgroundColor: cores.azulClaro, // Use uma cor escura do tema
    // MUDANÇA: Não precisamos de justify-content: 'flex-end' aqui, pois vamos colocar o título na área branca.
  } as ViewStyle,
  
  formContentContainer: {
    flex: 1,
    backgroundColor: cores.branco,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -40, // Puxa para cima para cobrir o container
    paddingTop: 40, // Espaço dentro do container branco
    paddingHorizontal: 20,
  } as ViewStyle,

  // Novo estilo para o título dentro do formulário branco
  formTitleHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    color: cores.preto,
    marginBottom: 8,
    textAlign: 'left',
  } as TextStyle,
  
  // Novo estilo para o subtítulo dentro do formulário branco
  formSubtitleHeader: {
    fontSize: 15,
    color: '#555',
    marginBottom: 30,
    textAlign: 'left',
  } as TextStyle,

  // Estilos de formulário (mantidos)
  formTitle: { 
    fontSize: 26,
    fontWeight: 'bold',
    color: cores.preto,
    marginBottom: 8,
    textAlign: 'center',
  } as TextStyle,
  formSubtitle: { 
    fontSize: 15,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  } as TextStyle,
  textInput: {
      width: '100%',
      backgroundColor: '#f7f7f7',
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      fontSize: 16,
      color: cores.preto,
      marginBottom: 14,
      } as TextStyle,
  passwordEyeIcon: {
    position: 'absolute',
    right: 15,
    top: 14,
  } as ViewStyle,
  botoes:{
    marginTop: 60,
  },
  boasvindas:{
    marginBottom: 300,
    },
  primaryButton: {
    backgroundColor: cores.azulClaro,
    borderRadius: 12,
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
  } as ViewStyle,
  buttonText: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: 'bold',
  } as TextStyle,
};

export const styles = {
  ...comumEstilosObjeto,
  ...boasVindasEstilosUnicos,
};