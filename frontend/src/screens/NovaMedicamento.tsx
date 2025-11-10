import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, Alert } from "react-native";
import cores from "../config/cores";
import { API_URL } from "../config/api";
import { getToken } from "../utils/auth";
export default function NovaMedicamento({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [dosagem, setDosagem] = useState("");
  const criar = async () => {
    if (!nome) return Alert.alert("Informe o nome");
    const token = await getToken();
    const res = await fetch(`${API_URL}/medicamentos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nome, dosagem })
    });
    if (!res.ok) return Alert.alert("Erro");
    Alert.alert("Criado");
    navigation.goBack();
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput value={nome} onChangeText={setNome} style={styles.input} />
      <Text style={styles.label}>Dosagem</Text>
      <TextInput value={dosagem} onChangeText={setDosagem} style={styles.input} />
      <TouchableOpacity style={styles.btn} onPress={criar}><Text style={styles.btnText}>Salvar</Text></TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container:{padding:16,backgroundColor:cores.background,flexGrow:1},
  label:{fontWeight:"700",color:cores.primary,marginTop:8},
  input:{backgroundColor:"#fff",padding:10,borderRadius:10,marginTop:8},
  btn:{backgroundColor:cores.primary,padding:14,alignItems:"center",borderRadius:12,marginTop:12},
  btnText:{color:"#fff",fontWeight:"700"}
});
