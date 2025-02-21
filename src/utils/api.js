import axios from "axios";

const API = axios.create({
  baseURL: "https://expense-tracker-backend-k1kb.onrender.com/api",
});

// Attach JWT token to every request automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
