import axios from 'axios';

const envBase = import.meta.env.VITE_API_URL;
const isLocal =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname.startsWith('127.'));
const BASE = isLocal ? 'http://localhost:7000' : (envBase || 'http://localhost:7000');

axios.defaults.baseURL = BASE;
axios.defaults.withCredentials = true;

export default axios;
