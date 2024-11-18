import axios from 'axios';
import { getToken } from '../../utils/cookies';

const base_URL = 'https://k11b305.p.ssafy.io'; // 본 서버
// const base_URL = '192.168.31.35';

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

export const findInitComments = async (id, size, docsId) => {
  try {
    console.log(`Requesting: /comments?targetcommentid=${id}&size=${size}`);
    const accessToken = getToken();
    const response = await axios.get(`${base_URL}/api/docs/${docsId}/initcomments`, {
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
    const accessToken = getToken();
    const response = await axios.get(`${base_URL}/api/users/comment-search`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        workspaceId: workspaceId,
        nicknameValue: nicknameValue, // encodeURIComponent 제거
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Find comments error:', error);
    throw error;
  }
};
