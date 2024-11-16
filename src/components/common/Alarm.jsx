import React, { useEffect, useRef, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useMutation } from 'react-query';
import {
  fetchNotifications,
  deleteNotification,
  markNotificationAsRead,
} from '../../api/queries/useNotificationsQueries';
import Settings from '../../pages/Settings/Settings';
import { useNavigate } from 'react-router-dom';

const Alarm = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 4,
      fromId: '8fcef436-3641-444b-b7d4-48e281a769d7',
      workspaceId: '8fcef436-3641-444b-b7d4-48e281a769d7',
      fromName: 'testProject',
      message: 'testProject 워크스페이스에서 초대받았습니다.',
      notificationType: 'WORKSPACE_INVITE',
      isRead: true,
      createdDatetime: '2024-11-08T12:49:12.198137',
    },
  ]);
  const [isLoad, setIsLoad] = useState(false);

  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const settingRef = useRef(null);
  const navigate = useNavigate();

  // React-Query
  const alarmMutation = useMutation(() => fetchNotifications(), {
    onSuccess: (response) => {
      if (response) {
        setNotifications(response);
        setIsLoad(true);
      }
    },
    onError: (error) => {
      console.error('alarm fetch error', error);
    },
  });

  const deleteAlarmMutation = useMutation((notificationId) => deleteNotification(notificationId), {
    onSuccess: (response) => {
      return response;
    },
    onError: (error) => {
      return false;
    },
  });

  const markNotificationAsReadMutation = useMutation((notificationIds) => markNotificationAsRead(notificationIds), {
    onSuccess: (response) => {
      return response;
    },
    onError: (error) => {
      console.error('Error marking notifications as read:', error);
      return false;
    },
  });

  useEffect(() => {
    alarmMutation.mutate();
  }, []);

  useEffect(() => {
    const markNotificationsAsRead = async () => {
      if (isLoad) {
        const notificationIds = notifications
          .filter((notification) => !notification.isRead)
          .map((notification) => notification.id);

        if (notificationIds.length > 0) {
          await markNotificationAsReadMutation.mutateAsync(notificationIds);
        }
      }
    };

    markNotificationsAsRead();
  }, [isLoad]); // `notifications`를 의존성에 추가하여 업데이트 시 반영

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleDeleteNotification = async (id, event) => {
    event.stopPropagation();
    const response = await deleteAlarmMutation.mutateAsync(id);
    if (response) {
      setNotifications(notifications.filter((notification) => notification.id !== id));
    } else {
      console.log('삭제실패');
    }
  };

  const alarmClickRouting = (apiId, workspaceId, type) => {
    if (type === 'WORKSPACE_INVITE') {
      setIsSettingModalOpen(true); // 먼저 모달을 열어 ref를 설정
      setTimeout(() => {
        if (settingRef.current) {
          settingRef.current.showInvitationComponent(); // ref가 설정된 후 함수 호출
        }
      }, 0); // 짧은 지연을 둬서 Settings가 렌더링되도록 함
    } else {
      const path = `/workspace/${workspaceId}/apidocs/${apiId}`;
      navigate(path);
    }
  };

  return (
    <div
      className='absolute right-0 mt-4 w-80 h-[500px] bg-white 
        border-gray-200 rounded-2xl shadow-2xl 
        overflow-y-scroll sidebar-scrollbar transition-all duration-300 z-50 scrollbar-gutter-stable'
    >
      <div className='flex items-center border-b p-4 bg-[#DEEBF0] text-black font-bold text-2xl h-[70px] dark:bg-dark-background dark:text-dark-text'>
        Notifications
      </div>

      <div className='min-h-70 overflow-y-auto '>
        {notifications.length > 0 ? (
          notifications
            .sort((a, b) => new Date(b.createdDatetime) - new Date(a.createdDatetime))
            .map((notification) => (
              <div
                key={notification.id}
                className={`flex flex-col gap-1 p-3 hover:bg-[#E0ECF0] dark:bg-dark-background dark:hover:bg-gray-600
          ${notification.isRead ? 'bg-white' : 'bg-[#EEF6F9]'}
          border-b border-gray-100 last:border-b-0`}
                onClick={() =>
                  alarmClickRouting(notification.fromId, notification.workspaceId, notification.notificationType)
                }
              >
                <div className='flex flex-row ml-1'>
                  <p className='text-lg text-black dark:text-dark-text font-bold'>{notification.fromName}</p>
                  <p className='text-xs text-black dark:text-dark-text ml-2 mt-2'>
                    {new Date(notification.createdDatetime).toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <FiX
                    className='text-lg mt-1 ml-auto cursor-pointer'
                    onClick={(event) => handleDeleteNotification(notification.id, event)}
                  />
                </div>
                <p className='text-sm text-gray-700 dark:text-dark-text ml-1 break-words whitespace-normal'>
                  {notification.message}
                </p>
              </div>
            ))
        ) : (
          <div className='p-4 text-gray-500'>No new notifications</div>
        )}
      </div>
      {isSettingModalOpen && <Settings ref={settingRef} onClose={() => setIsSettingModalOpen(false)} />}
    </div>
  );
};

export default Alarm;
