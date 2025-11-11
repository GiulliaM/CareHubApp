import React, { useEffect } from "react";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "../screens/Welcome";
import Login from "../screens/Login";
import Cadastro from "../screens/Cadastro";
import Tabs from "./Tabs";
import NovaTarefa from "../screens/NovaTarefa";
import NovaMedicamento from "../screens/NovaMedicamento";
import NovoRegistro from "../screens/NovoRegistro";
import { getToken } from "../utils/auth";

const Stack = createNativeStackNavigator();

const navigationRef = createNavigationContainerRef();

export default function RootNavigator() {
  // Always show Welcome first. If a token exists we will navigate to Tabs programmatically
  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token && navigationRef.isReady()) {
        // navigationRef.navigate has strict typing; use current?.navigate to avoid TS overload issues
        (navigationRef as any).current?.navigate?.("Tabs");
      }
    })();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={"Welcome"}>
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NovaTarefa"
          component={NovaTarefa}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NovaMedicamento"
          component={NovaMedicamento}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NovoRegistro"
          component={NovoRegistro}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
