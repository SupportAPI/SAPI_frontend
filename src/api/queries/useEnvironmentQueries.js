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
  return useQuery(['categoryId', categoryId], () => fetchEnvironment(categoryId), {
    enabled: !!categoryId,
  });
};

export const editEnvironmentName = async (categoryId, name) => {
  try {
    const accessToken = getToken();
    const response = await axios.patch(
      `${base_URL}/api/environment-categories/${categoryId}`,
      {
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
    console.error('dont edit category name', error);
    throw error;
  }
};

// 환경 변수 이름 수정 함수
export const useEditEnvironmentName = () => {
  const queryClient = useQueryClient();
  return useMutation(({ categoryId, name }) => editEnvironmentName(categoryId, name), {
    onSuccess: () => {
      // 수정 후 관련 데이터를 갱신
      queryClient.invalidateQueries(['workspaceId']);
    },
  });
};
