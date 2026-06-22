import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:7000';

axios.defaults.baseURL = BASE;
axios.defaults.withCredentials = true;

export default axios;
