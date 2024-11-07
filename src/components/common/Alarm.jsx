import React, { useEffect, useRef, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useMutation } from 'react-query';
import { fetchNotifications } from '../../api/queries/useNotificationsQueries';
import Settings from '../../pages/Settings/Settings';
import { useNavigate } from 'react-router-dom';

const Alarm = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const settingRef = useRef(null);

  const navigate = useNavigate();

  const alarmMutation = useMutation(() => fetchNotifications(), {
    onSuccess: (response) => {
      if (response !== undefined) setNotifications(response);
    },
    onError: (error) => {
      console.error('alarm fetch error', error);
    },
  });

  console.log(notifications);

  useEffect(() => {
    alarmMutation.mutate();
  }, []);

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleDeleteNotification = (id, event) => {
    event.stopPropagation();
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const alarmClickRouting = (apiId, type) => {
    if (type === 'WORKSPACE_INVITE') {
      setIsSettingModalOpen(true); // 먼저 모달을 열어 ref를 설정
      setTimeout(() => {
        if (settingRef.current) {
          settingRef.current.showInvitationComponent(); // ref가 설정된 후 함수 호출
        }
      }, 0); // 짧은 지연을 둬서 Settings가 렌더링되도록 함
    } else {
    }
  };

  console.log(settingRef.current);

  return (
    <div
      className='absolute right-0 mt-4 w-80 h-[500px] bg-white 
        border border-gray-200 rounded-2xl shadow-2xl 
        overflow-y-scroll sidebar-scrollbar transition-all duration-300 z-50 scrollbar-gutter-stable'
    >
      <div className='flex items-center p-4 bg-[#D8E9F3] text-black font-bold text-2xl h-[70px]'>Notifications</div>

      <div className='min-h-70 overflow-y-auto'>
        {notifications.length > 0 ? (
          notifications
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // 내림차순 정렬
            .map((notification) => (
              <div
                key={notification.id}
                className='flex flex-col gap-1 p-3 hover:bg-[#EBF3F8] border-b border-gray-100 last:border-b-0'
                onClick={() => alarmClickRouting(notification.fromId, notification.notificationType)}
              >
                <div className='flex flex-row ml-1'>
                  <p className='text-lg text-black font-bold'>{notification.fromName}</p>
                  <p className='text-xs text-black ml-2 mt-2'>
                    {' '}
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
                <p className='text-sm text-gray-700 ml-1 break-words whitespace-normal'>{notification.message}</p>
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
