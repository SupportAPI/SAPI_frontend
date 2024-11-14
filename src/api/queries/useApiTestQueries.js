import { useQuery } from 'react-query';
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
export const requestApiTest = async (workspaceId, apiDetail, path = '') => {
  // 1. pathvariable
  const pathVariables =
    apiDetail.pathVariables && apiDetail.pathVariables.length > 0
      ? `/${apiDetail.pathVariables.map((param) => param.value).join('/')}`
      : '';
  // 2. queryParameter
  const queryParams = apiDetail.queryParameters
    ? apiDetail.queryParameters.reduce((acc, param) => {
        if (param.isChecked && param.key && param.value) {
          // isChecked가 true인 항목만 추가
          acc[param.key] = param.value;
        }
        return acc;
      }, {})
    : {};
  // 3. headers
  const dynamicHeaders = apiDetail.headers
    ? apiDetail.headers.reduce((acc, header) => {
        if (header.isChecked && header.key && header.value) {
          acc[header.key] = header.value; // isChecked가 true인 항목만 추가
        }
        return acc;
      }, {})
    : {};
  const headers = {
    'Content-Type': 'application/json',
    'sapi-method': apiDetail.method,
    ...additionalHeaders, // 추가적인 헤더 병합
  };
  const response = await axiosInstance.post(`/api/workspaces/${workspaceId}/test${path}${pathVariables}`, {
    headers,
    params: queryParams, // 동적으로 만든 queryParams 추가
  });
  return response.data.data;
};
