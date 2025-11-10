import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "../screens/Welcome";
import Login from "../screens/Login";
import Register from "../screens/Register";
import RegisterPatient from "../screens/RegisterPatient";
import Tabs from "./Tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api";
const Stack = createNativeStackNavigator();
export default function RootNavigator() {
  const [initial, setInitial] = useState(null);
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setInitial("Welcome");
        return;
      }
      try {
        const res = await fetch(`${API_URL}/usuarios/perfil/0`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {}
      setInitial("Tabs");
    })();
  }, []);
  if (initial === null) return null;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="RegisterPatient" component={RegisterPatient} />
      <Stack.Screen name="Tabs" component={Tabs} />
    </Stack.Navigator>
  );
}
