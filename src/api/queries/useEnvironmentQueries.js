import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getToken } from '../../utils/cookies';
import axiosInstance from '../axiosInstance';

export const addEnvironment = async (workspaceId, name) => {
  try {
    const response = await axiosInstance.post(
      `/api/environment-categories`,
      {
        workspaceId,
        name,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Dont find environment', error);
    throw error;
  }
};

export const useAddEnvironment = (workspaceId) => {
  const queryClient = useQueryClient();
  return useMutation((name) => addEnvironment(workspaceId, name), {
    onSuccess: () => {
      queryClient.invalidateQueries(['environmentList', workspaceId]);
    },
  });
};

// 환경 변수 목록 불러오기
export const fetchEnvironmentList = async (workspaceId) => {
  try {
    const response = await axiosInstance.get(`/api/environment-categories`, {
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
  return useQuery(['environmentList', workspaceId], () => fetchEnvironmentList(workspaceId));
};

export const fetchEnvironment = async (categoryId) => {
  try {
    const response = await axiosInstance.get(`/api/environment-categories/${categoryId}`);
    return response.data.data;
  } catch (error) {
    console.error('Dont find environment', error);
    throw error;
  }
};

export const useFetchEnvironment = (categoryId) => {
  return useQuery(['environment', categoryId], () => fetchEnvironment(categoryId), {
    enabled: !!categoryId,
  });
};

export const editEnvironmentName = async (categoryId, name) => {
  try {
    const response = await axiosInstance.patch(
      `/api/environment-categories/${categoryId}`,
      {
        name,
      },
      {
        headers: {
          'Content-Type': 'application/json',
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
export const useEditEnvironmentName = (workspaceId) => {
  const queryClient = useQueryClient();
  return useMutation(({ categoryId, name }) => editEnvironmentName(categoryId, name), {
    onSuccess: () => {
      // 수정 후 관련 데이터를 갱신
      queryClient.invalidateQueries(['environmentList', workspaceId]);
    },
  });
};

export const deleteEnvironment = async (categoryId) => {
  try {
    const response = await axiosInstance.delete(`/api/environment-categories/${categoryId}`);
    return response.data.data;
  } catch (error) {
    console.error('dont delete category', error);
    throw error;
  }
};

export const useDeleteEnvironment = (workspaceId) => {
  const queryClient = useQueryClient();
  return useMutation((categoryId) => deleteEnvironment(categoryId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['environmentList', workspaceId]);
    },
  });
};
