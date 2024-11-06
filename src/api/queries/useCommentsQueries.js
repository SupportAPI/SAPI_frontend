import axios from 'axios';
import { getToken } from '../../utils/cookies';

const base_URL = 'https://k11b305.p.ssafy.io'; // 본 서버

export const findIndex = async () => {
  const accessToken = getToken();
  console.log('accessToken', accessToken);
  const response = await axios.get(`${base_URL}/api/6ee8aa57-0f62-426b-902a-fd6bda70b9e7/comments/last-index`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const findComments = async (id, size) => {
  try {
    console.log(`Requesting: /comments?targetcommentid=${id}&size=${size}`);
    const accessToken = getToken();
    console.log('accessToken', accessToken);
    const response = await axios.get(`${base_URL}/api/6ee8aa57-0f62-426b-902a-fd6bda70b9e7/comments`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        targetcommentid: id,
        size: size,
      },
    });
    return response.data;
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
    return response.data;
  } catch (error) {
    console.error('Find comments error:', error);
    throw error;
  }
};
