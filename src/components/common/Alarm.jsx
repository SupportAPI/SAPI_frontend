import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useMutation } from 'react-query';
import { fetchNotifications } from '../../api/queries/useNotificationsQueries';

const Alarm = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const alarmMutation = useMutation(() => fetchNotifications(), {
    onSuccess: (response) => {
      if (response !== undefined) setNotifications(response);
    },
    onError: (error) => {
      console.error('alarm fetch error', error);
    },
  });

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
              >
                <div className='flex flex-row ml-1'>
                  <p className='text-lg text-black font-bold'>{notification.apiName}</p>
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
    </div>
  );
};

export default Alarm;
