import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import cores from "../config/cores";
import { API_URL } from "../config/api";
import { getToken } from "../utils/auth";
export default function Tarefas({ navigation }: any) {
  const [tarefas, setTarefas] = useState([]);
  useEffect(() => {
    (async () => {
      const token = await getToken();
      const res = await fetch(`${API_URL}/tarefas`, { headers: { Authorization: `Bearer ${token}` } });
      const j = await res.json();
      setTarefas(j);
    })();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList data={tarefas} keyExtractor={(i:any)=>i.tarefa_id?.toString()||Math.random().toString()} renderItem={({item})=>(
        <View style={styles.card}><Text style={styles.cardTitle}>{item.titulo}</Text><Text>{item.detalhes||""}</Text></View>
      )} />
      <TouchableOpacity style={styles.add} onPress={()=>navigation.navigate("NovaTarefa" as never)}><Text style={styles.addText}>+ Nova</Text></TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,padding:16,backgroundColor:cores.background},
  card:{backgroundColor:"#fff",padding:12,borderRadius:10,marginBottom:10},
  cardTitle:{fontWeight:"700"},
  add:{backgroundColor:cores.primary,padding:12,alignItems:"center",borderRadius:10}
});
