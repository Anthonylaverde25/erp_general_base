import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL_PRIVATE;

const axiosInstance = axios.create({
	baseURL: `${apiUrl}`
});

// Función auxiliar para obtener el token actual
const getToken = (): string | null => {
	try {
		const item = window.localStorage.getItem('jwt_access_token');
		return item ? JSON.parse(item) : null;
	} catch (error) {
		console.error('Error getting token from localStorage:', error);
		return null;
	}
};

const resolveFrontendOrigin = (): string | undefined => {
	if (typeof window !== 'undefined' && window.location?.origin) {
		return window.location.origin;
	}

	const envOrigin = import.meta.env.VITE_FRONTEND_URL as string | undefined;

	return envOrigin;
};

axiosInstance.interceptors.request.use(async (config) => {
	const token = getToken(); // Obtener el token fresh en cada request

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
		// NOTA: Los headers CORS (Access-Control-Allow-*) deben ser configurados en el BACKEND, no en el cliente.
		// El navegador ignora estos headers cuando vienen del cliente por razones de seguridad.
	}

	const frontendOrigin = resolveFrontendOrigin();

	if (frontendOrigin) {
		config.headers['X-Frontend-Url'] = frontendOrigin;
	}

	return config;
});

export default axiosInstance;
