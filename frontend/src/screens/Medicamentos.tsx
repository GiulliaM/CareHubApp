import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import cores from "../config/cores";
import { API_URL } from "../config/api";
import { getToken } from "../utils/auth";
export default function Medicamentos({ navigation }: any) {
  const [meds, setMeds] = useState([]);
  useEffect(() => {
    (async () => {
      const token = await getToken();
      const res = await fetch(`${API_URL}/medicamentos`, { headers: { Authorization: `Bearer ${token}` } });
      const j = await res.json();
      setMeds(j);
    })();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList data={meds} keyExtractor={(i:any)=>i.medicamento_id?.toString()||Math.random().toString()} renderItem={({item})=>(
        <View style={styles.card}><Text style={styles.cardTitle}>{item.nome}</Text><Text>{item.dosagem||""}</Text></View>
      )} />
      <TouchableOpacity style={styles.add} onPress={()=>navigation.navigate("NovaMedicamento" as never)}><Text style={styles.addText}>+ Novo</Text></TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,padding:16,backgroundColor:cores.background},
  card:{backgroundColor:"#fff",padding:12,borderRadius:10,marginBottom:10},
  cardTitle:{fontWeight:"700"},
  add:{backgroundColor:cores.primary,padding:12,alignItems:"center",borderRadius:10}
});
