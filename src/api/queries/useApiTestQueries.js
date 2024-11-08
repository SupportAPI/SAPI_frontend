import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getToken } from '../../utils/cookies';

const base_URL = 'https://k11b305.p.ssafy.io'; // 본 /서버
// const base_URL = 'http://192.168.31.35:8080'; // 세현 서버

export const fetcApiList = async (workspaceId) => {
  const accessToken = getToken();

  const response = await axios.get(`${base_URL}/api/workspace/${workspaceId}/api-test`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data.data;
};

// React Query 훅: 워크스페이스 목록을 가져오는 쿼리 훅
export const useFetchApiList = (workspaceId) => {
  return useQuery(['workspaceId', workspaceId], () => fetcApiList(workspaceId));
};
