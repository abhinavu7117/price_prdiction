import axios from "axios";

const BASE = process.env.REACT_APP_BACKEND_URL;
export const API = `${BASE}/api`;

const client = axios.create({ baseURL: API });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("cotton_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
