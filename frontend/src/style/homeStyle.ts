// Arquivo: src/style/homeStyle.ts (Corrigido)
import { StyleSheet, Dimensions, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { cores } from '../constantes/cores';
// Assumindo que você usa commonEstilosObjeto de algum lugar, mantemos a estrutura de exportação final limpa.

const { width } = Dimensions.get('window');

// 💡 ESTILOS CONSOLIDADOS (para evitar o ReferenceError)
const homeStyles = StyleSheet.create({
  // --- LAYOUTS PRINCIPAIS ---
  container: { flex: 1, backgroundColor: '#f0f4f7' },
  headerContainer: { padding: 20, backgroundColor: cores.branco },
  infoRow: { marginTop: 10 },
  summaryCardsRow: { flexDirection: 'row', paddingHorizontal: 10, marginTop: 10 },
  sectionContent: { marginHorizontal: 16 },
  sectionHeaderContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 20, marginBottom: 10 },
  
  // --- HEADER TEXTOS ---
  welcomeText: { fontSize: 16, color: cores.cinzaClaro }, 
  pacienteName: { fontSize: 24, fontWeight: 'bold', color: cores.preto, marginTop: 4 },
  cuidadorText: { fontSize: 14, color: cores.cinzaClaro }, 
  
  // --- SUMMARY CARD ---
  summaryCard: { flex: 1, backgroundColor: cores.branco, padding: 15, margin: 5, borderRadius: 12, elevation: 2, alignItems: 'center' },
  summaryCardTitle: { fontSize: 13, color: '#666', marginTop: 5, textAlign: 'center' },
  summaryCardCount: { fontSize: 20, fontWeight: 'bold', color: cores.primaria },

  // --- SECTION HEADER ---
  sectionTitle: { fontSize: 18, fontWeight: '700', color: cores.preto },
  sectionAction: { color: cores.primaria, fontWeight: 'bold' },

  // --- RESUMO ITEM (Cards de Atividades/Cuidados) ---
  resumoItemContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: cores.branco, borderRadius: 8, marginBottom: 8, paddingHorizontal: 10, elevation: 0.5 },
  resumoItemIcon: { padding: 10, borderRadius: 50, backgroundColor: cores.primaria + '20', marginRight: 16 },
  resumoItemContent: { flex: 1 },
  resumoItemTitle: { fontSize: 15, fontWeight: 'bold', color: cores.preto },
  resumoItemSubTitle: { fontSize: 13, color: cores.cinzaClaro },
  resumoItemDate: { fontSize: 12, color: cores.cinzaClaro },
  
  // --- EMPTY STATE ---
  emptyCard: { backgroundColor: cores.branco, margin: 20, padding: 30, borderRadius: 10, alignItems: 'center' },
  emptyText: { color: cores.cinzaClaro, fontSize: 16 },

  // Adicionando estilos existentes (para evitar perda de referências no app)
  cardRemedio: { flex:1, flexDirection: "row", gap: 15, padding: 20, alignItems: "center", borderRadius: 10, borderWidth: 2, borderColor: cores.secundaria, margin: 15, backgroundColor: cores.fundo },
  
  // ... (Outros estilos antigos se necessários)
});

// 💡 EXPORTAÇÃO SIMPLIFICADA
export const styles = homeStyles;