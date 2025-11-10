import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import cores from "../config/cores";
import { API_URL } from "../config/api";
import { getToken, removeToken } from "../utils/auth";
export default function Perfil({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const token = await getToken();
      try {
        const res = await fetch(`${API_URL}/usuarios/perfil/0`, { headers: { Authorization: `Bearer ${token}` } });
        const j = await res.json();
        setUser(j);
      } catch (err) {}
    })();
  }, []);
  const sair = async () => {
    await removeToken();
    navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user?.nome || "Usuário"}</Text>
      <Text style={styles.email}>{user?.email || ""}</Text>
      <TouchableOpacity style={styles.btn} onPress={sair}><Text style={styles.btnText}>Sair</Text></TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,justifyContent:"center",alignItems:"center",padding:24,backgroundColor:cores.background},
  name:{fontSize:20,fontWeight:"700",color:cores.primary},
  email:{color:cores.muted,marginTop:8},
  btn:{backgroundColor:cores.primary,padding:12,borderRadius:10,marginTop:16},
  btnText:{color:"#fff",fontWeight:"700"}
});
