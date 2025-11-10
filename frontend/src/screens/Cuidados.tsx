import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import cores from "../config/cores";

export default function Cuidados({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Cuidados e Rotinas</Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Tarefas")}
        >
          <Text style={styles.cardTitle}>Tarefas</Text>
          <Text style={styles.cardDesc}>
            Registre e acompanhe tarefas importantes do dia a dia.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Medicamentos")}
        >
          <Text style={styles.cardTitle}>Medicamentos</Text>
          <Text style={styles.cardDesc}>
            Controle o uso e os horários dos medicamentos com facilidade.
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: cores.background,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: cores.primary,
    fontWeight: "700",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: cores.primary,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 15,
    color: "#444",
  },
});
