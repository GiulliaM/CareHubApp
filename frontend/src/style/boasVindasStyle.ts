// Arquivo: src/style/boasVindasStyle.tsx (nome minúsculo para padronizar)
import { StyleSheet, Dimensions, ViewStyle, TextStyle, ImageStyle } from 'react-native';
// <<< MUDANÇA: 'cores' minúsculo
import { cores } from '../constantes/cores';
import { comumEstilosObjeto } from './comumEstilos';

const { width, height } = Dimensions.get('window');

// <<< MUDANÇA: Adicionado 'as ViewStyle', etc. em TODAS as regras
const boasVindasEstilosUnicos = {
  pageContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',                                                                                               
    backgroundColor: cores.branco,
    padding: 20,
  } as ViewStyle,
  
  headerImage: {
    width: width,
    height: height * 0.4,
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  } as ImageStyle,
  
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
};

// Não usamos mais o StyleSheet.create() aqui
export const styles = {
  ...comumEstilosObjeto,
  ...boasVindasEstilosUnicos,
};