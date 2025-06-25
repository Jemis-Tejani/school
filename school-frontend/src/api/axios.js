import axios from "axios";
import { getToken } from "../utils/storage";

// Direct API URL without using .env
const instance = axios.create({
  baseURL: "http://localhost:1337/api", // 🔁 Change this if your backend URL changes
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request if available
instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
