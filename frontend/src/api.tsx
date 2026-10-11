import axios from "axios"
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (originalRequest.url.includes("auth/refresh/")) {
            return Promise.reject(error)
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (originalRequest.url.includes("auth/refresh/")) {
                return Promise.reject(error)
            }

            originalRequest._retry = true
            const access = localStorage.getItem(ACCESS_TOKEN)
            if (access) {
                try {
                    const res = await api.post("auth/refresh/", {}, { headers: {} })
                    const newAccess = res.data.access
                    localStorage.setItem(ACCESS_TOKEN, newAccess);
                    localStorage.setItem("first_name", res.data.first_name);
                    originalRequest.headers["Authorization"] = `Bearer ${newAccess}`
                    return api(originalRequest)
                } catch (refreshError) {
                    localStorage.removeItem(ACCESS_TOKEN)
                }
            }

        }

        return Promise.reject(error)
    }
)


export default api