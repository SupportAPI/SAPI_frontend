import axios from 'axios';
import { getToken } from '../../utils/cookies';

// const base_URL = 'https://k11b305.p.ssafy.io'; // 본 서버
const base_URL = 'http://192.168.31.219:8080'; // 세현 서버

export const findIndex = async () => {
  const accessToken = getToken();
  const response = await axios.get(`${base_URL}/api/docs/6a0c76ad-b4f1-4148-8ebc-78e6e104b1cf/comments/last-index`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.data;
};

export const findComments = async (id, size) => {
  try {
    console.log(`Requesting: /comments?targetcommentid=${id}&size=${size}`);
    const accessToken = getToken();
    const response = await axios.get(`${base_URL}/api/docs/6a0c76ad-b4f1-4148-8ebc-78e6e104b1cf/comments`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        targetcommentid: id,
        size: size,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Find comments error:', error);
    throw error;
  }
};

export const findUsers = async (nickname) => {
  try {
    console.log(nickname);
    const accessToken = getToken();
    const response = await axios.get(`${base_URL}/users`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      params: { nickname },
    });
    return response.data.data;
  } catch (error) {
    console.error('Find comments error:', error);
    throw error;
  }
};
