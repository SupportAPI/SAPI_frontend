import axios from 'axios';
import { getToken } from '../utils/cookies';

const base_URL = 'https://k11b305.p.ssafy.io';

// axiosInstance 설정
const axiosInstance = axios.create({
  baseURL: base_URL,
});

// 요청을 보내기 전에 accessToken을 헤더에 추가하는 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
