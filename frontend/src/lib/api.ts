import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/register") &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newToken = data.data.accessToken;
        localStorage.setItem("accessToken", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
