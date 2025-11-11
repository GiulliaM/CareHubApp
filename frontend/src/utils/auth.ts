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

// Save a small user object (id, nome) alongside the token for quick access in UI
export async function saveUserMeta(user: { usuario_id?: number; nome?: string; tipo?: string }) {
  try {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  } catch (e) {
    console.error("Erro ao salvar dados do usuário:", e);
  }
}

export async function getUserMeta(): Promise<{ usuario_id?: number; nome?: string; tipo?: string } | null> {
  try {
    const raw = await AsyncStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Erro ao obter dados do usuário:", e);
    return null;
  }
}
