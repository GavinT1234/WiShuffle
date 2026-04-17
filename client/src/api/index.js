import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api' ?? "http://localhost:4000/api",
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401 (expired token)
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.assign("/login");
    }
    return Promise.reject(err.response?.data?.message ?? err.message);
  }
);

export default api;