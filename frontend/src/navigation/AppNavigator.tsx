/**styles
 * AppNavigator.tsx
 *
 * Gerencia a navegação principal (barra de abas) e renderiza a tela ativa.
 */
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Home, NotepadText, Pill, Newspaper, Album } from 'lucide-react-native';
import { SafeAreaView} from 'react-native-safe-area-context';

// 1. IMPORTAÇÃO DE TODAS AS PEÇAS
// Importamos nossas cores, ícones e, o mais importante, todas as telas que criamos.
import { cores } from '../constantes/cores';
import HomeTela from '../telas/HomeTela';
import TarefasTela from '../telas/TarefasTela';
import RemediosTela from '../telas/RemediosTela';


type ScreenName = 'Início' | 'Tarefas' | 'Remedios' | 'Artigos' | 'Diario';

const AppNavigator: React.FC = () => {
  // 2. A MEMÓRIA DO COMPONENTE (useState)
  // 'activeScreen' guarda o nome da tela que está ativa no momento.
  // 'setActiveScreen' é a única função que pode mudar esse valor.
  // O valor inicial é 'Início'.
  const [activeScreen, setActiveScreen] = useState<ScreenName>('Início');

  // 3. O SELECIONADOR DE TELAS (Renderização Condicional)
  // Esta função age como um porteiro: ela verifica o valor de 'activeScreen'
  // e retorna o componente de tela correspondente.
  const renderScreen = () => {
    switch (activeScreen) {
      case 'Início':
        return <HomeTela />;
      case 'Tarefas':
        return <TarefasTela />;
      case 'Remedios':
        return <RemediosTela />;
      default:
        return <HomeTela />; // Tela padrão caso algo dê errado.
    }
  };

  // 4. A ESTRUTURA VISUAL (O que é desenhado na tela)
  return (
    // SafeAreaView garante que o conteúdo não fique embaixo de notches ou barras do sistema.
    <SafeAreaView style={styles.containerPrincipal}>
      {/* A área principal que ocupa a maior parte da tela e exibe a tela ativa. */}
      <View style={styles.conteudoDaTela}>
        {renderScreen()}
      </View>

      {/* A barra de navegação que fica na parte inferior. */}
      <View style={styles.barraNavegacao}>
        {/* Cada TouchableOpacity é um botão. */}
        {/* O 'onPress' chama a função 'setActiveScreen' para mudar a memória e, consequentemente, a tela. */}
        {/* A cor do ícone muda se a tela dele estiver ativa. */}
        <TouchableOpacity style={styles.botaoNav} onPress={() => setActiveScreen('Início')}>
          <Home color={activeScreen === 'Início' ? cores.primaria : cores.preto} />
          <Text style={[styles.textoBotaoNav, { color: activeScreen === 'Início' ? cores.primaria : cores.preto }]}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoNav} onPress={() => setActiveScreen('Tarefas')}>
          <NotepadText color={activeScreen === 'Tarefas' ? cores.primaria : cores.preto} />
          <Text style={[styles.textoBotaoNav, { color: activeScreen === 'Tarefas' ? cores.primaria : cores.preto }]}>Tarefas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoNav} onPress={() => setActiveScreen('Remedios')}>
          <Pill color={activeScreen === 'Remedios' ? cores.primaria : cores.preto} />
          <Text style={[styles.textoBotaoNav, { color: activeScreen === 'Remedios' ? cores.primaria : cores.preto }]}>Remedios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoNav} onPress={() => setActiveScreen('Artigos')}>
          <Newspaper color={activeScreen === 'Artigos' ? cores.primaria : cores.preto} />
          <Text style={[styles.textoBotaoNav, { color: activeScreen === 'Artigos' ? cores.primaria : cores.preto }]}>Artigos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoNav} onPress={() => setActiveScreen('Diario')}>
          <Album color={activeScreen === 'Diario' ? cores.primaria : cores.preto} />
          <Text style={[styles.textoBotaoNav, { color: activeScreen === 'Diario' ? cores.primaria : cores.preto }]}>Diario</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// 5. OS ESTILOS
const styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudoDaTela: {
    flex: 1,
  },
  barraNavegacao: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: cores.branco,
    justifyContent: 'space-around',
    borderTopWidth: 0,
    borderTopColor: cores.secundaria,
    marginBottom: 0
  },
  botaoNav: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotaoNav: {
    fontSize: 12,
    marginTop: 4,
  }
});

export default AppNavigator;
