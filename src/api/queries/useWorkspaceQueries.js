import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';

// 1. 워크스페이스 목록 가져오기
export const fetchWorkspaces = async (userId) => {
  // 실제 API 요청이 준비되면 아래 코드를 사용하세요.
  // const response = await axios.get(`/api/users/${userId}/workspaces`);
  // return response.data;

  // 더미 데이터 반환
  return [
    { id: '1', name: 'Workspace One' },
    { id: '2', name: 'Workspace Two' },
    { id: '3', name: 'Workspace Three' },
  ];
};

// 2. 워크스페이스 생성
export const createWorkspace = async ({ userId, workspaceName }) => {
  // 실제 API 요청이 준비되면 아래 코드를 사용하세요.
  // const response = await axios.post(`/api/users/${userId}/workspaces`, { name: workspaceName });
  // return response.data;

  // 더미 데이터 반환
  return { id: String(Date.now()), name: workspaceName };
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
export const useFetchWorkspaces = (userId) => {
  return useQuery(['workspaces', userId], () => fetchWorkspaces(userId));
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
