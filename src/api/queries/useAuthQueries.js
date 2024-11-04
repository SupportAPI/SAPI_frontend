import axios from 'axios';

// 로그인
export const login = async (email, password) => {
  const response = await axios.post('https://k11b305.p.ssafy.io/api/users/login', {
    email,
    password,
  });
  return response.data.data;
};
