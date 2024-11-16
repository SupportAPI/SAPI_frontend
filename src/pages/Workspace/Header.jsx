import { useState, useEffect, useRef } from 'react';
import { FaBell, FaUser, FaCog } from 'react-icons/fa';
import Alarm from '../../components/common/Alarm';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';
import { useAlarmStore } from '../../stores/useAlarmStore';
import { useUserInfo } from '../../api/queries/useWorkspaceQueries';

const Header = ({ onSettingsClick }) => {
  const userId = useAuthStore((state) => state.userId);
  const { data: userInfo } = useUserInfo(userId);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { received, setReceived } = useAlarmStore();

  // 알람에 대한 정보
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const alarmRef = useRef(null);
  const profileRef = useRef(null);

  // 로그아웃
  const logout = useAuthStore((state) => state.logout); // logout 함수 가져오기
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleClickOutside = (event) => {
    if (alarmRef.current && !alarmRef.current.contains(event.target)) {
      setIsNotificationOpen(false);
    }
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setProfileDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // // 알람에 대한 정보 처리하기
  // const [hasNotifications, setHasNotifications] = useState(true);

  // const navigate = useNavigate();

  return (
    <header className='w-full h-16 bg-[#f7fafb] text-[#666666] flex items-center px-12 justify-between relative border-b select-none dark:bg-dark-background dark:text-dark-text'>
      <h1 className='text-2xl font-bold'>Support API</h1>

      {/* 오른쪽 아이콘들 */}
      <div className='flex items-center space-x-8'>
        <div className='relative' ref={alarmRef}>
          <FaBell
            className='text-2xl cursor-pointer'
            onClick={() => {
              setIsNotificationOpen((prev) => !prev);
              setReceived(false);
            }}
          />
          {isNotificationOpen && <Alarm />}
          {received && <span className='absolute top-0 right-0 bg-red-500 rounded-full w-3 h-3'></span>}
        </div>

        {/* 설정에 대한 아이콘 */}
        <FaCog className='text-2xl cursor-pointer' onClick={onSettingsClick} />

        {/* 프로필 아이콘 및 드롭다운 */}
        <div className='relative ' ref={profileRef}>
          <FaUser className='text-2xl cursor-pointer' onClick={() => setProfileDropdownOpen((prev) => !prev)} />
          {isProfileDropdownOpen && (
            <div className='absolute right-0 mt-2 w-[250px] h-auto bg-white text-black rounded-lg shadow-lg '>
              <div className='flex flex-col items-center pt-4 pb-4 dark:bg-dark-background dark:text-dark-text'>
                {/* 프로필 이미지와 유저 정보 */}
                <div className='flex items-center mb-3 px-4 w-full '>
                  <img
                    src={userInfo.profileImage}
                    className='rounded-full w-12 h-12 object-cover border mr-3'
                    alt='Profile'
                  />
                  <div>
                    <div className='text-lg font-semibold text-gray-800 dark:text-dark-text'>{userInfo.nickname}</div>
                    <div className='text-sm text-gray-500 dark:text-dark-text'>{userInfo.email}</div>
                  </div>
                </div>

                {/* 로그아웃 버튼 */}
                <div
                  className='w-full border-t text-center px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer rounded-b-lg'
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
