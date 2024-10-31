import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getToken } from '../../utils/cookies';

// const base_URL = 'https://k11b305.p.ssafy.io';
const base_URL = 'http://192.168.31.35:8080';

// 1. 워크스페이스 목록 가져오기
export const fetchWorkspaces = async () => {
  const accessToken = getToken();
  const response = await axios.get(`${base_URL}/api/workspaces`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.data;
};

// React Query 훅: 워크스페이스 목록을 가져오는 쿼리 훅
export const useFetchWorkspaces = () => {
  return useQuery('workspaces', fetchWorkspaces);
};

// 2. 워크스페이스 생성
export const createWorkspace = async ({ mainImage, projectName, domain, description }) => {
  const accessToken = getToken();

  // FormData 객체 생성
  const formData = new FormData();

  // 요청 DTO 생성 및 추가
  const requestDto = new Blob(
    [
      JSON.stringify({
        projectName: projectName,
        description: description,
        domain: domain,
      }),
    ],
    { type: 'application/json' }
  );
  formData.append('requestDto', requestDto);
  formData.append('mainImage', mainImage);

  // axios 요청 설정
  const response = await axios.post(`${base_URL}/api/workspaces`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data.data;
};

// React Query 훅: 워크스페이스 생성
export const useCreateWorkspace = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ mainImage, projectName, domain, description }) =>
      createWorkspace({ mainImage, projectName, domain, description }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['workspaces']);
        if (options.onSuccess) {
          options.onSuccess(data); // 데이터가 포함된 onSuccess 호출
        }
      },
      onError: (error) => {
        console.error('Error creating workspace:', error); // 에러 발생 시 로그 출력
      },
      ...options,
    }
  );
};

// 3. 워크스페이스 삭제
export const deleteWorkspace = async ({ workspaceId }) => {
  const accessToken = getToken();
  console.log('1111111111111111111111');
  console.log(workspaceId);
  const response = await axios.delete(`/api/workspaces/${workspaceId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

// React Query 훅: 워크스페이스 삭제
export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation((workspaceId) => deleteWorkspace({ workspaceId }), {
    onSuccess: () => {
      queryClient.invalidateQueries(['workspaces']);
    },
  });
};

// 4. 초대할 유저 정보 가져오기
export const fetchinviteUser = async (useremail) => {
  const accessToken = getToken();
  const response = await axios.get(`${base_URL}/api/users?email=${useremail}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data.data;
};

// React Query 훅: 워크스페이스 목록을 가져오는 쿼리 훅
export const useFetchInviteUser = (useremail) => {
  return useQuery(['inviteUser', useremail], () => fetchinviteUser(useremail), {
    enabled: false,
    onError: (error) => {
      if (error.response && error.response.status === 404) {
        throw new Error('404'); // 404 에러 발생 시 커스텀 에러 메시지 설정
      }
    },
    retry: false, // 여러 번 재시도 방지
  });
};

// 5. 유저 워크스페이스로 초대하기
export const InviteMember = async (requestData) => {
  const accessToken = getToken();

  // axios 요청 설정
  const response = await axios.post(`${base_URL}/api/memberships`, requestData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data.data;
};

export const useInviteMember = () => {
  return useMutation((requestData) => InviteMember(requestData));
};
