import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
// <<< MUDANÇA 1: Importar a função helper
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'; 
import { 
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps 
} from '@react-navigation/drawer';
import { Home, Search, User, Shield, LogOut } from 'lucide-react-native';

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
type CustomDrawerProps = DrawerContentComponentProps & {
  onLogout: () => void; 
};

function CustomDrawerContent(props: CustomDrawerProps) {
  const { onLogout, ...rest } = props;
  
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
type AppNavigatorProps = {
  onLogout: () => void; 
};

const AppNavigator: React.FC<AppNavigatorProps> = ({ onLogout }) => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} onLogout={onLogout} />}
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
      {/* <<< MUDANÇA 2: As 'options' agora são uma função */}
      <Drawer.Screen 
        name="CareHub" 
        component={TabNavigator}
        options={({ route }) => {
          // Pega o nome da rota ativa dentro do TabNavigator
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Início';
          
          return {
            // O título no MENU GAVETA (sempre "Início")
            title: 'Início', 
            drawerIcon: ({ color, size }) => <Home color={color} size={size} />,
            
            // O título no CABEÇALHO (dinâmico)
            headerTitle: routeName,
          };
        }}
      />
      
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