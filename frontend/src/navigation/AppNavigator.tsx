import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { 
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps 
} from '@react-navigation/drawer';
import { Home, Search, User, Shield, LogOut } from 'lucide-react-native';
// <<< MUDANÇA: Importar a função helper de rota
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'; 

import TabNavigator from './TabNavigator'; 
import { cores } from '../constantes/cores';

// ----- Telas "Placeholder" -----
const PlaceholderScreen = ({ route }: any) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{route.name}</Text>
  </View>
);
const BuscarCuidadoresTela = () => <PlaceholderScreen route={{ name: 'Buscar Cuidadores' }} />;
const MeuPerfilTela = () => <PlaceholderScreen route={{ name: 'Meu Perfil' }} />;
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
  
  // (No futuro, podemos usar o 'isGuest' aqui para filtrar os 'rest.state.routes'
  //  e esconder os links "Meu Perfil", etc., se for um visitante)
  
  return (
    <DrawerContentScrollView {...rest}>
      <View style={{ flex: 1 }}>
        <DrawerItemList {...rest} />
      </View>
      
      <View style={{ borderTopWidth: 1, borderTopColor: '#eee' }}>
        <DrawerItem
          label="Sair"
          icon={({ color, size }) => <LogOut color={cores.secundaria} size={size} />}
          labelStyle={{ color: cores.secundaria, fontWeight: 'bold' }}
          onPress={onLogout}
        />
      </View>
    </DrawerContentScrollView>
  );
}

// --- O Navegador Principal ---
// <<< MUDANÇA: Adicionado 'isGuest'
type AppNavigatorProps = {
  onLogout: () => void; 
  isGuest: boolean;
};

// <<< MUDANÇA: Recebendo 'isGuest'
const AppNavigator: React.FC<AppNavigatorProps> = ({ onLogout, isGuest }) => {
  return (
    <Drawer.Navigator
      // <<< MUDANÇA: Passando 'isGuest' para o conteúdo do menu
      drawerContent={(props) => <CustomDrawerContent {...props} onLogout={onLogout} isGuest={isGuest} />}
      
      screenOptions={{
        drawerActiveTintColor: cores.primaria,
        drawerInactiveTintColor: cores.preto,
        drawerLabelStyle: {
          marginLeft: -20, 
          fontSize: 16,
        },
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
      <Drawer.Screen 
        name="MeuPerfil" 
        component={MeuPerfilTela}
        options={{
          title: 'Meu Perfil',
          drawerIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
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