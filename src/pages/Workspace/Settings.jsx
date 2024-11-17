import { useState } from 'react';
import UserComponent from '../Settings/SettingUser';
import SettingThemee from '../Settings/SettingTheme';
import SettingInvitation from '../Settings/SettingInvitation';
import { IoClose } from 'react-icons/io5';

const Settings = ({ onClose }) => {
  // 어떤 컴포넌트를 불러올지 관리
  const [changeComponent, setChangeComponent] = useState(<UserComponent />);
  const [activeComponent, setActiveComponent] = useState('User');

  // 컴포넌트를 변경하는 함수
  const handleComponentChange = (component, name) => {
    setChangeComponent(component);
    setActiveComponent(name);
  };

  return (
    // 모달 화면 위치 정의
    <div className='fixed flex justify-center items-center inset-0 bg-black bg-opacity-30 z-50' onClick={onClose}>
      {/* 모달 크기 정의 */}
      <div
        className='flex flex-col items-center bg-white border-none rounded-2xl w-[900px] h-[700px] border'
        onClick={(e) => e.stopPropagation()}
      >
        <header className='flex justify-between items-center w-full h-[80px] text-xl bg-[#f0f5f8] dark:bg-dark-background dark:text-dark-text border-none rounded-t-2xl'>
          <div className='text-3xl ml-10'>
            <div>Settings</div>
          </div>
          <button className='mr-4' onClick={onClose}>
            <IoClose className='text-3xl' />
          </button>
        </header>

        <div className='flex w-full h-full border-t rounded-b-2xl dark:bg-dark-background dark:text-dark-text'>
          {/* 왼쪽에 목록 넣는 곳 */}
          <div className='w-[250px] border-r p-6 rounded-b-2xl'>
            {/* Account 항목 */}
            <div className='flex flex-col'>
              <p className='text-2xl font-medium ml-2 mb-1'>Account</p>
              <div className='flex flex-col w-full h-60 m-auto'>
                <button
                  className={`w-[100%] h-16 mb-1 ${
                    activeComponent === 'User'
                      ? 'bg-blue-100 dark:bg-gray-600 font-bold'
                      : 'hover:bg-blue-100 dark:hover:bg-gray-700'
                  } border-none rounded-xl`}
                  onClick={() => handleComponentChange(<UserComponent />, 'User')}
                >
                  User
                </button>
                <button
                  className={`w-[100%] h-16 mb-1 ${
                    activeComponent === 'Theme'
                      ? 'bg-blue-100 dark:bg-gray-600 font-bold'
                      : 'hover:bg-blue-100 dark:hover:bg-gray-700'
                  } border-none rounded-xl`}
                  onClick={() => handleComponentChange(<SettingThemee />, 'Theme')}
                >
                  Theme
                </button>
                <button
                  className={`w-[100%] h-16 ${
                    activeComponent === 'Invitation'
                      ? 'bg-blue-100 dark:bg-gray-600 font-bold'
                      : 'hover:bg-blue-100 dark:hover:bg-gray-700'
                  } border-none rounded-xl`}
                  onClick={() => handleComponentChange(<SettingInvitation />, 'Invitation')}
                >
                  Invitation
                </button>
              </div>
            </div>

            {/* Workspaces에서 아래의 버튼들은 비활성화 상태임 */}
            {/* WorkSpace 항목 */}
            <div className='flex flex-col'>
              <p className='text-2xl font-medium ml-2 mb-3 '>WorkSpace</p>
              <div className='flex flex-col w-full m-auto'>
                <button className={`w-[100%] h-16 text-gray-200 dark:text-dark-mutedText `}>Workspace</button>
                <button className={`w-[100%] h-16 text-gray-200 dark:text-dark-mutedText `}>Member</button>
                <button className='w-[100%] h-16 text-gray-200 dark:text-dark-mutedText'>Exit</button>
              </div>
            </div>
          </div>
          {/* 오른쪽에 컴포넌트 넣을 곳 */}
          <div className='w-[650px] h-[620px]'>{changeComponent}</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
