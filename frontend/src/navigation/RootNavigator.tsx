import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
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

export default function RootNavigator() {
  const [initialRoute, setInitialRoute] = useState<"Welcome" | "Tabs" | null>(null);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) {
        setInitialRoute("Tabs");
      } else {
        setInitialRoute("Welcome");
      }
    })();
  }, []);

  // show a simple loading indicator while we determine initial route
  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
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
