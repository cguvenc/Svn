import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Resolve stored image paths. Uploaded files are stored as "/api/uploads/..".
export const resolveImg = (u) => {
  if (!u) return u;
  if (u.startsWith("/api/")) return `${BACKEND_URL}${u}`;
  return u;
};

const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("svn_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("svn_token");
      if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
