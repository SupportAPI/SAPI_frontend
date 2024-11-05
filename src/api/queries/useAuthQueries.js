import axios from 'axios';

// const base_URL = 'https://k11b305.p.ssafy.io'; // 본 서버
const base_URL = 'http://192.168.31.219:8080'; // 세현 서버

// 로그인 API 호출 함수
export const login = async (email, password) => {
  const useMock = false;

  if (useMock) {
    // 임시 토큰 생성
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockToken =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcklkIjoxLCJ3b3Jrc3BhY2VJZCI6MSwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.4EQZrsfxuGtvo-jU7RNH532QDOcth78FgfIdBpCLGZg';
        resolve({ data: { token: mockToken } });
      }, 500); // 500ms 지연 후 응답
    });
  } else {
    // 실제 API 요청
    const response = await axios.post(`${base_URL}/api/users/login`, {
      email,
      password,
    });

    return response.data.data;
  }
};
