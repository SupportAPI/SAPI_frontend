import axios from 'axios';
import { getToken } from '../utils/cookies';

const base_URL = 'https://k11b305.p.ssafy.io';
// const base_URL = 'http://192.168.31.35:8080';

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

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log('axiosInstance Error :', error);
    console.log(error.response.data.code);

    if (
      error.response.data.code == 'EXPIRED_JWT_EXCEPTION' ||
      error.response.data.code == 'EXPIRED_REFRESH_TOKEN_EXCEPTION' ||
      error.response.data.code == 'NOT_VALID_JWT_EXCEPTION' ||
      error.response.data.code == 'NOT_FOUND_WORKSPACE' ||
      error.response.data.code == 'NOT_FOUND_DOCS' ||
      error.response.data.code == 'NOT_FOUND_API' ||
      error.response.data.code == 'INVALID_ADDRESS'
    ) {
      window.location.href = '/404page';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
