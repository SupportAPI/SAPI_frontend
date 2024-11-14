import { useQuery } from 'react-query';
import axiosInstance from '../axiosInstance';
import { useParams } from 'react-router-dom';

// 대시보드 목록 가져오기
export const fetchDashboardList = async (workspaceId) => {
  const response = await axiosInstance.get(`/api/workspaces/${workspaceId}/dashboards`);
  return response.data.data; // 필요한 데이터 반환
};

// React Query를 사용하는 커스텀 훅
export const useFetchDashboardList = () => {
  const { workspaceId } = useParams(); // URL에서 workspaceId 가져오기

  return useQuery(['workspaceId', workspaceId], () => fetchDashboardList(workspaceId), {
    enabled: !!workspaceId, // workspaceId가 있을 때만 쿼리 실행
  });
};
