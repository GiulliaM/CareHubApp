import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Cuidados from "../screens/Cuidados";
import Diario from "../screens/Diario";
import Perfil from "../screens/Perfil";
const Tab = createBottomTabNavigator();
export default function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Cuidados" component={Cuidados} />
      <Tab.Screen name="Diário" component={Diario} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}
