import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import cores from "../config/cores";
import { API_URL } from "../config/api";
import { getToken } from "../utils/auth";
export default function Home() {
  const [tarefas, setTarefas] = useState([]);
  const [meds, setMeds] = useState([]);
  useEffect(() => {
    (async () => {
      const token = await getToken();
      try {
        const resT = await fetch(`${API_URL}/tarefas`, { headers: { Authorization: `Bearer ${token}` } });
        const t = await resT.json();
        setTarefas(t);
        const resM = await fetch(`${API_URL}/medicamentos`, { headers: { Authorization: `Bearer ${token}` } });
        const m = await resM.json();
        setMeds(m);
      } catch (err) {}
    })();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo do Dia</Text>
      <Text style={styles.section}>Próximas Tarefas</Text>
      <FlatList data={tarefas} keyExtractor={(i:any)=>i.tarefa_id?.toString()||Math.random().toString()} renderItem={({item})=>(
        <View style={styles.card}><Text style={styles.cardTitle}>{item.titulo}</Text><Text>{item.data||""} {item.hora||""}</Text></View>
      )} />
      <Text style={styles.section}>Medicamentos</Text>
      <FlatList data={meds} keyExtractor={(i:any)=>i.medicamento_id?.toString()||Math.random().toString()} renderItem={({item})=>(
        <View style={styles.card}><Text style={styles.cardTitle}>{item.nome}</Text><Text>{item.horarios||""}</Text></View>
      )} />
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,padding:16,backgroundColor:cores.background},
  title:{fontSize:22,fontWeight:"700",color:cores.primary,marginBottom:12},
  section:{fontWeight:"700",marginTop:12,marginBottom:6},
  card:{backgroundColor:"#fff",padding:12,borderRadius:10,marginBottom:8},
  cardTitle:{fontWeight:"700"}
});
