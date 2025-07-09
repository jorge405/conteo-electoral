import axios from 'axios';
import authStore from '../auth/auth.js';

// configuracion inicial de axios

const api= axios.create({
    baseURL: 'https://colecto.mittril.com/public/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para incluir el token en las peticiones

api.interceptors.request.use((config) => {

    const token = authStore.getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


// Interceptor para manejar errores de autenticacion

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = authStore.getRefreshToken();
            if (refreshToken) {
                try {
                    // solicitar un nuevo token con el refresh token
                    const {data}= await axios.post('consumer/login',{
                        headers: {
                            grant_type: 'refresh_token',
                        },
                    },{
                        refreshToken
                    });
                    // actaliza los tokens en el estado global
                    authStore.setToken(data.token,data.refreshToken);
                    // actualiza el encabezado original de la solicitud y reintenta
                    originalRequest.headers.Authorization = `Bearer ${data.token}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    console.log('Error al refrescar el token', refreshError);
                    // si el refresco falla, cierra la sesion
                    authStore.logout();
                    return Promise.reject(refreshError);
                    
                }
            }
            
        }
        return Promise.reject(error);
    }
);

export default api;