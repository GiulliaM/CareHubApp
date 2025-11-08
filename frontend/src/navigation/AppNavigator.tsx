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
import MeuPerfilTela from '../telas/MeuPerfilTela'; 
// <<< MUDANÇA: Importar a nova tela REAL
import PerfilPessoaCuidadaTela from '../telas/PerfilPessoaCuidadaTela';

// ----- Telas "Placeholder" -----
const PlaceholderScreen = ({ route }: any) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{route.name}</Text>
  </View>
);
const BuscarCuidadoresTela = () => <PlaceholderScreen route={{ name: 'Buscar Cuidadores' }} />;
// ---------------------------------

const Drawer = createDrawerNavigator();

// --- O Conteúdo Customizado do Menu ---
type CustomDrawerProps = DrawerContentComponentProps & {
  onLogout: () => void; 
  isGuest: boolean;
};

function CustomDrawerContent(props: CustomDrawerProps) {
  const { onLogout, isGuest, ...rest } = props;
  
  return (
    <DrawerContentScrollView {...rest}>
      <View style={{ flex: 1 }}>
        <DrawerItemList {...rest} />
      </View>
      
      <View style={{ borderTopWidth: 1, borderTopColor: '#eee' }}>
        <DrawerItem
          label={isGuest ? "Fazer Login" : "Sair"}
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
  isGuest: boolean;
};

const AppNavigator: React.FC<AppNavigatorProps> = ({ onLogout, isGuest }) => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} onLogout={onLogout} isGuest={isGuest} />}
      
      screenOptions={{
        drawerActiveTintColor: cores.primaria,
        drawerInactiveTintColor: cores.preto,
        drawerLabelStyle: { marginLeft: -20, fontSize: 16 },
        headerShown: true, 
      }}
    >
      <Drawer.Screen 
        name="CareHub" 
        component={TabNavigator}
        options={({ route }) => ({
          title: 'Início', 
          drawerIcon: ({ color, size }) => <Home color={color} size={size} />,
          headerTitle: getFocusedRouteNameFromRoute(route) ?? 'Início',
        })}
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
        options={{
          title: 'Meu Perfil',
          drawerIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      >
        {(props) => <MeuPerfilTela {...props} isGuest={isGuest} onLogout={onLogout} />}
      </Drawer.Screen>

      {/* <<< MUDANÇA: Conectando a tela real */}
      <Drawer.Screen 
        name="PerfilPessoaCuidada" 
        options={{
          title: 'Perfil Pessoa Cuidada',
          drawerIcon: ({ color, size }) => <Shield color={color} size={size} />,
        }}
      >
         {(props) => <PerfilPessoaCuidadaTela {...props} isGuest={isGuest} onLogout={onLogout} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default AppNavigator;