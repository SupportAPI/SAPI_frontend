import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getToken } from '../../utils/cookies';

const base_URL = 'https://k11b305.p.ssafy.io'; // 본 /서버
// const base_URL = 'http://192.168.31.35:8080'; // 세현 서버

// 1. Api List 호출 (전체)
export const fetchApiList = async (workspaceId) => {
  const accessToken = getToken();

  const response = await axios.get(`${base_URL}/api/workspaces/${workspaceId}/api-tests`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data.data;
};

// React Query 훅: 워크스페이스 목록을 가져오는 쿼리 훅
export const useFetchApiList = (workspaceId) => {
  return useQuery(['workspaceId', workspaceId], () => fetchApiList(workspaceId));
};

// 2. API Detail 호출 (개별)
export const fetchApiDetail = async (workspaceId, apiId) => {
  const accessToken = getToken();

  const response = await axios.get(`${base_URL}/api/workspaces/${workspaceId}/api-tests/${apiId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

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
  const accessToken = getToken();

  const response = await axios.patch(`${base_URL}/api/workspaces/${workspaceId}/api-tests/${apiId}`, apiTestDetails, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.data;
};

// 4. API TEST Request
export const requestApiTest = async (workspaceId, apiDetail) => {
  const accessToken = getToken();

  const response = await axios.get(`${base_URL}/api/workspaces/${workspaceId}/test`, {
    params: apiDetail, // 쿼리 파라미터로 전달
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.data;
};
