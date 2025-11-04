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

// Importa o menu de 5 abas (o próximo arquivo)
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
    // ESTE ARQUIVO NÃO TEM <NavigationContainer>
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
      <Drawer.Screen 
        name="CareHub" 
        component={TabNavigator}
        options={{
          title: 'Início', 
          drawerIcon: ({ color, size }) => <Home color={color} size={size} />,
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