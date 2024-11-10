import axios from 'axios';
import { getToken } from '../../utils/cookies';

const base_URL = 'https://k11b305.p.ssafy.io';

// 알림 목록 가져오기
export const fetchNotifications = async () => {
  const accessToken = getToken();
  const response = await axios.get(`${base_URL}/api/notifications`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.data;
};

export const deleteNotification = async (notificationId) => {
  const accessToken = getToken();
  const response = await axios.delete(`${base_URL}/api/notifications/${notificationId}`, {
    headers : {
      'Content-Type' : 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.success;
}

// 알림 읽음 상태 업데이트
export const markNotificationAsRead = async (notificationId) => {
  const response = await axios.put(`${base_URL}/api/notifications/${notificationId}/read`, {
    read: true,
  });
  return response.data.data;
};
