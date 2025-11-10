import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import cores from "../config/cores";
export default function Welcome({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CareHub — Cuidando de quem você ama</Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.btnText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, styles.outline]} onPress={() => navigation.navigate("Register")}>
        <Text style={styles.btnTextOutline}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: cores.background },
  title: { fontSize: 24, fontWeight: "700", color: cores.primary, marginBottom: 24, textAlign: "center" },
  btn: { backgroundColor: cores.primary, padding: 14, borderRadius: 12, width: "80%", alignItems: "center", marginVertical: 8 },
  btnText: { color: "#fff", fontWeight: "700" },
  outline: { backgroundColor: "#fff", borderWidth: 1, borderColor: cores.primary },
  btnTextOutline: { color: cores.primary, fontWeight: "700" }
});
