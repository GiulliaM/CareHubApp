import axios from 'axios';

export const API_URL = 'http://54.39.173.152:3000/api';

const api = axios.create({
  baseURL: API_URL
});

export default api;
