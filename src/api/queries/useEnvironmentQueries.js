import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getToken } from '../../utils/cookies';
import Environment from '../../pages/Environment/Environment';

const base_URL = 'https://k11b305.p.ssafy.io'; // 본 /서버

// 환경 변수 카테고리 추가
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

export const useAddEnvironment = (workspaceId) => {
  const queryClient = useQueryClient();
  return useMutation((name) => addEnvironment(workspaceId, name), {
    onSuccess: () => {
      queryClient.invalidateQueries(['environmentList', workspaceId]);
    },
  });
};

// 환경 변수 추가
export const addEnvironmentVariable = async (categoryId, orderIndex) => {
  try {
    const accessToken = getToken();
    const response = await axios.post(
      `${base_URL}/api/environment-categories/${categoryId}/environments`,
      {
        orderIndex,
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
    console.error('dont add environmentVariable', error);
    throw error;
  }
};

export const useAddEnvironmentVariable = (categoryId) => {
  const queryClient = useQueryClient();
  return useMutation(({ categoryId, orderIndex }) => addEnvironmentVariable(categoryId, orderIndex), {
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries(['environment', categoryId]);
    },
  });
};

// 환경 변수 카테고리 목록 불러오기
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
  return useQuery(['environmentList', workspaceId], () => fetchEnvironmentList(workspaceId));
};

// 환경 변수 불러오기
export const fetchEnvironment = async (categoryId) => {
  try {
    const accessToken = getToken();
    const response = await axios.get(`${base_URL}/api/environment-categories/${categoryId}/environments`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data.environments;
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

// 환경 변수 수정
export const editEnvironment = async (categoryId, environment) => {
  console.log(environment);
  try {
    const accessToken = getToken();
    const response = await axios.patch(
      `${base_URL}/api/environment-categories/${categoryId}/environments/${environment.id}`,
      {
        variable: environment.variable,
        type: environment.type,
        value: environment.value,
        description: environment.description,
        orderIndex: environment.orderIndex,
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

export const useEditEnvironment = (categoryId, environment) => {
  const queryClient = useQueryClient();
  return useMutation(({ categoryId, environment }) => editEnvironment(categoryId, environment), {
    onSuccess: () => {
      queryClient.invalidateQueries(['environment', categoryId]);
    },
  });
};

// 환경 변수 카테고리 이름 수정
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

export const useEditEnvironmentName = (workspaceId) => {
  const queryClient = useQueryClient();
  return useMutation(({ categoryId, name }) => editEnvironmentName(categoryId, name), {
    onSuccess: () => {
      // 수정 후 관련 데이터를 갱신
      queryClient.invalidateQueries(['environmentList', workspaceId]);
    },
  });
};

// 환경 변수 카테고리 삭제
export const deleteEnvironment = async (categoryId) => {
  try {
    const accessToken = getToken();
    const response = await axios.delete(`${base_URL}/api/environment-categories/${categoryId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
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

export const deleteEnvironmentVariable = async (categoryId, environmentId) => {
  try {
    const accessToken = getToken();
    const response = await axios.delete(
      `${base_URL}/api/environment-categories/${categoryId}/environments/${environmentId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('dont delete environmentVariable', error);
    throw error;
  }
};

export const useDeleteEnvironmentVariable = (categoryId) => {
  const queryClient = useQueryClient();
  return useMutation(({ categoryId, environmentId }) => deleteEnvironmentVariable(categoryId, environmentId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['environment', categoryId]);
    },
  });
};
