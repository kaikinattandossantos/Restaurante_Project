import axios from 'axios';


const BASE_URL = 'http://192.168.15.2:5000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000, 
});

export default api;
