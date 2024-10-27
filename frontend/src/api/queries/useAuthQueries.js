import axios from 'axios';

// 로그인 API 호출 함수
export const login = async (username, password) => {
  const useMock = true;

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
    const response = await axios.post('/api/login', {
      username,
      password,
    });
    return response;
  }
};
