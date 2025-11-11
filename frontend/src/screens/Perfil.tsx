import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import cores from "../config/cores";
import { logout, getUserMeta } from "../utils/auth";

export default function Perfil({ navigation }: any) {
  const [user, setUser] = useState<{ usuario_id?: number; nome?: string } | null>(null);

  useEffect(() => {
    (async () => {
      const u = await getUserMeta();
      setUser(u);
    })();
  }, []);

  async function handleLogout() {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Meu Perfil</Text>

        <View style={styles.card}>
          <Text style={styles.text}>Nome: {user?.nome || "-"}</Text>
          <Text style={styles.text}>Tipo: {/* could fetch/full user later */}-</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.background },
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 24,
    color: cores.primary,
    fontWeight: "700",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
  },
  text: { color: "#333", fontSize: 16, marginBottom: 4 },
  button: {
    backgroundColor: cores.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
