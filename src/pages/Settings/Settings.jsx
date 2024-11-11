import { useState, forwardRef, useImperativeHandle } from 'react';
import UserComponent from './SettingUser';
import SettingThemee from './SettingTheme';
import SettingMember from './SettingMember';
import SettingInvitation from './SettingInvitation';
import { useNavigate } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';

const Settings = forwardRef(({ onClose }, ref) => {
  const navigate = useNavigate();
  // 어떤 컴포넌트를 불러올지 관리
  const [changeComponent, setChangeComponent] = useState(<UserComponent />);
  const [activeComponent, setActiveComponent] = useState('User');

  useImperativeHandle(ref, () => ({
    showInvitationComponent() {
      handleComponentChange(<SettingInvitation />, 'Invitation');
    },
  }));

  // 컴포넌트를 변경하는 함수
  const handleComponentChange = (component, name) => {
    setChangeComponent(component);
    setActiveComponent(name);
  };

  return (
    // 모달 화면 위치 정의
    <div
      className='fixed flex justify-center items-center inset-0 bg-black bg-opacity-30 z-50 text-black'
      onClick={onClose}
    >
      {/* 모달 크기 정의 */}
      <div
        className='flex flex-col items-center bg-white rounded-lg w-[900px] h-[700px] border rounded-lg'
        onClick={(e) => e.stopPropagation()}
      >
        <header className='flex justify-between items-center w-full h-[80px] text-xl bg-[#f0f5f8] border-none rounded-t-lg'>
          <div className='text-3xl ml-10'>Settings</div>
          <button className='mr-4' onClick={onClose}>
            <IoClose className='text-3xl' />
          </button>
        </header>

        {/* 내부 컴포넌트 크기 정의 */}
        <div className='flex w-full h-full border-none rounded-2xl'>
          {/* 왼쪽에 목록 넣는 곳 */}
          <div className='w-[250px] border-r p-6 border rounded-b-2xl'>
            {/* Account 항목 */}
            <div className='flex flex-col'>
              <p className='text-2xl font-medium ml-2 mb-3'>Account</p>
              <div className='flex flex-col w-full h-72 m-auto'>
                <button
                  className={`w-[100%] h-20 mb-1 ${
                    activeComponent === 'User' ? 'bg-blue-100 font-bold' : ''
                  } hover:bg-blue-100 border-none rounded-xl`}
                  onClick={() => handleComponentChange(<UserComponent />, 'User')}
                >
                  User
                </button>
                <button
                  className={`w-[100%] h-20 mb-1 ${
                    activeComponent === 'Theme' ? 'bg-blue-100 font-bold' : ''
                  } hover:bg-blue-100 border-none rounded-xl`}
                  onClick={() => handleComponentChange(<SettingThemee />, 'Theme')}
                >
                  Theme
                </button>
                <button
                  className={`w-[100%] h-20 ${
                    activeComponent === 'Invitation' ? 'bg-blue-100 font-bold' : ''
                  } hover:bg-blue-100 border-none rounded-xl`}
                  onClick={() => handleComponentChange(<SettingInvitation />, 'Invitation')}
                >
                  Invitation
                </button>
              </div>
            </div>

            {/* WorkSpace 항목 */}
            <div className='flex flex-col'>
              <p className='text-2xl font-medium ml-2 mb-3'>WorkSpace</p>
              <div className='flex flex-col w-full m-auto'>
                <button
                  className={`w-[100%] mb-1 h-20 ${
                    activeComponent === 'Member' ? 'bg-blue-100 font-bold' : ''
                  } hover:bg-blue-100 border-none rounded-xl`}
                  onClick={() => handleComponentChange(<SettingMember />, 'Member')}
                >
                  Member
                </button>
                {/* Exit 누르면 네이게이션해서 WorkSpace 화면으로 이동할 것 */}
                <button
                  className='w-[100%] h-20 hover:bg-blue-100 border-none rounded-xl text-red-500'
                  onClick={() => navigate('/workspaces')}
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
          {/* 오른쪽에 컴포넌트 넣을 곳 */}
          <div className='w-[650px] h-[620px]'>{changeComponent}</div>
        </div>
      </div>
    </div>
  );
});

export default Settings;
