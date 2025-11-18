import React, { useEffect, useState } from "react";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import { View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Welcome from "../screens/Welcome";
import Login from "../screens/Login";
import Cadastro from "../screens/Cadastro";
import Tabs from "./Tabs";
import RegisterPatient from "../screens/RegisterPatient";
import NovaTarefa from "../screens/NovaTarefa";
import NovaMedicamento from "../screens/NovaMedicamento";
import NovoRegistro from "../screens/NovoRegistro";
import EditUser from "../screens/EditUser";
import EditPatient from "../screens/EditPatient";
import EditMedicamento from "../screens/EditMedicamento";
import ViewMedicamento from "../screens/ViewMedicamento";
import EditTarefa from "../screens/EditTarefa";
import { getToken } from "../utils/auth";

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

export default function RootNavigator() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) {
        setTimeout(() => {
          if ((navigationRef as any).resetRoot) {
            try {
              (navigationRef as any).resetRoot({ index: 0, routes: [{ name: "Tabs" }] });
            } catch (e) {
              (navigationRef as any).navigate?.("Tabs");
            }
          } else {
            (navigationRef as any).navigate?.("Tabs");
          }
        }, 100);
      }
      setChecking(false);
    })();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterPatient" component={RegisterPatient} options={{ headerShown: false }} />
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="NovaTarefa" component={NovaTarefa} options={{ headerShown: false }} />
        <Stack.Screen name="NovoRegistro" component={NovoRegistro} options={{ headerShown: false }} />
        <Stack.Screen name="NovaMedicamento" component={NovaMedicamento} options={{ headerShown: false }} />
        <Stack.Screen name="EditUser" component={EditUser} options={{ headerShown: false }} />
        <Stack.Screen name="EditPatient" component={EditPatient} options={{ headerShown: false }} />
        <Stack.Screen name="EditMedicamento" component={EditMedicamento} options={{ headerShown: false }} />
        <Stack.Screen name="ViewMedicamento" component={ViewMedicamento} options={{ headerShown: false }} />
        <Stack.Screen name="EditTarefa" component={EditTarefa} options={{ headerShown: false }} />
      </Stack.Navigator>

      {checking && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
          pointerEvents="none"
        >
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}
    </NavigationContainer>
  );
}
