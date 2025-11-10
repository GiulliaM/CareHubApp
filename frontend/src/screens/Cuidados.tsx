import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import cores from "../config/cores";
import { useNavigation } from "@react-navigation/native";
export default function Cuidados() {
  const nav = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={()=>nav.navigate("Tarefas" as never)}><Text style={styles.cardTitle}>Tarefas</Text></TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={()=>nav.navigate("Medicamentos" as never)}><Text style={styles.cardTitle}>Medicamentos</Text></TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={()=>nav.navigate("NovaTarefa" as never)}><Text style={styles.cardTitle}>+ Nova Tarefa</Text></TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={()=>nav.navigate("NovaMedicamento" as never)}><Text style={styles.cardTitle}>+ Novo Medicamento</Text></TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,padding:16,backgroundColor:cores.background},
  card:{backgroundColor:"#fff",padding:16,borderRadius:12,marginBottom:12},
  cardTitle:{fontWeight:"700",color:cores.primary,fontSize:16}
});
