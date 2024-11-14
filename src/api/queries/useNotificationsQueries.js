import axiosInstance from '../axiosInstance';

// 알림 목록 가져오기
export const fetchNotifications = async () => {
  const response = await axiosInstance.get(`/api/notifications`);
  return response.data.data;
};

// 알림 삭제
export const deleteNotification = async (notificationId) => {
  const response = await axiosInstance.delete(`/api/notifications/${notificationId}`);
  return response.data.success;
};

// 알림 읽음 상태 업데이트
export const markNotificationAsRead = async (notificationIds) => {
  const response = await axiosInstance.patch(
    `/api/notifications`,
    { notificationIds }, // 요청 데이터
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.data;
};
