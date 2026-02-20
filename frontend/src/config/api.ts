import axios from 'axios';

export const API_URL = 'http://163.245.203.21:3000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos antes de mostrar Network Error
});

// Interceptor de erros para facilitar o debug
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error(`[API] Network Error — Servidor inacessível em: ${API_URL}`);
      console.error('[API] Verifique: (1) backend está rodando, (2) IP correto, (3) firewall/porta aberta');
    }
    return Promise.reject(error);
  }
);

export default api;
