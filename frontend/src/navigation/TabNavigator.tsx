import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, NotepadText, Pill, Newspaper, Album } from 'lucide-react-native';

import HomeTela from '../telas/HomeTela';
import TarefasTela from '../telas/TarefasTela';
import RemediosTela from '../telas/RemediosTela';
import ConteudoTela from '../telas/ConteudoTela';
import DiarioTela from '../telas/DiarioTela';
import { cores } from '../constantes/cores';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, 
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.preto,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
        },
        tabBarIcon: ({ color, size }) => {
          size = 28;
          if (route.name === 'Início') {
            return <Home color={color} size={size} />;
          } else if (route.name === 'Tarefas') {
            return <NotepadText color={color} size={size} />;
          } else if (route.name === 'Remedios') {
            return <Pill color={color} size={size} />;
          } else if (route.name === 'Artigos') {
            return <Newspaper color={color} size={size} />;
          } else if (route.name === 'Diario') {
            return <Album color={color} size={size} />;
          }
          return null;
        },
      })}
    >
      <Tab.Screen name="Início" component={HomeTela} />
      <Tab.Screen name="Tarefas" component={TarefasTela} />
      <Tab.Screen name="Remedios" component={RemediosTela} />
      <Tab.Screen name="Artigos" component={ConteudoTela} />
      <Tab.Screen name="Diario" component={DiarioTela} />
    </Tab.Navigator>
  );
};

export default TabNavigator;