import axios from "axios";
import { getToken } from "../utils/auth";
import { API_URL } from "../config/api";

// Cria a instância principal
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Helper para adicionar token dinamicamente
const withAuth = async (config = {}) => {
  const token = await getToken();
  const headers = (config as any).headers ? { ...(config as any).headers } : {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return { ...(config || {}), headers };
};

// Funções com async/await para evitar interceptores async
export default {
  get: async (url: string, config?: any) => {
    const cfg = await withAuth(config);
    const res = await api.get(url, cfg);
    return res.data;
  },
  post: async (url: string, data?: any, config?: any) => {
    const cfg = await withAuth(config);
    const res = await api.post(url, data, cfg);
    return res.data;
  },
  put: async (url: string, data?: any, config?: any) => {
    const cfg = await withAuth(config);
    const res = await api.put(url, data, cfg);
    return res.data;
  },
  patch: async (url: string, data?: any, config?: any) => {
    const cfg = await withAuth(config);
    const res = await api.patch(url, data, cfg);
    return res.data;
  },
  delete: async (url: string, config?: any) => {
    const cfg = await withAuth(config);
    const res = await api.delete(url, cfg);
    return res.data;
  },
  axiosInstance: api,
};
