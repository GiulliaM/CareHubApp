import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, Alert } from "react-native";
import cores from "../config/cores";
import { API_URL } from "../config/api";
import { getToken } from "../utils/auth";
export default function NovaTarefa({ navigation }: any) {
  const [titulo, setTitulo] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const criar = async () => {
    if (!titulo) return Alert.alert("Informe o título");
    const token = await getToken();
    const res = await fetch(`${API_URL}/tarefas`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ titulo, detalhes })
    });
    if (!res.ok) return Alert.alert("Erro");
    Alert.alert("Criado");
    navigation.goBack();
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput value={titulo} onChangeText={setTitulo} style={styles.input} />
      <Text style={styles.label}>Detalhes</Text>
      <TextInput value={detalhes} onChangeText={setDetalhes} style={[styles.input,{height:100}]} multiline />
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
