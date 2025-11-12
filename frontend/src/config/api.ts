import axios from 'axios';

const api = axios.create({
  baseURL: 'http://54.39.173.152:3000'
});

export default api;
