import { useMutation, useQuery, useQueryClient } from 'react-query';
import axiosInstance from '../axiosInstance';

export const fetchApiHistoryList = async (workspaceId, docsId) => {
  const response = await axiosInstance.get(`/api/workspaces/${workspaceId}/docs/${docsId}/history-list`);
  return response.data.data;
};

export const useFetchApiHistoryList = (workspaceId, docsId) => {
  return useQuery(['historyList', docsId], () => fetchApiHistoryList(workspaceId, docsId));
};

export const fetchApiHistoryDetail = async (workspaceId, apiId) => {
  const response = await axiosInstance.get(`/api/workspaces/${workspaceId}/apis/${apiId}`);
  return response.data.data;
};

export const useFetchApiHistoryDetail = (workspaceId, apiId) => {
  return useQuery(['historyDetail', apiId], () => fetchApiHistoryDetail(workspaceId, apiId));
};
