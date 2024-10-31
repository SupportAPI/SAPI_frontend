import { useQuery } from 'react-query';

export const fetchApiDocs = async () => {
  // const response = await axiosInstance.get('http://192.168.31.219:8080/api/docs');
  // return response.data;

  return [
    {
      category: 'Clients',
      apis: [
        { id: '1', name: 'Signup' },
        { id: '2', name: 'Login' },
        { id: '3', name: 'Get Client Details' },
        { id: '4', name: 'Update Client Info' },
      ],
    },
    {
      category: 'Projects',
      apis: [
        { id: '5', name: 'Project List' },
        { id: '6', name: 'Create Project' },
        { id: '7', name: 'Delete Project' },
        { id: '8', name: 'Get Project Details' },
        { id: '9', name: 'Update Project Info' },
      ],
    },
    {
      category: 'Teams',
      apis: [
        { id: '10', name: 'Project List' },
        { id: '11', name: 'Create Project' },
        { id: '12', name: 'Delete Project' },
        { id: '13', name: 'Get Project Details' },
        { id: '14', name: 'Update Project Info' },
      ],
    },
  ];
};

export const useApiDocs = () => {
  return useQuery('apiDocs', fetchApiDocs);
};

// 새로운 API 문서 생성
export const createApiDoc = async (newDoc) => {
  // 실제 API 요청을 사용하는 경우:
  // const response = await axiosInstance.post('/api/docs', newDoc);
  // return response.data;
};

// API 문서 업데이트
export const updateApiDoc = async (docId, updatedDoc) => {
  // 실제 API 요청을 사용하는 경우:
  // const response = await axiosInstance.put(`/api/docs/${docId}`, updatedDoc);
  // return response.data;
};

// API 문서 삭제
export const deleteApiDoc = async (docId) => {
  // 실제 API 요청을 사용하는 경우:
  // const response = await axiosInstance.delete(`/api/docs/${docId}`);
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
