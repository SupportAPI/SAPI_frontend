import axios from 'axios';

// 알림 목록 가져오기
export const fetchNotifications = async (workspaceId) => {
  const response = await axios.get(`/api/notifications`, {
    params: { workspaceId },
  });
  return response.data;
};

// 알림 읽음 상태 업데이트
export const markNotificationAsRead = async (notificationId) => {
  const response = await axios.put(`/api/notifications/${notificationId}/read`, {
    read: true,
  });
  return response.data;
};
