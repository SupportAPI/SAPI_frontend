import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getToken } from '../../utils/cookies';

const base_URL = 'http://192.168.31.35:8080';

// 1. 워크스페이스 목록 가져오기
export const fetchWorkspaces = async () => {
  const accessToken = getToken();
  const response = await axios.get(`${base_URL}/api/workspaces`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.data;
};

// 2. 워크스페이스 생성
export const createWorkspace = async ({ projectName, description, domain }) => {
  const accessToken = getToken();
  // 실제 API 요청이 준비되면 아래 코드를 사용하세요.
  const response = await axios.post(`${base_URL}/api/workspaces`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: {
      projectName: projectName,
      description: description,
      domain: domain,
    },
  });

  return response.data.data;
};

// 3. 워크스페이스 삭제
export const deleteWorkspace = async ({ userId, workspaceId }) => {
  // 실제 API 요청이 준비되면 아래 코드를 사용하세요.
  // const response = await axios.delete(`/api/users/${userId}/workspaces/${workspaceId}`);
  // return response.data;

  // 더미 데이터에서 삭제한 것처럼 처리
  return workspaceId;
};

// React Query 훅: 워크스페이스 목록을 가져오는 쿼리 훅
export const useFetchWorkspaces = () => {
  return useQuery('workspaces', fetchWorkspaces);
};

// React Query 훅: 워크스페이스 생성
export const useCreateWorkspace = (userId) => {
  const queryClient = useQueryClient();
  return useMutation((workspaceName) => createWorkspace({ userId, workspaceName }), {
    onSuccess: () => {
      queryClient.invalidateQueries(['workspaces', userId]);
    },
  });
};

// React Query 훅: 워크스페이스 삭제
export const useDeleteWorkspace = (userId) => {
  const queryClient = useQueryClient();
  return useMutation((workspaceId) => deleteWorkspace({ userId, workspaceId }), {
    onSuccess: () => {
      queryClient.invalidateQueries(['workspaces', userId]);
    },
  });
};
