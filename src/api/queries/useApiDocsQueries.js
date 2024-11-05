import { useMutation, useQuery, useQueryClient } from 'react-query';
import axiosInstance from '../axiosInstance';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../../utils/cookies';

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

// API 문서 조회 (Detail)
export const fetchApiDocDetail = async () => {
  const accessToken = getToken();
  const workspaceId = '2243cb05-3f20-44e8-81d9-8bea9387390a';
  const apiId = '495adbfa-b130-401e-a91d-4166b4071637';
  const response = await axios.get(`http://192.168.31.66:8080/api/workspaces/${workspaceId}/apis/${apiId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // 실제 API 요청시 아래 주석을 해제하고 axiosInstance와 관련된 코드로 대체합니다.
  // const response = await axiosInstance.get(`/api/workspaces/${workspaceId}/docs/${apiId}`);
  // return response.data.data;

  // const response = {
  //   docsId: 'docs Id',
  //   apiId: 'api Id',
  //   category: 'category',
  //   name: 'API 이름',
  //   method: 'API Method',
  //   path: 'API Path',
  //   description: 'API 설명',
  //   managerEmail: '매니저 이메일',
  //   managerName: '매니저 이름',
  //   managerProfileImage: '매니저 이미지',
  //   parameters: {
  //     authType: '토큰 타입',
  //     headers: [
  //       {
  //         headerId: 'HDR001',
  //         headerKey: 'Authorization',
  //         headerValue: 'Bearer {token}',
  //         headerDescription: '사용자 인증 토큰',
  //       },
  //       {
  //         headerId: 'HDR002',
  //         headerKey: 'Content-Type',
  //         headerValue: 'application/json',
  //         headerDescription: '요청 콘텐츠 타입',
  //       },
  //     ],
  //     queryParameters: [
  //       {
  //         queryParameterId: 'QRY001',
  //         queryParameterKey: 'includeDetails',
  //         queryParameterValue: 'true',
  //         queryParameterDescription: '상세 정보를 포함 여부',
  //       },
  //       {
  //         queryParameterId: 'QRY002',
  //         queryParameterKey: 'lang',
  //         queryParameterValue: 'ko',
  //         queryParameterDescription: '응답 언어',
  //       },
  //     ],
  //     cookies: [
  //       {
  //         cookieId: 'CK001',
  //         cookieKey: 'sessionId',
  //         cookieValue: 'abc123xyz',
  //         cookieDescription: '세션 식별자 쿠키',
  //       },
  //       {
  //         cookieId: 'CK002',
  //         cookieKey: 'userPrefs',
  //         cookieValue: 'darkMode=true',
  //         cookieDescription: '사용자 설정 쿠키',
  //       },
  //     ],
  //   },
  //   request: {
  //     none: '',
  //     json: '',
  //     formData: [
  //       {
  //         formDataId: 'FD001',
  //         formDataKey: 'profileImage',
  //         formDataValue: 'image.jpg',
  //         formDataType: 'file',
  //         formDataDescription: '사용자 프로필 이미지',
  //       },
  //       {
  //         formDataId: 'FD002',
  //         formDataKey: 'coverImage',
  //         formDataValue: 'cover.jpg',
  //         formDataType: 'file',
  //         formDataDescription: '사용자 커버 이미지',
  //       },
  //     ],
  //   },
  //   response: [
  //     {
  //       responseId: 'RESP001',
  //       responseCode: '201',
  //       responseDescription: '사용자 생성 성공',
  //       responseContentType: 'application/json',
  //       ReponseBodyData: {
  //         userId: '12345',
  //         username: 'johndoe',
  //         email: 'johndoe@example.com',
  //         createdAt: '2023-11-04T12:00:00Z',
  //       },
  //     },
  //     {
  //       responseId: 'RESP002',
  //       responseCode: '400',
  //       responseDescription: '잘못된 요청 형식',
  //       responseContentType: 'application/json',
  //       ReponseBodyData: {
  //         error: 'Invalid request format',
  //         message: '필수 필드가 누락되었습니다.',
  //       },
  //     },
  //   ],
  // };

  return response.data.data;
};

// React Query 훅 정의
export const useApiDocDetail = () => {
  return useQuery('apiDocDetail', fetchApiDocDetail);
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
