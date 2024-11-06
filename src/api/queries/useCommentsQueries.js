import axios from 'axios';
import { getToken } from '../../utils/cookies';

const base_URL = 'https://k11b305.p.ssafy.io'; // 본 서버

export const findIndex = async (docsId) => {
  const accessToken = getToken();
  const response = await axios.get(`${base_URL}/api/docs/${docsId}/comments/last-index`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.data;
};

export const findComments = async (id, size, docsId) => {
  try {
    console.log(`Requesting: /comments?targetcommentid=${id}&size=${size}`);
    const accessToken = getToken();
    const response = await axios.get(`${base_URL}/api/docs/${docsId}/comments`, {
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

export const findUsers = async (workspaceId, nicknameValue) => {
  try {
    console.log(nickname);
    const accessToken = getToken();
    const response = await axios.get(
      `${base_URL}/users/comment-search?workspaceId=${workspaceId}&nicknameValue=${nicknameValue}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          workspaceId: workspaceId,
          nicknameValue: nicknameValue,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Find comments error:', error);
    throw error;
  }
};
