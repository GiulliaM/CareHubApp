// Arquivo: src/style/homeStyle.tsx (nome minúsculo para padronizar)
import { StyleSheet, Dimensions, ViewStyle, TextStyle, ImageStyle } from 'react-native';
// <<< MUDANÇA: 'cores' minúsculo
import { cores } from '../constantes/cores';
import { comumEstilosObjeto } from './comumEstilos';

const { width } = Dimensions.get('window');

// <<< MUDANÇA: Adicionado 'as ViewStyle', etc. em TODAS as regras
const homeEstilosUnicos = {
  clubeCardContainer: {
    margin: 20,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } as ViewStyle,
  clubeCardBackground: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  } as ViewStyle, // Pode ser ViewStyle ou ImageStyle
  clubeCardOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 24,
  } as ViewStyle,
  clubeCardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.branco,
    marginBottom: 4,
  } as TextStyle,
  clubeCardSubtitle: {
    fontSize: 16,
    color: cores.branco,
    marginBottom: 16,
  } as TextStyle,
  clubeCardButton: {
    backgroundColor: cores.destaque,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignSelf: 'flex-start',
  } as ViewStyle,
  clubeCardButtonText: {
    color: cores.branco,
    fontWeight: 'bold',
    fontSize: 14,
  } as TextStyle,
  clubeFeaturesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    flexWrap: 'wrap',
  } as ViewStyle,
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  } as ViewStyle,
  featureText: {
    color: cores.branco,
    marginLeft: 8,
    fontSize: 12,
  } as TextStyle,
  
  // <<< ERRO DO SEU PRINT ESTAVA AQUI
  viewData: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30
  } as ViewStyle,
  
  cardRemedioText:{
    flex:1,
    flexDirection: "column",
  } as ViewStyle, // Use ViewStyle para containers de texto
  
  cardRemedio:{
    flex:1,
    flexDirection: "row",
    gap: 15,
    padding: 20,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: cores.secundaria,
    margin: 15,
    backgroundColor: cores.fundo
  } as ViewStyle,
  
  // <<< ERRO DO SEU PRINT ESTAVA AQUI
  plusButton:{
    position: "absolute",
    backgroundColor: cores.primaria,
    borderRadius: 50,
    padding: 10,
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  } as ViewStyle,
  text:{
    textAlign: 'center',
    fontSize: 16,
    color: cores.preto,
  },
};

// Não usamos mais o StyleSheet.create() aqui
export const styles = {
  ...comumEstilosObjeto,
  ...homeEstilosUnicos,
};