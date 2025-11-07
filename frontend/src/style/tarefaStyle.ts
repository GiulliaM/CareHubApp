import { Platform } from 'react-native';
import { cores } from '../constantes/cores';

const tarefaStyle = {
  screenContainer: {
    flex: 1,
    backgroundColor: cores.branco,
  },

  /* Cabeçalho / logo (opcional se usar no futuro) */
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: cores.branco,
  },
  headerImage: {
    width: 140,
    height: 44,
    resizeMode: 'contain',
  },

  /* Card com data e navegação anterior/próximo */
  viewData: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    ...Platform.select({
      android: { elevation: 2 },
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
    }),
  },
  textoNormal: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.preto,
  },
  dateText: {
    fontSize: 15,
    color: cores.cinzaClaro,
  },

  /* Section header */
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: cores.preto,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: cores.cinzaClaro,
  },

  /* Botão flutuante para adicionar tarefa */
  plusButton: {
    position: 'absolute',
    right: 18,
    bottom: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      android: { elevation: 6 },
      ios: { shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
    }),
  },

  /* Estado vazio */
  emptyCard: {
    marginTop: 28,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      android: { elevation: 1 },
      ios: { shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
    }),
  },
  emptyCardText: {
    color: cores.cinzaClaro,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 20,
  },
  emptyCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  emptyCardButtonText: {
    color: cores.primaria,
    fontWeight: '600',
  },

  /* Form / Add Task */
  formSubtitle: {
    fontSize: 14,
    color: cores.cinzaClaro,
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  flexSpacer: {
    flex: 1,
  },
  primaryButton: {
    marginTop: 18,
    backgroundColor: cores.primaria,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: cores.branco,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.cinzaClaro ?? '#eee',
  },
  secondaryButtonText: {
    color: cores.preto,
    fontWeight: '600',
  },

  /* Cartão de tarefa */
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 10,
    ...Platform.select({
      android: { elevation: 1 },
      ios: { shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
    }),
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.preto,
  },
  taskSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: cores.cinzaClaro,
  },

  /* Botões de ação na tarefa (concluir / deletar) */
  iconButton: {
    marginLeft: 8,
    backgroundColor: '#f3f3f3',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    fontSize: 14,
    color: cores.preto,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* Pequenos utilitários */
  loadingCenter: {
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default tarefaStyle;