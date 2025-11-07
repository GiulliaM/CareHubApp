import React from 'react';
import { View, Text } from 'react-native';
import { 
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps 
} from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'; 
import { Home, Search, User, Shield, LogOut } from 'lucide-react-native';

import TabNavigator from './TabNavigator'; 
import { cores } from '../constantes/cores';
// <<< MUDANÇA: Importar a tela REAL
import MeuPerfilTela from '../telas/MeuPerfilTela'; 

// ----- Telas "Placeholder" -----
const PlaceholderScreen = ({ route }: any) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{route.name}</Text>
  </View>
);
const BuscarCuidadoresTela = () => <PlaceholderScreen route={{ name: 'Buscar Cuidadores' }} />;
// (MeuPerfilTela não é mais um placeholder)
const PerfilPessoaCuidadaTela = () => <PlaceholderScreen route={{ name: 'Perfil Pessoa Cuidada' }} />;
// ---------------------------------

const Drawer = createDrawerNavigator();

// --- O Conteúdo Customizado do Menu ---
// <<< MUDANÇA: Adicionado 'isGuest'
type CustomDrawerProps = DrawerContentComponentProps & {
  onLogout: () => void; 
  isGuest: boolean;
};

function CustomDrawerContent(props: CustomDrawerProps) {
  // <<< MUDANÇA: 'isGuest' foi extraído
  const { onLogout, isGuest, ...rest } = props;
  
  return (
    <DrawerContentScrollView {...rest}>
      <View style={{ flex: 1 }}>
        <DrawerItemList {...rest} />
      </View>
      
      <View style={{ borderTopWidth: 1, borderTopColor: '#eee' }}>
        {/* <<< MUDANÇA: O botão agora muda se for visitante */}
        <DrawerItem
          label={isGuest ? "Fazer Login" : "Sair"}
          icon={({ color, size }) => <LogOut color={cores.secundaria} size={size} />}
          labelStyle={{ color: cores.secundaria, fontWeight: 'bold' }}
          onPress={onLogout} // (onLogout reseta o app, levando para o login)
        />
      </View>
    </DrawerContentScrollView>
  );
}

// --- O Navegador Principal ---
// <<< MUDANÇA: Aceita 'isGuest'
type AppNavigatorProps = {
  onLogout: () => void; 
  isGuest: boolean;
};

const AppNavigator: React.FC<AppNavigatorProps> = ({ onLogout, isGuest }) => {
  return (
    <Drawer.Navigator
      // <<< MUDANÇA: Passando 'isGuest' para o conteúdo do menu
      drawerContent={(props) => <CustomDrawerContent {...props} onLogout={onLogout} isGuest={isGuest} />}
      
      screenOptions={{
        drawerActiveTintColor: cores.primaria,
        drawerInactiveTintColor: cores.preto,
        drawerLabelStyle: { marginLeft: -20, fontSize: 16 },
        headerShown: true, 
      }}
    >
      {/* Tela Principal (Abas) */}
      <Drawer.Screen 
        name="CareHub" 
        component={TabNavigator}
        options={({ route }) => ({
          title: 'Início', 
          drawerIcon: ({ color, size }) => <Home color={color} size={size} />,
          // Pega o nome da aba ativa (Início, Tarefas, etc.)
          headerTitle: getFocusedRouteNameFromRoute(route) ?? 'Início',
        })}
      />
      
      {/* Telas do Menu Gaveta */}
      <Drawer.Screen 
        name="BuscarCuidadores" 
        component={BuscarCuidadoresTela}
        options={{
          title: 'Buscar Cuidadores',
          drawerIcon: ({ color, size }) => <Search color={color} size={size} />,
        }}
      />
      
      {/* <<< MUDANÇA: Passando 'isGuest' e 'onLogout' para a tela 'MeuPerfil' */}
      <Drawer.Screen 
        name="MeuPerfil" 
        options={{
          title: 'Meu Perfil',
          drawerIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      >
        {/* Usamos a sintaxe de "render callback" para passar as props */}
        {(props) => <MeuPerfilTela {...props} isGuest={isGuest} onLogout={onLogout} />}
      </Drawer.Screen>

      <Drawer.Screen 
        name="PerfilPessoaCuidada" 
        component={PerfilPessoaCuidadaTela}
        options={{
          title: 'Perfil Pessoa Cuidada',
          drawerIcon: ({ color, size }) => <Shield color={color} size={size} />,
        }}
      />
    </Drawer.Navigator>
  );
};

export default AppNavigator;