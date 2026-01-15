import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ip } from '../creds';
import { resetToLogin } from './navigation';

const apiClient = axios.create({
	  baseURL: `http://localhost:5000/`
});

apiClient.interceptors.request.use(async (config)=>{
	try{
		const token = await AsyncStorage.getItem('accessToken');
		if(token){
			config.headers = config.headers || {};
			
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	}catch(err){
		return Promise.reject(err);
	}
});

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (originalRequest && error.response?.status === 401 && !originalRequest._retry){
			originalRequest._retry = true;
			try{
				const refreshToken = await AsyncStorage.getItem('refreshToken');
				const res = await apiClient.post('/refresh', { token: refreshToken });

				const newAccessToken = res.data.accessToken;
				await AsyncStorage.setItem('accessToken', newAccessToken);

				originalRequest.headers = originalRequest.headers || {};
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

				return apiClient(originalRequest);
			}catch(err){
				await AsyncStorage.removeItem('accessToken');
				await AsyncStorage.removeItem('refreshToken');
				resetToLogin()
			}
		}
		return Promise.reject(error);
	}
);

export default apiClient;

