import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance';

// 1. 워크스페이스 목록 가져오기
export const fetchWorkspaces = async () => {
  const response = await axiosInstance.get(`/api/workspaces`);
  return response.data.data;
};
// React Query 훅: 워크스페이스 목록을 가져오는 쿼리 훅
export const useFetchWorkspaces = () => {
  return useQuery('workspaces', fetchWorkspaces);
};

// 2. 워크스페이스 생성
export const createWorkspace = async ({ mainImage, projectName, domain, description }) => {
  const formData = new FormData();
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
  const response = await axiosInstance.post(`/api/workspaces`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
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
  const response = await axiosInstance.delete(`/api/workspaces/${workspaceId}`);
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
  const response = await axiosInstance.get(
    `/api/users/workspace-search?workspaceId=${workspaceId}&emailValue=${email}`
  );
  return response.data.data;
};
// React Query 훅: 초대할 유저 목록 자동완성하기
export const useFetchAutoUserSearch = (workspaceId, email) => {
  return useQuery(['InviteAutoList', workspaceId, email], () => fetchAutoUserSearch(workspaceId, email));
};

// 4-1. 초대할 유저 정보 가져오기
export const fetchinviteUser = async (useremail) => {
  const response = await axiosInstance.get(`/api/users?email=${useremail}`);
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
  const response = await axiosInstance.post(`/api/memberships`, requestData, {
    headers: {
      'Content-Type': 'application/json',
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
  const response = await axiosInstance.get(`/api/users/${userId}`);
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
  const response = await axiosInstance.get(`/api/memberships?workspaceId=${workspaceId}`);
  return response.data.data;
};
// React Query 훅 : 워크스페이스 내 유저 정보 조회
export const useUserInWorkspace = (workspaceId) => {
  return useQuery(['workspaceId', workspaceId], () => fetchUserInWorkspace(workspaceId), {
    retry: false,
    refetchOnWindowFocus: false,
  });
};

// 8. 자기자신 워크스페이스 초대된 현황 확인
export const fetchUserInvitedList = async () => {
  const response = await axiosInstance.get(`/api/memberships/invited`);
  return response.data.data;
};
// React Query 훅 : 워크스페이스 유저 초대 조회
export const useUserInvitedList = () => {
  return useQuery('InviteList', fetchUserInvitedList);
};

// 9. 워크스페이스 초대 수락
export const userInvitedAccept = async (membershipId) => {
  await axiosInstance.patch(`/api/memberships/${membershipId}/accept`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
// React Query 훅: 워크스페이스 초대 수락
export const useInvitedAccept = () => {
  return useMutation((membershipId) => userInvitedAccept(membershipId));
};

// 9. 워크스페이스 초대 거절
export const userInvitedRefuse = async (membershipId) => {
  await axiosInstance.delete(`/api/memberships/${membershipId}/refuse`);
};
// React Query 훅: 워크스페이스 초대 거절
export const useInvitedRefuse = () => {
  return useMutation((membershipId) => userInvitedRefuse(membershipId));
};

// 10. 워크스페이스 디테일 조회
export const fetchWorkspacesDetail = async (workspaceId) => {
  const response = await axiosInstance.get(`/api/workspaces/${workspaceId}`);
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
  const formData = new FormData();
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
  const response = await axiosInstance.patch(`/api/workspaces/${workspaceId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
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
      onSuccess: () => {
        queryClient.invalidateQueries(['workspaces']); // 수정 후 workspaces 캐시 무효화
        toast('변경이 완료되었습니다.');
      },
      onError: (error) => {
        console.error('Error modifying workspace:', error); // 에러 발생 시 로그 출력
        toast('변경 권한이 없습니다.');
      },
    }
  );
};

// 12. 워크스페이스 내 초대한 유저 목록 조회
export const fetchWaitUserList = async (workspaceId) => {
  const response = await axiosInstance.get(`/api/memberships/invited-members?workspaceId=${workspaceId}`);
  return response.data.data;
};
// React Query 훅 : 워크스페이스 유저 초대 조회
export const useWaitUserList = (workspaceId) => {
  return useQuery(['WaitUserList', workspaceId], () => fetchWaitUserList(workspaceId), {
    enabled: false,
  });
};

// 13. 팀원 역할 수정
export const userMembershipChange = async (membershipId, role) => {
  await axiosInstance.patch(
    `/api/memberships/${membershipId}/role`,
    { role }, // 바디에 역할 전달
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};
// React Query 훅: 팀원 역할 수정
export const useUserMembershipChange = () => {
  return useMutation(({ membershipId, role }) => userMembershipChange(membershipId, role));
};

// 14. 팀원 권한 수정
export const userPermissionChange = async (membershipId, permission) => {
  await axiosInstance.patch(`/api/memberships/${membershipId}/authority`, permission, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
// React Query 훅: 팀원 역할 수정
export const useUserPermissionChange = () => {
  return useMutation(({ membershipId, permission }) => userPermissionChange(membershipId, permission));
};

// 15. 워크스페이스에서 내보내기 (쫓아내기)
export const userMembershipDelete = async (userId, workspaceId) => {
  const response = await axiosInstance.delete(`/api/memberships/exile?userId=${userId}&workspaceId=${workspaceId}`);
  return response.data.data;
};
// React Query 훅: 팀원 쫓아내기
export const useUserMembershipDelete = () => {
  return useMutation(({ userId, workspaceId }) => userMembershipDelete(userId, workspaceId));
};

// 워크스페이스 점유 상태
export const fetchOccupationState = async (workspaceId) => {
  const response = await axiosInstance.get(`/api/workspaces/${workspaceId}/occupations`);
  return response.data.data;
};

export const useOccupationState = (workspaceId) => {
  return useQuery(['workspaceId', workspaceId], () => fetchOccupationState(workspaceId));
};
