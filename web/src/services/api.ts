import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REAT_APP_API_URL
});

export default api;