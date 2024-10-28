import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const Alarm = () => {

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState([
      { id: 1, title: "Friend Request", message: "You have a new friend request.", date: "2024-10-01" },
      { id: 2, title: "Password Changed", message: "Your password was changed successfully.", date: "2024-10-03" },
      { id: 3, title: "Unread Messages", message: "You have unread messages in your inbox.", date: "2024-10-05" },
      { id: 4, title: "Email Verification", message: "Please verify your email addressasdasdasdasdasdasdasdasdasdasdsaasdasdasdasdasdasdasdasdasdasdasdasdasdasdasaddressasdasdasdasdasdasdasdasdasdasdsaasdasdasdasdasdasdaddressasdasdasdasdasdasdasdasdasdasdsaasdasdasdasdasdasdasdasdasdasdasdasdasdasdasaddressasdasdasdasdasdasdasdasdasdasdsaasdasdasdasdasdasdasdasdasdasdasdasdasdasdasaddressasdasdasdasdasdasdasdasdasdasdsaasdasdasdasdasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdas.", date: "2024-10-07" }
    ]);
  
    const toggleNotification = () => {
      setIsNotificationOpen(!isNotificationOpen);
    };
  
    const handleDeleteNotification = (id, event) => {
        event.stopPropagation();
        setNotifications(notifications.filter(notification => notification.id !== id));
    };
  

    return (
        <div className="absolute right-0 mt-4 w-80 h-[500px] bg-white 
        border border-gray-200 rounded-2xl shadow-2xl 
        overflow-y-scroll sidebar-scrollbar transition-all duration-300 z-50"
        >
            <div className="flex items-center p-4 bg-blue-100 font-bold text-2xl h-[70px]">
                Notifications
            </div>
            
            <div className="min-h-70 overflow-y-auto">
                {notifications.length > 0 ? (
                notifications.map((notification) => (
                    <div key={notification.id} className="flex flex-col ml-1 gap-1 p-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex flex-row">
                        <p className="text-lg font-bold">{notification.title}</p>
                        <p className="text-xs ml-2 mt-2">{notification.date}</p>
                        <FiX 
                            className='text-lg mt-1 ml-auto cursor-pointer' 
                            onClick={(event) => handleDeleteNotification(notification.id, event)}
                        />
                    </div>
                    <p className="text-sm text-gray-700 break-words whitespace-normal">{notification.message}</p>
                    </div>
                ))
                ) : (
                <div className="p-4 text-gray-500">No new notifications</div>
                )}
            </div>
        </div>
    );
}

export default Alarm;