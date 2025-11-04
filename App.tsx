import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Nossas duas "seções" do app
import AppNavigator from './frontend/src/navigation/AppNavigator'; // O NOVO Navegador com Menu
import OnboardingFlow from './frontend/src/telas/BoasVindas'; // A tela de Login/Cadastro

export default function App() {
  // [isAuthenticated] é o "cérebro" que decide qual tela mostrar
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Esta função será chamada pela tela de BoasVindas (onComplete)
  // quando o login/cadastro for bem-sucedido.
  const handleLogin = () => {
    // PENSANDO NO BACK-END:
    // Aqui é onde você salvaria o Token de login no AsyncStorage
    setIsAuthenticated(true);
  };
  
  // Esta função será passada para o AppNavigator
  // e chamada pelo botão "Sair" do menu.
  const handleLogout = () => {
    // PENSANDO NO BACK-END:
    // Aqui você limparia o Token do AsyncStorage
    setIsAuthenticated(false);
  };

  return (
    // GestureHandlerRootView é OBRIGATÓRIO para o menu "Drawer" funcionar
    <GestureHandlerRootView style={styles.container}>
      {/* SafeAreaProvider garante que o app respeite as bordas */}
      <SafeAreaProvider>
        {/* NavigationContainer é o "pai" de toda a navegação */}
        <NavigationContainer>
          {isAuthenticated ? (
            // Se estiver LOGADO: mostre o AppNavigator (com o menu)
            // e passe a função de logout para ele
            <AppNavigator onLogout={handleLogout} />
          ) : (
            // Se NÃO estiver logado: mostre o BoasVindas (Login/Cadastro)
            // e passe a função de login para ele
            <OnboardingFlow onComplete={handleLogin} />
          )}
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// Estilo mínimo para o container raiz
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});