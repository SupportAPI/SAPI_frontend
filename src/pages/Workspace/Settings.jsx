import { useState } from 'react';
import UserComponent from '../Settings/SettingUser';
import SettingThemee from '../Settings/SettingTheme';
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
        className='flex flex-col items-center bg-white border-none rounded-2xl w-[800px] h-[900px] min-w-[800px]'
        onClick={(e) => e.stopPropagation()}
      >
        <header className='flex justify-between items-center w-full h-[10%] text-xl bg-[#f0f5f8] border-none rounded-t-2xl'>
          <div className='text-3xl ml-10'>
            <div>Settings</div>
          </div>
          <button className='mr-4' onClick={onClose}>
            <IoClose className='text-3xl' />
          </button>
        </header>

        {/* 내부 컴포넌트 크기 정의 */}
        <div className='flex w-full h-full border-none rounded-2xl'>
          {/* 왼쪽에 목록 넣는 곳 */}
          <div className='w-[300px] border-r p-6 border rounded-b-2xl'>
            {/* Account 항목 */}
            <div className='flex flex-col'>
              <p className='text-2xl font-medium ml-2 mb-3'>Account</p>
              <div className='flex flex-col w-full h-52 m-auto'>
                <button
                  className={`w-[100%] h-20 mb-1 ${
                    activeComponent === 'User' ? 'bg-blue-100 font-bold' : ''
                  } hover:bg-blue-100 border-none rounded-xl`}
                  onClick={() => handleComponentChange(<UserComponent />, 'User')}
                >
                  User
                </button>
                <button
                  className={`w-[100%] h-20 ${
                    activeComponent === 'Theme' ? 'bg-blue-100 font-bold' : ''
                  } hover:bg-blue-100 border-none rounded-xl`}
                  onClick={() => handleComponentChange(<SettingThemee />, 'Theme')}
                >
                  Theme
                </button>
              </div>
            </div>

            {/* Workspaces에서 아래의 버튼들은 비활성화 상태임 */}
            {/* WorkSpace 항목 */}
            <div className='flex flex-col'>
              <p className='text-2xl font-medium ml-2 mb-3'>WorkSpace</p>
              <div className='flex flex-col w-full m-auto'>
                <button className={`w-[100%] h-20 text-gray-200 `}>Member</button>
                <button className='w-[100%] h-20 text-gray-200'>Exit</button>
              </div>
            </div>
          </div>
          {/* 오른쪽에 컴포넌트 넣을 곳 */}
          <div className='w-[700px]'>{changeComponent}</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
