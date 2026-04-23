import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5039/api',
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response && err.response.status === 401) {
            localStorage.removeItem('token');
            // If we get 401, clear token and force a redirect to login
            try { window.location.pathname = '/login'; } catch (e) { }
        }
        return Promise.reject(err);
    }
);

export default api;
