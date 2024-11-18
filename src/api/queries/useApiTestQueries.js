import { useQuery, useQueryClient, useMutation } from 'react-query';
import axiosInstance from '../axiosInstance';
import { values } from 'lodash';
import axios from 'axios';

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
export const requestRealServer = async (apiInfo, apiBaseUrl) => {
  try {
    // 기본 URL 설정 (path 변수와 query 파라미터 적용)
    let apiPath = apiInfo.path;
    const pathVariables = apiInfo.parameters.pathVariables || [];
    pathVariables.forEach((variable) => {
      const placeholder = `{${variable.key}}`;
      apiPath = apiPath.replace(placeholder, variable.value);
    });

    const queryParameters = apiInfo.parameters.queryParameters || [];
    const queryString = queryParameters
      .filter((param) => param.isChecked) // 체크된 파라미터만 사용
      .map((param) => `${param.key}=${param.value}`)
      .join('&');

    // 최종 URL 생성
    const finalUrl = `${apiBaseUrl}${apiPath}${queryString ? `?${queryString}` : ''}`;
    // const finalUrl = `http://192.168.0.229:8080${apiPath}${queryString ? `?${queryString}` : ''}`;

    // 헤더 조합
    const headers = {};
    const headerParams = apiInfo.parameters.headers || [];
    headerParams.forEach((header) => {
      if (header.isChecked) {
        headers[header.key] = header.value;
      }
    });

    // 쿠키 처리
    const cookies = apiInfo.parameters.cookies || [];
    const cookieString = cookies
      .filter((cookie) => cookie.isChecked)
      .map((cookie) => `${cookie.key}=${cookie.value}`)
      .join('; ');
    if (cookieString) {
      headers['Cookie'] = cookieString;
    }

    // 바디 처리
    let requestBody = null;
    if (apiInfo.request.bodyType === 'JSON') {
      requestBody = JSON.parse(apiInfo.request.json.value);
    } else if (apiInfo.request.bodyType === 'FORM_DATA') {
      const formData = new FormData();
      apiInfo.request.formData.forEach((item) => {
        if (item.isChecked) {
          if (item.type === 'TEXT') {
            formData.append(item.key, item.value);
          } else if (item.type === 'FILE') {
            const fileBlob = new Blob([item.file.fileName], { type: 'application/octet-stream' });
            formData.append(item.key, fileBlob, item.file.fileName);
          }
        }
      });
      requestBody = formData;
    }

    // 요청 생성 및 전송
    const axiosConfig = {
      method: apiInfo.method,
      url: finalUrl,
      headers: headers,
      data: requestBody,
    };

    const response = await axios(axiosConfig);
    return response;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    return error.response; // 호출 측에서 에러 처리를 할 수 있도록 재던짐
  }
};

export const useRequestRealServer = () => {
  return useMutation(
    async ({ apiInfo, apiBaseUrl }) => {
      return await requestRealServer(apiInfo, apiBaseUrl);
    },
    {
      onSuccess: (data) => {
        return data;
      },
      onError: (error) => {
        throw error;
      },
    }
  );
};

// validateDocs 함수 수정
export const validateDocs = async ({ workspaceId, docId, payload, type }) => {
  const response = await axiosInstance.post(`/api/workspaces/${workspaceId}/validate/${docId}`, payload, {
    headers: {
      'X-Test-Type': type,
    },
  });
  return response.data;
};

export const useValidateDocs = () => {
  return useMutation(
    async ({ workspaceId, docId, payload, type }) => {
      const response = await axiosInstance.post(`/api/workspaces/${workspaceId}/validate/${docId}`, payload, {
        headers: {
          'X-Test-Type': type,
        },
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        console.log('Validation 성공:', data);
        return data;
      },
      onError: (error) => {
        console.error('Validation 실패:', error);
        throw error;
      },
    }
  );
};

// 5. API TEST FILE 업로드
export const requestApiTestFileUpload = async (workspaceId, fileData) => {
  console.log('파일', fileData);
  const formRequestData = new FormData();
  formRequestData.append('file', fileData); // 파일 객체로 추가
  const response = await axiosInstance.post(`/api/workspaces/${workspaceId}/file`, formRequestData, {
    headers: {},
  });
  return response.data.data;
};

// 6. API TEST FILE 삭제
export const requestApiTestFileRemove = async (workspaceId, fileId) => {
  const response = await axiosInstance.delete(`/api/workspaces/${workspaceId}/file/${fileId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data.data;
};
