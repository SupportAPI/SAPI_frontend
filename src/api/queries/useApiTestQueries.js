import { useQuery, useQueryClient, useMutation } from 'react-query';
import axiosInstance from '../axiosInstance';

// 1. Api List 호출 (전체)
export const fetchApiList = async (workspaceId) => {
  const response = await axiosInstance.get(`/api/workspaces/${workspaceId}/api-tests`);
  return response.data.data;
};
// React Query 훅: 워크스페이스 목록을 가져오는 쿼리 훅
export const useFetchApiList = (workspaceId) => {
  return useQuery(['workspaceId', workspaceId], () => fetchApiList(workspaceId));
};

// 2. API Detail 호출 (개별)
export const fetchApiDetail = async (workspaceId, apiId) => {
  const response = await axiosInstance.get(`/api/workspaces/${workspaceId}/api-tests/${apiId}`);
  return response.data.data;
};
// React Query 훅: 워크스페이스 목록을 가져오는 쿼리 훅
export const useFetchApiDetail = (workspaceId, apiId) => {
  return useQuery(['apiDetail', workspaceId, apiId], () => fetchApiDetail(workspaceId, apiId), {
    enabled: !!workspaceId && !!apiId, // workspaceId와 apiId가 있을 때만 실행
  });
};

// 3. API Detail 수정 (개별)
export const patchApiDetail = async (workspaceId, apiId, apiTestDetails) => {
  const response = await axiosInstance.patch(`/api/workspaces/${workspaceId}/api-tests/${apiId}`, apiTestDetails, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data.data;
};

// 4. API TEST Request
export const requestApiTestDetail = async (workspaceId, apiDetail, apiUrl) => {
  // 기본 headers 객체
  const headers = {
    'Content-Type': 'application/json',
  };

  // apiUrl이 null이 아니면 "sapi-local-host" 헤더 추가
  if (apiUrl !== null) {
    headers['sapi-local-host'] = apiUrl;
  }

  // axios 요청
  const response = await axiosInstance.post(`/api/workspaces/${workspaceId}/request`, { apiDetail }, { headers });

  return response.data.data;
};

export const useRequestApiTestDetail = (setTestResult) => {
  const queryClient = useQueryClient();
  return useMutation(({ workspaceId, apiDetail, apiUrl }) => requestApiTestDetail(workspaceId, apiDetail, apiUrl), {
    onSuccess: (data) => {
      setTestResult(data);
    },
  });
};
