import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import cores from "../config/cores";
import { API_URL } from "../config/api";
import { getToken } from "../utils/auth";
export default function Diario({ navigation }: any) {
  const [regs, setRegs] = useState([]);
  useEffect(() => {
    (async () => {
      const token = await getToken();
      const res = await fetch(`${API_URL}/diario`, { headers: { Authorization: `Bearer ${token}` } });
      const j = await res.json();
      setRegs(j);
    })();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList data={regs} keyExtractor={(i:any)=>i.registro_id?.toString()||Math.random().toString()} renderItem={({item})=>(
        <View style={styles.card}><Text style={styles.cardTitle}>{item.data} {item.hora}</Text><Text>{item.atividades||""}</Text></View>
      )} />
      <TouchableOpacity style={styles.add} onPress={()=>navigation.navigate("NovoRegistro" as never)}><Text style={styles.addText}>+ Novo</Text></TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,padding:16,backgroundColor:cores.background},
  card:{backgroundColor:"#fff",padding:12,borderRadius:10,marginBottom:10},
  cardTitle:{fontWeight:"700"},
  add:{backgroundColor:cores.primary,padding:12,alignItems:"center",borderRadius:10}
});

