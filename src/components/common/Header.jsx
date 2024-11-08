import { useState, useEffect, useRef } from 'react';
import { FaBell, FaUser, FaCog } from 'react-icons/fa';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchWorkspaces } from '../../api/queries/useWorkspaceQueries';
import Alarm from './Alarm';
import Settings from '../../pages/Settings/Settings';
import useAuthStore from '../../stores/useAuthStore'; // useAuthStore 가져오기
import { useAlarmStore } from '../../stores/useAlarmStore';
import { useFetchWorkspacesDetail } from '../../api/queries/useWorkspaceQueries';
import { useTabStore } from '../../stores/useTabStore';

const Header = () => {
  const [isWorkspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { workspaceId: currentWorkspaceId } = useParams();
  const { data: workspaceDetail } = useFetchWorkspacesDetail(currentWorkspaceId);
  const { removeAllTabs } = useTabStore();
  const [isSettingModalOpen, setSettingModalOpen] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const alarmRef = useRef(null);
  const profileRef = useRef(null);

  const { data: workspaces = [] } = useFetchWorkspaces();
  const logout = useAuthStore((state) => state.logout); // logout 함수 가져오기
  const { received, setReceived } = useAlarmStore();

  const filteredWorkspaces = workspaceDetail
    ? workspaces.filter((workspace) => workspace.projectName !== workspaceDetail.projectName)
    : workspaces;

  const handleMain = () => {
    navigate(`/workspace/${currentWorkspaceId}`);
  };

  const handleWorkspaceSelect = (workspaceId) => {
    removeAllTabs(); // 모든 탭을 닫음
    navigate(`/workspace/${workspaceId}`);
    setWorkspaceDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setWorkspaceDropdownOpen(false);
    }
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className='w-full h-16 bg-[#F0F5F8]/50 text-[#666666] flex items-center px-12 justify-between relative border-b select-none'>
      <h1 className='text-2xl' onClick={handleMain}>
        Support API
      </h1>

      {/* 워크스페이스 이름 및 드롭다운 */}
      <div className='absolute left-1/2 -translate-x-1/2' ref={dropdownRef} style={{ zIndex: 9999, position: 'fixed' }}>
        <div
          className='flex items-center cursor-pointer'
          onClick={() => {
            setWorkspaceDropdownOpen((prev) => !prev);
          }}
        >
          <span className='text-xl'>{workspaceDetail ? workspaceDetail.projectName : 'Loading...'}</span>

          {isWorkspaceDropdownOpen ? (
            <MdArrowDropUp className='text-2xl ml-1' />
          ) : (
            <MdArrowDropDown className='text-2xl ml-1' />
          )}
        </div>
        {isWorkspaceDropdownOpen && (
          <div className='absolute left-0 mt-2 w-48 bg-white text-[#666666] rounded shadow-lg max-h-48 overflow-y-auto sidebar-scrollbar z-50 rounded-lg'>
            <ul>
              {filteredWorkspaces.map((workspace) => (
                <li
                  key={workspace.id}
                  className='px-4 py-2 hover:bg-gray-200 cursor-pointer'
                  onClick={() => handleWorkspaceSelect(workspace.id)}
                >
                  {workspace.projectName}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 오른쪽 아이콘들 */}
      <div className='flex items-center gap-8'>
        {/* 알람 */}
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

        {/* Setting 모달 열기 */}
        <FaCog
          className='text-2xl cursor-pointer'
          onClick={() => {
            setSettingModalOpen(true);
          }}
        />
        {isSettingModalOpen && <Settings onClose={() => setSettingModalOpen(false)} />}

        {/* 프로필 아이콘 및 드롭다운 */}
        <div className='relative' ref={profileRef}>
          <FaUser className='text-2xl cursor-pointer' onClick={() => setProfileDropdownOpen((prev) => !prev)} />
          {isProfileDropdownOpen && (
            <div className='absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-lg'>
              <ul>
                <li className='px-4 py-2 hover:bg-gray-200 cursor-pointer'>Profile</li>
                <li className='px-4 py-2 hover:bg-gray-200 cursor-pointer' onClick={handleLogout}>
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
