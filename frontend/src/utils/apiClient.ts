import axios from 'axios';
import { API_URL } from '../config/api';
import { getToken, logout } from './auth';
import { navigationRef } from '../navigation/RootNavigator';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await logout();
      // Redirect the app to the Welcome/login screen using the shared navigation ref
      try {
        if ((navigationRef as any).resetRoot) {
          (navigationRef as any).resetRoot({ index: 0, routes: [{ name: 'Welcome' }] });
        } else {
          (navigationRef as any).navigate?.('Welcome');
        }
      } catch (e) {
        // ignore navigation errors
      }
    }
    return Promise.reject(error);
  }
);

export default api;
