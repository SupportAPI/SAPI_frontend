import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../axiosInstance';
import { useParams } from 'react-router-dom';
import { getToken } from '../../utils/cookies';

const base_URL = 'https://k11b305.p.ssafy.io'; // 본 /서버
// const base_URL = 'http://192.168.31.35:8080'; // 세현 서버

export const fetchDashboardList = async (workspaceId) => {
  const accessToken = getToken();
  console.log(workspaceId);

  const response = await axios.get(`${base_URL}/api/workspaces/${workspaceId}/dashboards`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log('결과', response);

  return response.data.data;
};

export const useFetchDashboardList = () => {
  const { workspaceId } = useParams();
  return useQuery(['workspaceId', workspaceId], () => fetchDashboardList(workspaceId), {
    enabled: !!workspaceId,
  });
};
