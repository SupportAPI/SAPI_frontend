import { useQuery, useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../axiosInstance';

// 1. 회원 정보 조회
export const fetchUserInfo = async (userId) => {
  const response = await axiosInstance.get(`/api/users/${userId}`);
  return response.data.data;
};
// React Query 훅 : 유저 정보 조회하기
export const useUserInfo = (userId) => {
  return useQuery(['userInfo', userId], () => fetchUserInfo(userId), {
    enabled: !!userId,
  });
};

// 2. 회원 정보 변경
export const mutateUserInfo = async (userId, nickname, profileImage) => {
  // FormData 객체 생성
  const formData = new FormData();

  // 요청 DTO 생성 및 추가
  const requestDto = new Blob(
    [
      JSON.stringify({
        nickname: nickname,
      }),
    ],
    { type: 'application/json' }
  );
  formData.append('requestDto', requestDto);
  if (profileImage) {
    formData.append('profileImage', profileImage);
  }

  const response = await axiosInstance.patch(`/api/users/${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

// React Query 훅: 유저 정보 수정
export const useMutateUserInfo = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation(({ userId, nickname, profileImage }) => mutateUserInfo(userId, nickname, profileImage), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['user', data.userId]); // 해당 유저 정보 캐시 무효화
      if (options.onSuccess) {
        options.onSuccess(data); // onSuccess가 정의된 경우 호출
      }
    },
    onError: (error) => {
      console.error('Error updating user info:', error); // 에러 발생 시 로그 출력
      if (options.onError) {
        options.onError(error); // onError가 정의된 경우 호출
      }
    },
    ...options,
  });
};
