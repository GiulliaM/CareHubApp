// frontend/src/style/estilosGlobais.ts
import { StyleSheet, Dimensions, Platform, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { cores } from '../constantes/cores'; 

const { width, height } = Dimensions.get('window');

// Objeto principal com TODOS os estilos combinados e corrigidos
const estilosObjeto = {
  // --- Layouts Globais ---
  screenContainer: {
    flex: 1,
    backgroundColor: cores.branco,
  } as ViewStyle,
  container: { // (Vindo do homeStyle)
    flex: 1, 
    backgroundColor: '#f0f4f7' 
  } as ViewStyle,
  flexSpacer: {
    flex: 1, 
  } as ViewStyle,
  
  // --- Cabeçalhos (Unificados) ---
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50, // Padding seguro
    paddingBottom: 16,
    backgroundColor: cores.branco,
  } as ViewStyle,
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: cores.primaria,
  } as TextStyle,

  // --- Seções ---
  sectionHeaderContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    marginTop: 20, 
    marginBottom: 10 
  } as ViewStyle,
  sectionTitle: { 
    fontSize: 22, // Unificado (era 18 e 22)
    fontWeight: 'bold', // Unificado (era 700 e bold)
    color: cores.preto 
  } as TextStyle,
  sectionAction: { 
    color: cores.primaria, 
    fontWeight: 'bold' 
  } as TextStyle,
  sectionSubtitle: { // (Vindo do tarefaStyle)
    fontSize: 13,
    color: cores.cinzaClaro,
  } as TextStyle,

  // --- Formulários (Unificados) ---
  input: {
    width: '100%',
    backgroundColor: '#f7f7f7', // (do boasVindasStyle)
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: cores.preto,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  } as TextStyle,
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.preto,
    marginBottom: 8,
    marginLeft: 4,
  } as TextStyle,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 16,
  } as ViewStyle,
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: cores.preto,
  } as TextStyle,
  passwordEyeIcon: {
    padding: 16,
  } as ViewStyle,

  // --- Botões (Unificados) ---
  primaryButton: {
    backgroundColor: cores.azulClaro, // (do boasVindasStyle)
    borderRadius: 12,
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  } as ViewStyle,
  buttonText: {
    color: cores.branco, // (do boasVindasStyle)
    fontSize: 16,
    fontWeight: 'bold',
  } as TextStyle,
  secondaryButton: {
    padding: 18,
    borderRadius: 50,
    alignItems: 'center',
    width: '100%',
  } as ViewStyle,
  secondaryButtonText: {
    color: cores.secundaria, // (do comumEstilos)
    fontSize: 16,
    fontWeight: 'bold',
  } as TextStyle,
  
  // --- Estilos de Boas Vindas ---
  pageContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',                                                                                               
    backgroundColor: cores.branco,
    paddingHorizontal: 20, 
  } as ViewStyle,
  headerImage: { // (era logoSmall no boasVindas)
    width: width,
    height: height * 0.60, 
    contentFit: 'cover',
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

  // --- Estilos de Home (Resumo) ---
  welcomeText: { fontSize: 16, color: cores.cinzaClaro } as TextStyle, 
  pacienteName: { fontSize: 24, fontWeight: 'bold', color: cores.preto, marginTop: 4 } as TextStyle,
  cuidadorText: { fontSize: 14, color: cores.cinzaClaro } as TextStyle, 
  summaryCard: { flex: 1, backgroundColor: cores.branco, padding: 15, margin: 5, borderRadius: 12, elevation: 2, alignItems: 'center' } as ViewStyle,
  summaryCardTitle: { fontSize: 13, color: '#666', marginTop: 5, textAlign: 'center' } as TextStyle,
  summaryCardCount: { fontSize: 20, fontWeight: 'bold', color: cores.primaria } as TextStyle,
  resumoItemContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: cores.branco, borderRadius: 8, marginBottom: 8, paddingHorizontal: 10, elevation: 0.5 } as ViewStyle,
  resumoItemIcon: { padding: 10, borderRadius: 50, backgroundColor: cores.primaria + '20', marginRight: 16 } as ViewStyle,
  resumoItemContent: { flex: 1 } as ViewStyle,
  resumoItemTitle: { fontSize: 15, fontWeight: 'bold', color: cores.preto } as TextStyle,
  resumoItemSubTitle: { fontSize: 13, color: cores.cinzaClaro } as TextStyle,
  resumoItemDate: { fontSize: 12, color: cores.cinzaClaro } as TextStyle,
  
  // --- Estilos de Tarefas / Remédios ---
  viewData: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // (do tarefaStyle)
    marginHorizontal: 12,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  } as ViewStyle,
  textoNormal:{
    color: cores.preto,
    fontWeight: 'bold',
    fontSize: 18,
  } as TextStyle,
  cardRemedio: {
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
  cardRemedioText:{
    flex:1,
    flexDirection: "column",
  } as ViewStyle,
  plusButton:{
    position: "absolute",
    backgroundColor: cores.primaria,
    borderRadius: 50,
    width: 64, // Unificado (era 55 e 64)
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20, 
    elevation: 8,
  } as ViewStyle,
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 5, 
    ...Platform.select({
      android: { elevation: 1 },
      ios: { shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
    }),
  } as ViewStyle,
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.preto,
  } as TextStyle,
  taskSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: cores.cinzaClaro,
  } as TextStyle,

  // --- Cards ---
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
  } as ViewStyle,
  emptyCardText: {
    fontSize: 16,
    color: cores.cinzaClaro, // Unificado
    textAlign: 'center',
    marginBottom: 16,
  } as TextStyle,
  emptyCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.primaria + '20',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  } as ViewStyle,
  emptyCardButtonText: {
    color: cores.primaria,
    fontWeight: 'bold',
    fontSize: 14,
  } as TextStyle,
};

// Exportamos como StyleSheet.create para performance e para corrigir os erros
export const styles = StyleSheet.create(estilosObjeto);