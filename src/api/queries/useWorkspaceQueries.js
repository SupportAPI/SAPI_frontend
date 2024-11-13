import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getToken } from '../../utils/cookies';
import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance';

const base_URL = 'https://k11b305.p.ssafy.io';
// const base_URL = 'http://192.168.31.35:8080'; // 세현 로컬

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
  const response = await axios.delete(`${base_URL}/api/workspaces/${workspaceId}`, {
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
      toast.success('워크스페이스가 삭제되었습니다.'); // 성공 메시지
    },
    onError: (error) => {
      if (error.response?.status === 403) {
        toast.error('삭제 권한이 없습니다.'); // 권한 문제
      } else {
        toast.error('워크스페이스 삭제 중 문제가 발생했습니다.'); // 기타 문제
      }
    },
    retry: false, // 요청 실패 시 자동 재시도 비활성화
    refetchOnWindowFocus: false,
  });
};

// 4-0. 초대할 유저 목록 자동 완성
export const fetchAutoUserSearch = async (workspaceId, email) => {
  const accessToken = getToken();
  const response = await axios.get(
    `${base_URL}/api/users/workspace-search?workspaceId=${workspaceId}&emailValue=${email}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data.data;
};

// React Query 훅: 초대할 유저 목록 자동완성하기
export const useFetchAutoUserSearch = (workspaceId, email) => {
  return useQuery(['InviteAutoList', workspaceId, email], () => fetchAutoUserSearch(workspaceId, email));
};

// 4-1. 초대할 유저 정보 가져오기
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
        console.log('존재하지 않는 유저 정보 입니다.');
      }
    },
    retry: false, // 여러 번 재시도 방지
  });
};

// 5. 유저 워크스페이스로 초대하기
export const InviteMember = async (requestData) => {
  const accessToken = getToken();
  console.log(requestData);

  const response = await axios.post(`${base_URL}/api/memberships`, requestData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.data;
};

// React Query 훅 : 유저 초대 보내기
export const useInviteMember = () => {
  return useMutation((requestData) => InviteMember(requestData), {
    refetchOnWindowFocus: false,
    onSuccess: () => {
      toast.success('초대가 완료되었습니다.'); // 성공 메시지
    },
    onError: (error) => {
      console.error('초대 실패:', error);
      toast.error(`초대에 실패했습니다. 다시 시도해 주세요.`); // 실패 메시지
    },
  });
};

// 6. 회원 정보 조회
export const fetchUserInfo = async (userId) => {
  const accessToken = getToken();

  const response = await axios.get(`${base_URL}/api/users/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data.data;
};

// React Query 훅 : 유저 정보 조회하기
export const useUserInfo = (userId) => {
  return useQuery(['userInfo', userId], () => fetchUserInfo(userId), {
    retry: false,
    refetchOnWindowFocus: false,
  });
};

// 7. 워크스페이스 내 유저 목록 조회
export const fetchUserInWorkspace = async (workspaceId) => {
  const accessToken = getToken();

  const response = await axios.get(`${base_URL}/api/memberships?workspaceId=${workspaceId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data.data;
};

// React Query 훅 : 워크스페이스 내 유저 정보 조회
export const useUserInWorkspace = (workspaceId) => {
  return useQuery(['workspaceId', workspaceId], () => fetchUserInWorkspace(workspaceId), {
    retry: false,
    refetchOnWindowFocus: false,
  });
};

// 8. 자기자신 워크스페이스 초대 현황 확인
export const fetchUserInvitedList = async () => {
  const accessToken = getToken();

  const response = await axios.get(`${base_URL}/api/memberships/invited`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data.data;
};

// React Query 훅 : 워크스페이스 유저 초대 조회
export const useUserInvitedList = () => {
  return useQuery('InviteList', fetchUserInvitedList);
};

// 9. 워크스페이스 초대 수락
export const userInvitedAccept = async (membershipId) => {
  const accessToken = getToken();
  await axios.patch(
    `${base_URL}/api/memberships/${membershipId}/accept`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

// React Query 훅: 워크스페이스 초대 수락
export const useInvitedAccept = () => {
  return useMutation((membershipId) => userInvitedAccept(membershipId));
};

// 9. 워크스페이스 초대 거절
export const userInvitedRefuse = async (membershipId) => {
  const accessToken = getToken();
  await axios.delete(`${base_URL}/api/memberships/${membershipId}/refuse`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// React Query 훅: 워크스페이스 초대 거절
export const useInvitedRefuse = () => {
  return useMutation((membershipId) => userInvitedRefuse(membershipId));
};

// 10. 워크스페이스 디테일 조회
export const fetchWorkspacesDetail = async (workspaceId) => {
  const accessToken = getToken();
  const response = await axios.get(`${base_URL}/api/workspaces/${workspaceId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.data;
};

// React Query 훅: 워크스페이스 디테일을 가져오는 쿼리 훅
export const useFetchWorkspacesDetail = (workspaceId) => {
  return useQuery(['workspacesDetail', workspaceId], () => fetchWorkspacesDetail(workspaceId), {
    enabled: !!workspaceId, // workspaceId가 있을 때만 쿼리를 활성화
  });
};

// 11. 워크스페이스 수정
export const patchWorkspaces = async ({ workspaceId, mainImage, projectName, domain, description, isCompleted }) => {
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
        isCompleted: isCompleted,
      }),
    ],
    { type: 'application/json' }
  );
  formData.append('requestDto', requestDto);
  formData.append('mainImage', mainImage);

  // axios 요청 설정
  const response = await axios.patch(`${base_URL}/api/workspaces/${workspaceId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data.data;
};

// React Query 훅: 워크스페이스 수정
export const useModifiedWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ workspaceId, mainImage, projectName, domain, description, isCompleted }) =>
      patchWorkspaces({ workspaceId, mainImage, projectName, domain, description, isCompleted }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['workspaces']); // 수정 후 workspaces 캐시 무효화
        console.log('Workspace successfully modified:', data); // 성공 시 로그 출력
        toast('변경이 완료되었습니다.');
      },
      onError: (error) => {
        console.error('Error modifying workspace:', error); // 에러 발생 시 로그 출력
        toast('변경 권한이 없습니다.');
      },
    }
  );
};

// 워크스페이스 점유 상태
export const fetchOccupationState = async (workspaceId) => {
  const response = await axiosInstance.get(`${base_URL}/api/workspaces/${workspaceId}/occupations`);
  return response.data.data;
};

export const useOccupationState = (workspaceId) => {
  return useQuery(['workspaceId', workspaceId], () => fetchOccupationState(workspaceId));
};
