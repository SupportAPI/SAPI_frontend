import { useState } from 'react';
import { IoCopyOutline } from 'react-icons/io5';
import { ResizableBox } from 'react-resizable';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import { FaSave } from 'react-icons/fa';
import 'react-resizable/css/styles.css';
import ApiTestParameters from './ApiTestParameters';
import ApiTestBody from './APitestBody';

const ApiTestDetail = () => {
  const [apimethod, setApimethod] = useState('POST');
  const [apiname, setApiname] = useState('API NAME');
  const [apiaddress, setApiaddress] = useState('/api/memberships/membershipid/role');
  const [activeTab, setActiveTab] = useState('Parameters'); // 기본 탭을 'Parameters'로 설정

  const handleCopyAddress = () => {
    // Address 카피할 수 있는 기능 추가할 것
  };

  // 워크스페이스 아이디랑 API 아이디
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Parameters':
        return <ApiTestParameters />;
      case 'Body':
        return <ApiTestBody />;

      default:
        return null;
    }
  };

  return (
    <div className='flex h-full'>
      <div className='flex-1 overflow-hidden'>
        <div className='flex flex-col min-w-[900px] h-screen border-white p-2 rounded-lg'>
          {/* 상단 제목 단 */}
          <div className='mb-4'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center'>
                <div className='w-[80px] border p-3 rounded-lg bg-[#2D3648] text-white mr-4 text-center'>
                  {apimethod}
                </div>
                <div>
                  <div className='text-xl font-semibold'>{apiname}</div>
                  <div className='flex items-center'>
                    <div className='mr-2'>{apiaddress}</div>
                    <button onClick={handleCopyAddress}>
                      <IoCopyOutline />
                    </button>
                  </div>
                </div>
              </div>
              <div className='flex'>
                <button className='w-[80px] border p-3 rounded-lg bg-[#2D3648] text-white mr-4 text-center'>
                  <div className='flex items-center'>
                    <RiArrowDropDownLine className='text-xl' />
                    Local
                  </div>
                </button>
                <button className='w-[80px] border p-3 rounded-lg bg-[#2D3648] text-white mr-4 text-center'>
                  TEST
                </button>
                <button className='flex justify-center items-center w-[50px] border p-3 rounded-lg bg-[#2D3648] text-white'>
                  <FaSave />
                </button>
              </div>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className='flex mb-4 border-b-2 border-gray-200'>
            <button
              className={`w-[200px] p-2 ${activeTab === 'Parameters' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('Parameters')}
            >
              Parameters
            </button>
            <button
              className={`w-[200px] p-2 ${activeTab === 'Body' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('Body')}
            >
              Body
            </button>
          </div>

          {/* 화면 분할 */}
          <ResizableBox
            width={Infinity}
            height={300}
            resizeHandles={['se', 's', 'sw', 'ne', 'nw', 'n']}
            minConstraints={[Infinity, 100]}
            maxConstraints={[Infinity, 600]}
          >
            {/* 탭에 따른 내용 영역 */}
            <div className='p-4 overflow-y-auto border-b h-full sidebar-scrollbar'>{renderTabContent()}</div>
          </ResizableBox>

          {/* 테스트 결과 영역 */}
          <div className='flex-1 p-4 overflow-y-auto bg-gray-100 sidebar-scrollbar'>
            {/* 이 부분에 테스트 결과가 표시됩니다 */}
            <div>테스트 결과가 여기에 표시됩니다.</div>
            <div>테스트 결과가 여기에 표시됩니다.</div>
            <div>테스트 결과가 여기에 표시됩니다.</div>
            <div>테스트 결과가 여기에 표시됩니다.</div>
            <div>테스트 결과가 여기에 표시됩니다.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTestDetail;
