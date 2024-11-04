import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getToken } from '../../utils/cookies';

const base_URL = 'https://k11b305.p.ssafy.io'; // 본 서버
// const base_URL = 'http://192.168.31.219:8080'; // 세현 서버

// 1. 회원 정보 조회
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
  return useQuery(['userInfo', userId], () => fetchUserInfo(userId), {});
};

// 2. 회원 정보 변경
export const mutateUserInfo = async (userId, nickname, profileImage) => {
  const accessToken = getToken();

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

  const response = await axios.patch(`${base_URL}/api/users/${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`,
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
