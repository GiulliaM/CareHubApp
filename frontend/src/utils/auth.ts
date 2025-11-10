import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveToken(token: string) {
  try {
    await AsyncStorage.setItem("token", token);
  } catch (e) {
    console.error("Erro ao salvar token:", e);
  }
}

export async function getToken(): Promise<string | null> {
  try {
    const token = await AsyncStorage.getItem("token");
    return token;
  } catch (e) {
    console.error("Erro ao obter token:", e);
    return null;
  }
}

export async function logout() {
  try {
    await AsyncStorage.removeItem("token");
  } catch (e) {
    console.error("Erro ao remover token:", e);
  }
}
