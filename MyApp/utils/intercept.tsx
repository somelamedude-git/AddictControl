import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
	  baseURL: 'very very cool placeholder'
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
				const res = await axios.post('/refresh', { token: refreshToken });

				const newAccessToken = res.data.newAccessToken;
				await AsyncStorage.setItem('accessToken', newAccessToken);

				originalRequest.headers = originalRequest.headers || {};
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

				return apiClient(originalRequest);
			}catch(err){
				await AsyncStorage.remove('accessToken');
				await AsyncStorage.remove('refreshToken');
				// from here, we must add navigation back to the login page, idk the path
			}
		}
		return Promise.reject(error);
	}
);

export default apiClient;

