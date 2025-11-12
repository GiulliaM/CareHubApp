import { LogBox } from "react-native";
LogBox.ignoreLogs(["Require cycle:"]);

import React from "react";
import RootNavigator from "./frontend/src/navigation/RootNavigator";
import { ThemeProvider } from "./frontend/src/context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}