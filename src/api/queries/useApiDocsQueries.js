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
  return response.data.data;
};

export const useDetailApiDocs = () => {
  const { workspaceId } = useParams();
  return useQuery(['detailApiDocs', workspaceId], () => fetchDetailApiDocs(workspaceId), {
    enabled: !!workspaceId,
  });
};

// API 문서 조회 (Detail)
export const fetchApiDocDetail = async (workspaceId, apiId) => {
  const response = await axiosInstance.get(`api/workspaces/${workspaceId}/apis/${apiId}`);

  return response.data.data;
};

export const useApiDocDetail = (workspaceId, apiId) => {
  return useQuery(['apiDocDetail', workspaceId, apiId], () => fetchApiDocDetail(workspaceId, apiId));
};

// 워크스페이스 카테고리 조회
export const fetchWorkspaceCategoryList = async (workspaceId) => {
  const response = await axiosInstance.get(`api/workspaces/${workspaceId}/categories`);
  return response.data.data;
};

export const useWorkspaceCategoryList = (workspaceId) => {
  return useQuery(['categories', workspaceId], () => fetchWorkspaceCategoryList(workspaceId));
};

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

// API 확정
export const confirmWorkspace = async ({ workspaceId, docsId }) => {
  const response = await axiosInstance.post(`/api/workspaces/${workspaceId}/docs/${docsId}/confirm`);
  return response.data;
};

export const useConfirmWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation(({ workspaceId, docsId }) => confirmWorkspace({ workspaceId, docsId }), {
    onSuccess: () => {
      queryClient.invalidateQueries('apiDocs');
      console.log('Workspace document confirmed successfully!');
    },
    onError: (error) => {
      // 에러 처리
      console.error('Error confirming workspace document:', error);
    },
  });
};

// API 문서 내보내기
export const exportDocument = async ({ workspaceId, docsId, ext }) => {
  try {
    const response = await axiosInstance.post(`/api/workspaces/${workspaceId}/docs/${docsId}/export?ext=${ext}`);

    // 파일 이름 추출 (Content-Disposition 헤더 활용 가능)
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `document.${ext.toLowerCase()}`;

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename); // 동적으로 파일 이름 설정
    document.body.appendChild(link);
    link.click();

    // URL 객체 정리
    window.URL.revokeObjectURL(url);
    link.remove();
  } catch (error) {
    console.error('문서 내보내기 중 오류 발생:', error);
    throw error;
  }
};

// React Query를 활용한 Hook
export const useExportDocument = () => {
  return useMutation(({ workspaceId, ext }) => exportDocument({ workspaceId, ext }));
};

// API 문서 내보내기
export const exportDocumentList = async ({ workspaceId, ext, selectedDocs }) => {
  const response = await axiosInstance.post(
    `/api/workspaces/${workspaceId}/export?ext=${ext}&specifications=${selectedDocs}`
  );

  // 파일 다운로드 처리
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `document.${ext}`); // 파일 확장자에 따라 이름 설정
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url); // 메모리 해제
};

// React Query를 사용하는 Hook
export const useExportDocumentList = () => {
  return useMutation(({ workspaceId, ext, selectedDocs }) => exportDocumentList({ workspaceId, ext, selectedDocs }));
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
