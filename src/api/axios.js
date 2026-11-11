import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const url = err.config?.url || ''
        const isAuthCheck = url.includes('/check-auth') || url.includes('/login')

        if (err.response?.status === 401 && !isAuthCheck) {
            window.location.href = '/login?expired=1'
        }
        return Promise.reject(err)
    }
)

export default api;