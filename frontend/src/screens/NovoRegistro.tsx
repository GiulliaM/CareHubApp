import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, Alert } from "react-native";
import cores from "../config/cores";
import { API_URL } from "../config/api";
import { getToken } from "../utils/auth";
export default function NovoRegistro({ navigation }: any) {
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [atividades, setAtividades] = useState("");
  const criar = async () => {
    if (!atividades) return Alert.alert("Descreva a atividade");
    const token = await getToken();
    const res = await fetch(`${API_URL}/diario`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ data, hora, atividades })
    });
    if (!res.ok) return Alert.alert("Erro");
    Alert.alert("Criado");
    navigation.goBack();
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Data</Text>
      <TextInput value={data} onChangeText={setData} style={styles.input} placeholder="YYYY-MM-DD" />
      <Text style={styles.label}>Hora</Text>
      <TextInput value={hora} onChangeText={setHora} style={styles.input} placeholder="HH:MM:SS" />
      <Text style={styles.label}>Atividades</Text>
      <TextInput value={atividades} onChangeText={setAtividades} style={[styles.input,{height:120}]} multiline />
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
