import { Dimensions, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { cores } from '../constantes/cores';
import { comumEstilosObjeto } from './comumEstilos';

const { width, height } = Dimensions.get('window');

const boasVindasEstilosUnicos = {
  pageContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',                                                                                               
    backgroundColor: cores.branco,
    padding: 20,
  } as ViewStyle,
  
  headerImage: {
    width: width * 1.0,
    height: height * 0.60,
    contentFit: 'cover', // <-- Funciona com 'expo-image'
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  } as ImageStyle,

  word: {
    marginTop: height * 0.1,
  } as ViewStyle,

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: cores.preto,
    marginTop: height * 0.4 + 20,
    marginBottom: 8,
  } as TextStyle,
  
  subtitle: {
    fontSize: 18,
    color: cores.preto,
    marginBottom: 24,
  } as TextStyle,

  topContainer: {
    backgroundColor: cores.branco,
    height: height * 0.35,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
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
  primaryButton: {
    backgroundColor: cores.azulClaro,
    borderRadius: 12,
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  } as ViewStyle,
  buttonText: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: 'bold',
  } as TextStyle,
  footerText: {
    color: '#444',
    fontSize: 15,
    marginTop: 18,
  } as TextStyle,
  linkText: {
    color: cores.azulClaro,
    fontWeight: 'bold',
  } as TextStyle,
};

// Mescla com estilos comuns e exporta um único objeto chamado `styles`
export const styles = {
  ...comumEstilosObjeto,
  ...boasVindasEstilosUnicos,
};