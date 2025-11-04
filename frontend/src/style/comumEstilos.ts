// Arquivo: src/style/comumEstilos.ts

// <<< MUDANÇA: Importamos os tipos de estilo
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { cores } from '../constantes/cores';

/**
 * Este objeto contém TODOS os estilos que se repetem pelo aplicativo.
 */
export const comumEstilosObjeto = {

  // --- Layouts Globais ---
  screenContainer: {
    flex: 1,
    backgroundColor: cores.branco,
  } as ViewStyle, // <<< MUDANÇA: Adicionado tipo
  
  flexSpacer: {
    flex: 1, 
  } as ViewStyle, // <<< MUDANÇA: Adicionado tipo

  // --- Cabeçalhos ---
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: cores.branco,
  } as ViewStyle, // <<< MUDANÇA: Adicionado tipo
  
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: cores.primaria,
  } as TextStyle, // <<< MUDANÇA: Adicionado tipo

  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
  } as ViewStyle, // <<< MUDANÇA: Adicionado tipo
  
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: cores.preto,
  } as TextStyle, // <<< MUDANÇA: Adicionado tipo

  // --- Formulários ---
  input: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    color: cores.preto,
  } as TextStyle, // <<< MUDANÇA: Adicionado tipo (TextInput é texto)

  formTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: cores.preto,
    marginTop: 20,
    marginBottom: 8,
  } as TextStyle, // <<< MUDANÇA: Adicionado tipo
  
  formSubtitle: {
    fontSize: 18,
    color: cores.preto,
    marginBottom: 24,
  } as TextStyle, // <<< MUDANÇA: Adicionado tipo

  // --- Botões ---
  primaryButton: {
    backgroundColor: cores.primaria,
    padding: 18,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 12,
  } as ViewStyle, // <<< MUDANÇA: Adicionado tipo
  
  buttonText: {
    color: cores.preto,
    fontSize: 16,
    fontWeight: 'bold',
  } as TextStyle, // <<< MUDANÇA: Adicionado tipo
  
  secondaryButton: {
    padding: 18,
    borderRadius: 50,
    alignItems: 'center',
  } as ViewStyle, // <<< MUDANÇA: Adicionado tipo
  
  secondaryButtonText: {
    color: cores.secundaria,
    fontSize: 16,
    fontWeight: 'bold',
  } as TextStyle, // <<< MUDANÇA: Adicionado tipo

  // --- Cards Comuns ---
  emptyCard: {
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: 32,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  } as ViewStyle, // <<< MUDANÇA: Adicionado tipo
  
  emptyCardText: {
    fontSize: 16,
    color: cores.secundaria,
    textAlign: 'center',
    marginBottom: 16,
  } as TextStyle, // <<< MUDANÇA: Adicionado tipo
  
  emptyCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.primaria + '20',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  } as ViewStyle, // <<< MUDANÇA: Adicionado tipo
  
  emptyCardButtonText: {
    color: cores.primaria,
    fontWeight: 'bold',
    fontSize: 14,
  } as TextStyle, // <<< MUDANÇA: Adicionado tipo

  // --- Texto ---
  textoNormal:{
    color: cores.preto,
    fontWeight: 'bold',
    fontSize: 18,
  } as TextStyle, // <<< MUDANÇA: Adicionado tipo

};