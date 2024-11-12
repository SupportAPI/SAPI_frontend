import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getToken } from '../../utils/cookies';

const base_URL = 'https://k11b305.p.ssafy.io'; // 본 /서버

export const addEnvironment = async (workspaceId, name) => {
  try {
    const accessToken = getToken();
    const response = await axios.post(
      `${base_URL}/api/environment-categories`,
      {
        workspaceId,
        name,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Dont find environment', error);
    throw error;
  }
};

export const useAddEnvironment = (workspaceId, name) => {
  return useQuery(['workspaceId', workspaceId, name], () => addEnvironment(workspaceId, name), {
    enabled: !!workspaceId && !!name,
  });
};

// 환경 변수 목록 불러오기
export const fetchEnvironmentList = async (workspaceId) => {
  try {
    const accessToken = getToken();
    const response = await axios.get(`${base_URL}/api/environment-categories`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        workspaceId,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Dont find environment', error);
    throw error;
  }
};

export const useFetchEnvironmentList = (workspaceId) => {
  return useQuery(['workspaceId', workspaceId], () => fetchEnvironmentList(workspaceId));
};

export const fetchEnvironment = async (categoryId) => {
  try {
    const accessToken = getToken();
    const response = await axios.get(`${base_URL}/api/environment-categories/${categoryId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Dont find environment', error);
    throw error;
  }
};

export const useFetchEnvironment = (categoryId) => {
  return useQuery(['categoryId', categoryId], () => fetchEnvironment(categoryId));
};
