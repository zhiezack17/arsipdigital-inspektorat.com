import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND_URL}/api`;

export const api = axios.create({
    baseURL: API_BASE,
    timeout: 20000,
});

// Unauthenticated API instance for public endpoints (no token injection, no 401 redirect)
export const publicApi = axios.create({
    baseURL: API_BASE,
    timeout: 20000,
});

const TOKEN_KEY = 'arsip_inspektorat_token';

export const getToken = () => {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};

export const setToken = (token) => {
    try {
        if (token) localStorage.setItem(TOKEN_KEY, token);
        else localStorage.removeItem(TOKEN_KEY);
    } catch { /* noop */ }
};

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error?.response?.status === 401) {
            const isLoginRequest = (error.config?.url || '').includes('/auth/login');
            if (!isLoginRequest) {
                setToken(null);
                if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export const extractErrorMessage = (error, fallback = 'Terjadi kesalahan. Silakan coba lagi.') => {
    const detail = error?.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
    return fallback;
};
