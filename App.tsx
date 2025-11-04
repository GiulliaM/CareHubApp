
import React, {useState} from 'react'; // importamos o React pois estamos usando a sintaxe para typescypt xml, ai la tem tudo certinho pro programa entender
import AppNavigator from './frontend/src/navigation/AppNavigator'
//nosso navegador entre as telas do nosso aplicativo 
//ele e como um seletor da tela q vai ficar ativa

import OnboardingFlow from './frontend/src/telas/BoasVindas';
import {styles} from './frontend/src/style/boasVindasStyle'
import {StyleSheet} from 'react-native';
import {
  SafeAreaView,
  SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';



export default function App() {//nossa funcao principal (como o index do react)

  // 1. Criamos um "estado" para saber se o usuário está autenticado.
  //    Por padrão, ele não está (false).
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 2. Esta função será chamada pela tela de Onboarding quando o
  //    cadastro for concluído com sucesso.
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // 3. Esta é a lógica principal:
  //    - Se 'isAuthenticated' for true, mostre o AppNavigator (a home).
  //    - Se for false, mostre o OnboardingFlow (a tela de cadastro).


  



  //app so pode retornar um componente a ser exibido (e oq vai mostrar na tela)
  //nesse caso ele vai retornar (apontar) para o nosso navegador que ficara trocando entre as telas
  return (
    <SafeAreaView style={styles.pageContainer}>
      {isAuthenticated ? (
        <AppNavigator />
      ) : (
        <OnboardingFlow onComplete={handleLoginSuccess} />
      )}
    </SafeAreaView>//aqui estamos cumprindo a regra retornando um so componente
  );
}

