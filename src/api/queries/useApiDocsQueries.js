import { useMutation, useQuery, useQueryClient } from 'react-query';
import axiosInstance from '../axiosInstance';
import { useParams } from 'react-router-dom';

// API 목록 가져오기(navbar)
export const fetchApiDocs = async (workspaceId) => {
  const response = await axiosInstance.get(`/api/workspaces/${workspaceId}/docs/nav`);
  return response.data.data;
};

export const useApiDocs = () => {
  const { workspaceId } = useParams();
  return useQuery(['apiDocs', workspaceId], () => fetchApiDocs(workspaceId), {
    enabled: !!workspaceId,
  });
};

// API 목록 가져오기 (ALL)
export const fetchDetailApiDocs = async (workspaceId) => {
  const response = await axiosInstance.get(`/api/workspaces/${workspaceId}/docs`);
  console.log(response);
  return response.data.data;
};

export const useDetailApiDocs = () => {
  const { workspaceId } = useParams();
  return useQuery(['detailApiDocs', workspaceId], () => fetchDetailApiDocs(workspaceId), {
    enabled: !!workspaceId,
  });
};

// API 문서 조회

// 새로운 API 문서 생성
export const createApiDoc = async (workspaceId) => {
  const response = await axiosInstance.post(`/api/workspaces/${workspaceId}/docs`);
  return response.data.data;
};

export const useCreateApiDoc = () => {
  const queryClient = useQueryClient();
  return useMutation((workspaceId) => createApiDoc(workspaceId), {
    onSuccess: () => {
      queryClient.invalidateQueries('apiDocs');
      queryClient.invalidateQueries('detailApiDocs');
    },
    onError: (error) => {
      console.error('Error creating API document:', error);
    },
  });
};

// API 문서 삭제
export const deleteApiDoc = async (workspaceId, docId) => {
  const response = await axiosInstance.delete(`/api/workspaces/${workspaceId}/docs/${docId}`);
  return response.data;
};

export const useDeleteApiDoc = () => {
  const queryClient = useQueryClient();
  return useMutation(({ workspaceId, docId }) => deleteApiDoc(workspaceId, docId), {
    onSuccess: () => {
      queryClient.invalidateQueries('apiDocs');
      queryClient.invalidateQueries('detailApiDocs');
    },
    onError: (error) => {
      console.error('Error deleting API document:', error);
    },
  });
};

// API 문서 업데이트
export const updateApiDoc = async (docId, updatedDoc) => {
  // 실제 API 요청을 사용하는 경우:
  // const response = await axiosInstance.put(`/api/docs/${docId}`, updatedDoc);
  // return response.data;
};

// 특정 API 문서 상세 가져오기
export const fetchApiDocById = async (docId) => {
  // 실제 API 요청을 사용하는 경우:
  // const response = await axiosInstance.get(`/api/docs/${docId}`);
  // return response.data;
};

export const fetchApiDocsDetails = async (specificationId) => {
  // const response = await axios(`/api/specifications/${specificationId}`);
  // if (!response.ok) {
  //   throw new Error('Failed to fetch specification details');
  // }
  // return response.json();
};
